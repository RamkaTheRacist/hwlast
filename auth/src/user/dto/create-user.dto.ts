import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'test@mail.ru', description: "Unique email" })
    @IsString({ message: 'Must be string' })
    @IsEmail({}, { message: 'Unvalid mail' })
    readonly email: string;

    @ApiProperty({ example: '123', description: "Password" })
    @IsString({ message: 'Must be string' })
    @Length(4, 35, { message: 'Must be longer than 4 and shorter than 35' })
    readonly password: string;

    @ApiProperty({ example: 'Roman', description: "First name" })
    @IsString({ message: 'Must be string' })
    @Length(4, 254, { message: 'Must be longer than 4 and shorter than 254' })
    readonly firstName: string;

    @ApiProperty({ example: 'Kurganskii', description: "Second name" })
    @IsString({ message: 'Must be string' })
    @Length(4, 254, { message: 'Must be longer than 4 and shorter than 254' })
    readonly secondName: string;

    @ApiProperty({ example: '1234567890', description: "Phone number" })
    @IsNumber({}, { message: 'Must be number' })
    readonly phoneNumber: number;
}