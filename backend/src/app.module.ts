import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuditModule } from './audit/audit.module';
import { SeedService } from './seed/seed.service';

import { User } from './users/users.model';
import { Task } from './tasks/tasks.model';
import { AuditLog } from './audit/audit.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

        console.log('🔥 [DB CONFIG] NODE_ENV =', nodeEnv);
        console.log('🔥 [DB CONFIG] DB_HOST =', configService.get('DB_HOST'));
        console.log('🔥 [DB CONFIG] synchronize =', nodeEnv !== 'production');

        return {
          dialect: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
          username: configService.get<string>('DB_USER') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || 'shourov123',
          database: configService.get<string>('DB_NAME') || 'taskdb',
          models: [User, Task, AuditLog],
          autoLoadModels: true,
          synchronize: nodeEnv !== 'development',   // development-এ টেবিল তৈরি হবে
          logging: nodeEnv !== 'production',
        };
      },
    }),

    EventEmitterModule.forRoot(),

    AuthModule,
    UsersModule,
    TasksModule,
    AuditModule,
  ],
  providers: [SeedService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly seedService: SeedService,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {}

  async onApplicationBootstrap() {
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
    console.log(`🚀 [DEBUG] onApplicationBootstrap | NODE_ENV = ${nodeEnv}`);

    if (nodeEnv === 'development') {
      try {
        console.log('⏳ Forcing database sync...');
        await this.sequelize.sync({ alter: false });   // টেবিল তৈরি/আপডেট করবে
        console.log('✅ Database sync completed');

        console.log('🌱 Running seed service...');
        await this.seedService.seed();
        console.log('✅ Seeding completed successfully');
      } catch (error: any) {
        console.error('❌ Seed/Sync failed:', error.message);
      }
    } else {
      console.log('⚠️ Production mode - skipping auto seed & sync');
    }
  }
}