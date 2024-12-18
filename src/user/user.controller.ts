// src/user/user.controller.ts

import { Controller, Get, Put, Body, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; 
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req: any) {
    
    const userId = req.user.id; 
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user; 
  }

  @Put()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          callback(null, `${req.user.id}-${uniqueSuffix}${fileExt}`); // Use 'req.user' to access the user ID
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Extract user ID from the token
    const userId = req.user.id;
    const updatedUser = await this.userService.updateProfile(userId, updateProfileDto, file);

    return updatedUser; // Return the updated user profile
  }
}
