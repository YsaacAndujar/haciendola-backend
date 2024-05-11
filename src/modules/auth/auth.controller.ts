import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SigninDto } from './dto/signing.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }
  
  @Public()
  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signin(signinDto)
  }
}
