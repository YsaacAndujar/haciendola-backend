import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString
} from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    password: string
}