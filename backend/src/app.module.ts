import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
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
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        models: [User, Task, AuditLog],
        autoLoadModels: true,
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    TasksModule,
    AuditModule,
  ],
  providers: [SeedService],
})
export class AppModule {
  constructor(private readonly seedService: SeedService) {
    this.seedService.seed();
  }
}