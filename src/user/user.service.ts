import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Express } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto, file: Express.Multer.File) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (file) {
      user.profilePicture = file.path; // Save file path in the database
    }
    Object.assign(user, updateProfileDto);
    await this.userRepository.save(user);
    return user;
  }
}
