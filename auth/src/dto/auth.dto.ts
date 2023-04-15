import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class AuthDto {

    @ApiProperty({ example: 'test@mail.ru', description: "Unique email" })
    @IsString({ message: 'Must be string' })
    @IsEmail({}, { message: 'Unvalid mail' })
    readonly email: string;

    @ApiProperty({ example: '123', description: "Password" })
    @IsString({ message: 'Must be string' })
    @Length(4, 35, { message: 'Must be longer than 4 and shorter than 35' })
    readonly password: string;
}