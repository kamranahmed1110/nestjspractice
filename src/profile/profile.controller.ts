import {
    Controller,
    Get,
    Put,
    Body,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { UserService } from '../user/user.service';
  import { UpdateProfileDto } from '../user/dto/update-profile.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Controller('profile')
  @UseGuards(JwtAuthGuard) // Protect all routes with JWT
  export class ProfileController {
    constructor(private readonly userService: UserService) {}
  
    // GET /profile - Retrieve the authenticated user's profile
    @Get()
    async getProfile(@Req() req: any) {
      const userId = req.user.id; // Extract user ID from the token
      const user = await this.userService.findById(userId);
  
      if (!user) {
        throw new Error('User not found');
      }
  
      return user; // Return user profile
    }
  
    // PUT /profile - Update the authenticated user's profile
    @Put()
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/profile-pictures',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExt = extname(file.originalname);
            callback(null, `${req.user.id}-${uniqueSuffix}${fileExt}`);
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
      const userId = req.user.id; 
      const updatedUser = await this.userService.updateProfile(userId, updateProfileDto, file);
      return updatedUser; 
    }
  }
  