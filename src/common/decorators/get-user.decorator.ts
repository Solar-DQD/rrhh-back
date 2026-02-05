import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return data ? user?.[data] : user;
    }
);

/**
    With no decorator:

    @Get()
    async getTiposUsuario(@Req() request: any) {
        const user = request.user; <-- user here
        return await this.tipoUsuarioService.getTiposUsuario();
    }

    With decorator:

    @Get()
    async getTiposUsuario(@GetUser() user: JWTPayload) {  <-- gets user directly
        return await this.tipoUsuarioService.getTiposUsuario();
    }
 */