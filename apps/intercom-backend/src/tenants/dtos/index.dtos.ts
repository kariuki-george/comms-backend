import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class ConfirmTenantDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsString()
  @IsUUID()
  tenantConfirmToken: string;
}
