import { Controller, Delete, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { ObservacionService } from "./observacion.service";

@Controller('observacion')
@UseGuards(JwtAuthGuard)
export class ObservacionController {
    constructor (private readonly observacionService: ObservacionService) { }
    
    @Delete(':id')
    async DeleteControlDto(
        @Param('id', ParseIntPipe) id: number
    ) {
        await this.observacionService.deleteObservacion({ id });
        return { message: 'Observacion deleted ' };
    };
};