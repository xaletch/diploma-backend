import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class DirectoryEmployee {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID локации",
  })
  @IsUUID()
  @IsString()
  id!: string;

  @ApiProperty({
    example: "example@gmail.com",
    required: true,
    description: "Email",
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: "Обязательное поле" })
  email!: string;

  @ApiProperty({
    example: "Вова",
    required: true,
    description: "Имя",
  })
  @IsString()
  @IsNotEmpty({ message: "Обязательное поле" })
  first_name!: string;

  @ApiProperty({
    example: "Пупкин",
    required: false,
    description: "Фамилия",
  })
  @IsString()
  @IsOptional()
  last_name!: string;

  @ApiProperty({
    example: { id: 3, name: "Администратор" },
    required: true,
    description: "Объект роли с ID и названием",
    type: () => ({
      id: { type: Number, description: "ID роли" },
      name: { type: String, description: "Название роли" },
    }),
  })
  @IsObject()
  role!: {
    id: number;
    name: string;
  };

  @ApiProperty({
    example: "Финансовый аналитик",
    required: true,
    description: "Должность",
  })
  @IsString()
  position!: string;

  @ApiProperty({
    example: "123e4567426614174000.png",
    description: "Фото",
  })
  @IsString()
  avatar!: string;
}
