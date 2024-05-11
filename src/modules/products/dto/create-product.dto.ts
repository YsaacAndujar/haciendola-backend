import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString
} from 'class-validator';

export class CreateProductDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    handle: string;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    title: string;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    description: string;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    sku: string;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    grams: number;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsInt()
    stock: number;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    price: number;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    comparePrice: number;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    barcode: string;
}