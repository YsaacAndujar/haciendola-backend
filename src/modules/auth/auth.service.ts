import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { BadRequestException, Injectable, NotImplementedException, } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { encryptPassword } from 'src/utils/encryptPassword';
import { JwtService } from '@nestjs/jwt'
import { SigninDto } from './dto/signing.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
        
        if(!user){
            throw new BadRequestException('Credenciales incorrectas')
        }

        return await this.generateToken(user)
    }

    private async validateUsername(username:string, id: number = undefined) {
        const where: FindOptionsWhere<User> = {
            username,
        }
        if (id) {
          where.id = Not(id)
        }
        const user = await this.userRepository.findOne({
          where
        })
        if (user) {
          throw new BadRequestException("Ya existe un usuario con ese username")
        }
      }
    
    async changePassword({password}: ChangePasswordDto, userId: number) {
        throw new NotImplementedException()
    }
    
    async updateProfile({username}: UpdateProfileDto, userId: number) {
        throw new NotImplementedException()
    }

    async signin(signinDto: SigninDto){
        await this.validateUsername(signinDto.username)
        const user = await this.userRepository.save(({
            ...signinDto,
            password: encryptPassword(signinDto.password)
        }))
        
        return await this.generateToken(user)
    }

    private async generateToken(user: User){
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
