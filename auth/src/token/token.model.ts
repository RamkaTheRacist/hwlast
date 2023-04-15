import { ApiProperty } from "@nestjs/swagger";
import { Model, DataType, Column, Table, ForeignKey } from "sequelize-typescript";
import { User } from "src/user/user.model";


@Table({ tableName: 'tokens', createdAt: false })
export class Token extends Model<Token>{

    @ApiProperty({ example: '1', description: "User ID" })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, unique: true })
    userId: number;

    @ApiProperty({ example: 'hjkdawhkjdhawkjdaw', description: "Refresh token" })
    @Column({ type: DataType.TEXT })
    refreshToken: string;


}