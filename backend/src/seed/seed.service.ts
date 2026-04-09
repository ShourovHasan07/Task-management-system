import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from '../users/users.model'; // ✅ enum import করো
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async seed() {
    const count = await this.userModel.count();
    if (count > 0) return;

    await this.userModel.bulkCreate([
      {
        email: 'admin@tech.com',
        password: await bcrypt.hash('admin123', 10),
        role: UserRole.ADMIN, // ✅ FIX
      },
      {
        email: 'user@tech.com',
        password: await bcrypt.hash('user123', 10),
        role: UserRole.USER, // ✅ FIX
      },
    ]);

    console.log(' Predefined users seeded: admin@tech.com / user@tech.com');
  }
}