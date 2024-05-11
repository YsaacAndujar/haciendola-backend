import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { BadRequestException, Injectable, NotImplementedException, } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindOptionsWhere, MoreThan, Not, Repository } from 'typeorm';
import { encryptPassword } from 'src/utils/encryptPassword';
import { JwtService } from '@nestjs/jwt'
import { SigninDto } from './dto/signing.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserCode } from './entities/user-code.entity';
import { generateCode } from 'src/utils/gererateCode';
import { ChangePasswordByCodeDto } from './dto/change-password-by-code.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserCode)
        private readonly userCodesRepository: Repository<UserCode>,
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
    
    private async getUserByIdOrThrow(id: number){
        const user = await this.userRepository.findOne({
            where:{id}
        })
        if (!user) {
        throw new BadRequestException("Ya existe un usuario con ese username")
        }
        return user
    }

    async changePassword({password}: ChangePasswordDto, userId: number) {
        const user = await this.getUserByIdOrThrow(userId)
        user.password = encryptPassword(password)
        await this.userRepository.update(userId,user)
    }
    
    async updateProfile(updateProfileDto: UpdateProfileDto, userId: number) {
        const user = await this.getUserByIdOrThrow(userId)
        await this.validateUsername(updateProfileDto.username, userId)
        const newData:User = {
            ...user,
            ...updateProfileDto
        }
        await this.userRepository.update(userId,newData)
    }
    
    async forgotPassword({username}: ForgotPasswordDto) {
        const user = await this.userRepository.findOne({
            where: {
                username
            }
        })
        if(!user) return
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        const code: UserCode = {
            id: undefined,
            user,
            code: generateCode(),
            expires,
        }
        await this.userCodesRepository.save(code)
        //todo send code through email
    }
    
    async changePasswordByCode({username, code, password}: ChangePasswordByCodeDto) {
        const error = new BadRequestException('Datos incorrectos')
        const user = await this.userRepository.findOne({
            where: {
                username
            }
        })
        if(!user) throw error
        const currentDate = new Date();
        const codeEntity = await this.userCodesRepository.findOne({
            where: {
                user: { username },
                code,
                expires: MoreThan(currentDate),
              },
        })
        if(!codeEntity) throw error
        
        user.password = encryptPassword(password)
        await this.userRepository.update(user.id, user)
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
