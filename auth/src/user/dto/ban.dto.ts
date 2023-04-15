import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber } from "class-validator";

export class BanDto {
    @ApiProperty({ example: '1', description: "User ID" })
    @IsNumber({}, { message: 'Must be number' })
    readonly userId: number;

    @ApiProperty({ example: 'true', description: "Ban or not" })
    @IsBoolean({ message: 'Must be boolean' })
    readonly ban: boolean;

    @ApiProperty({ example: 'Any reason', description: "Ban reason" })
    readonly banReason: string;
}