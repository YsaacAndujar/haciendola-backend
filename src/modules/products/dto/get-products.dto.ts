import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class GetPaginatedProductsDto {
    @ApiProperty({ default: 0, required: false })
    @IsOptional()
    @IsNotEmpty()
    page?: number=0;

    @ApiProperty({ default: 10, required: false })
    @IsOptional()
    @IsNotEmpty()
    take?: number=10;

    @ApiProperty({ required: false })
    @IsOptional()
    handle?: string;
}