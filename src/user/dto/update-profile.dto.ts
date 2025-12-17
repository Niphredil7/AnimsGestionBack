import { IsString, IsEmail, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

// 1. DTO pour la mise à jour du profil (sans mot de passe)
export class ProfileUpdateDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  zipCode?: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  available?: string;
  
  @IsOptional()
  @IsString()
  content?: string;
}