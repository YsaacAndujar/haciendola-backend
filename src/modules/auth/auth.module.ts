import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([ User ]),
    JwtModule.register({
      global: true,
      secret: process.env.PRIVATE_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),
  ]
})
export class AuthModule {}
