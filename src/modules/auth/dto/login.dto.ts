import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}