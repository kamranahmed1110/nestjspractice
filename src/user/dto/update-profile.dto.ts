// src/common/dto/update-profile.dto.ts

import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  username?: string;  

  @IsEmail()
  @IsOptional()
  email?: string;  

  @IsString()
  @IsOptional()
  profilePicture?: string;  

  @IsString()
  @IsOptional()
  password?: string;  
}
