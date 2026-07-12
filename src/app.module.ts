import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (env) => {
        const required = [
          'DB_HOST',
          'DB_PORT',
          'DB_USERNAME',
          'DB_PASSWORD',
          'DB_DATABASE',
        ];
        const missing = required.filter((k) => !env[k]);
        if (missing.length) {
          throw new Error(`Missing required env vars: ${missing.join(', ')}`);
        }
        return env;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true, // Note: Set to false in production!
      }),
    }),
    AuthModule,
    ServicesModule,
    BookingsModule,
  ],
})
export class AppModule {}
