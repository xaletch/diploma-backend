import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { UserStatus } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from "class-validator";

// class EmployeeDto {
//   @ApiProperty({
//     example: "123e4567-e89b-12d3-a456-426614174000",
//     description: "ID локации",
//   })
//   @IsUUID()
//   @IsString()
//   id: string;

//   @ApiProperty({
//     example: "example@gmail.com",
//     description: "Email",
//   })
//   @IsEmail()
//   email: string;

//   @ApiProperty({
//     example: "Имя Фамилия",
//     description: "Полное имя",
//   })
//   @IsString()
//   name: string;

//   @ApiProperty({
//     example: "8 999 999 99 99",
//     description: "Номер телефона",
//   })
//   @IsPhoneNumber("RU")
//   phone: string;

//   @ApiProperty({
//     example: "71657a704cb3726f8f1116879bd6f908.jpg",
//     description: "Аватар",
//   })
//   @IsString()
//   avatar: string;

//   @ApiProperty({
//     example: "active",
//     description: "Статус",
//   })
//   @IsEnum(UserStatus)
//   status: UserStatus;

//   @ApiProperty({
//     example: "Глав. Разработчик",
//     description: "Позиция",
//   })
//   @IsString()
//   position: string;
// }

export class CompanyEmployeesDto {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "user id",
  })
  @IsUUID()
  @IsString()
  id: string;

  @ApiProperty({
    example: "example@gmail.com",
    description: "Email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "Имя Фамилия",
    description: "Полное имя",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "8 999 999 99 99",
    description: "Номер телефона",
  })
  @IsPhoneNumber("RU")
  phone: string;

  @ApiProperty({
    example: "71657a704cb3726f8f1116879bd6f908.jpg",
    description: "Аватар",
  })
  @IsString()
  avatar: string;

  @ApiProperty({
    example: "active",
    description: "Статус",
  })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty({
    example: "Глав. Разработчик",
    description: "Позиция",
  })
  @IsString()
  position: string;
}
