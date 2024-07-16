import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, IsNotEmpty } from "class-validator";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @Column()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @Column()
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}
