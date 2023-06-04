import { IsEmail, IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
enum Role {
    USER,
    ADMIN
}

enum Sex {
    MALE,
    FEMALE
}
export class RegisterDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(32)
    password: string

    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsString()
    @IsOptional()
    address: string

    @IsISO8601({
        strict: true,
    })
    @IsOptional()
    birthday: string

    @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
    @IsString()
    phoneNumber: string
}
