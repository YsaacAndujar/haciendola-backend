import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { encryptPassword } from 'src/utils/encryptPassword';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly _jwtService: JwtService,
    ){}

    async login(loginDto: LoginDto){
        const user = await this.userRepository.findOne(({
            where:{
                ...loginDto,
                password: encryptPassword(loginDto.password)
            }
        }))
        //todo error on null
        const payload = {
            userId: user.id,
            username: user.username
        }
        const token = await this._jwtService.signAsync(payload, {
            secret: process.env.PRIVATE_KEY,
            expiresIn: process.env.EXPIRES_IN,
          })
        return { token }
    }
    
}
