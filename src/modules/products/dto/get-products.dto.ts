import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class GetPaginatedProductsDto {
    @ApiProperty({ default: 1, required: false })
    @IsOptional()
    @IsNotEmpty()
    page?: number;
  
    @ApiProperty({ default: 10, required: false })
    @IsOptional()
    @IsNotEmpty()
    limit?: number;
}