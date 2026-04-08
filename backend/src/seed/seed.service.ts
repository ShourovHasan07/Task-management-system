

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';
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
        role: 'ADMIN',
      },
      {
        email: 'user@tech.com',
        password: await bcrypt.hash('user123', 10),
        role: 'USER',
      },
    ]);
    console.log('✅ Predefined users seeded: admin@tech.com / user@tech.com');
  }
}