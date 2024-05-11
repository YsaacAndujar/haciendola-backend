import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserCode } from './entities/user-code.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([ User ]),
    TypeOrmModule.forFeature([ UserCode ]),
    JwtModule.register({
      global: true,
      secret: process.env.PRIVATE_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),
  ]
})
export class AuthModule {}
