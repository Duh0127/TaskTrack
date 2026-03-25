import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET_KEY');
        if (!secret) throw new Error('JWT_SECRET_KEY nao foi configurado.');

        return {
          global: true,
          secret,
          signOptions: {
            expiresIn:
              configService.get<StringValue>('JWT_EXPIRES_IN') ??
              ('15m' as StringValue),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
