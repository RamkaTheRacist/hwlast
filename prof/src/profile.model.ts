import { ApiProperty } from "@nestjs/swagger";
import { Model, DataType, Column, Table} from "sequelize-typescript";



interface ProfileCreationAttrs {
    userId: number;
    email: string;
    firstName: string;
    secondName: string;
    phoneNumber: number;
}

@Table({ tableName: 'profiles' })
export class Profile extends Model<Profile, ProfileCreationAttrs>{

    @ApiProperty({ example: '1', description: "User ID" })
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    userId: number;

    @ApiProperty({ example: 'test@mail.ru', description: "Unique email" })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @ApiProperty({ example: 'Roman', description: "First name" })
    @Column({ type: DataType.STRING, allowNull: false })
    firstName: string;

    @ApiProperty({ example: 'Kurganskii', description: "Second name" })
    @Column({ type: DataType.STRING, allowNull: false })
    secondName: string;

    @ApiProperty({ example: '1234567890', description: "Phone number" })
    @Column({ type: DataType.STRING })
    phoneNumber: number;
}