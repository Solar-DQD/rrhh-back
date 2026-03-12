import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
    error: string;
    field?: string;
    statusCode: number;
    timestamp: string;
    path: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let field: string | undefined;

        //Http Exception handler
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                message = (exceptionResponse as any).message || message;
                field = (exceptionResponse as any).field;
            };
        }

        //Syntax error handler
        else if (exception instanceof SyntaxError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Invalid JSON';
            this.logger.warn(`[${request.method}] ${request.url} - ${message}`)
        }

        //Unexpected error handler
        else if (exception instanceof Error) {
            this.logger.error(
                `[${request.method}] ${request.url} - ${exception.message}`,
                exception.stack
            );
        }

        //Unknown error handler
        else {
            this.logger.error(
                `[${request.method}] ${request.url} - Unknown error`,
                String(exception),
            )
        };

        const errorResponse: ErrorResponse = {
            error: message,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url
        };

        if (field) {
            errorResponse.field = field
        };

        response.status(status).json(errorResponse);
    };
};