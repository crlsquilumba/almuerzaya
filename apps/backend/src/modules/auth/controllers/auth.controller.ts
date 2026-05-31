import { Controller, Post, Body, HttpCode, Get, UseGuards, Request, Logger, NotFoundException } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  async signup(
    @Body() body: { email: string; password: string; firstName: string; lastName: string; phone?: string; role?: string },
  ) {
    this.logger.log(`📝 [HTTP POST] /auth/signup - ${body.email}`);
    const result = await this.authService.signup(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
      body.phone,
      body.role
    );
    this.logger.log(`✅ [HTTP] Signup exitoso - ${body.email}`);
    return result;
  }

  @Post('signin')
  @HttpCode(200)
  async signin(@Body() body: { email: string; password: string }) {
    this.logger.log(`🔑 [HTTP POST] /auth/signin - ${body.email}`);
    const result = await this.authService.signin(body.email, body.password);
    this.logger.log(`✅ [HTTP] Signin exitoso - ${body.email}`);
    return result;
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: { refreshToken: string }) {
    this.logger.log(`🔄 [HTTP POST] /auth/refresh`);
    const result = await this.authService.refreshAccessToken(body.refreshToken);
    this.logger.log(`✅ [HTTP] Token refrescado`);
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMe(@Request() req: ExpressRequest & { user?: { userId: string } }) {
    if (!req.user?.userId) {
      throw new NotFoundException('User not found in request');
    }
    this.logger.log(`👤 [HTTP GET] /auth/me - userId=${req.user.userId}`);
    const result = await this.authService.validateUser(req.user.userId);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    this.logger.log(`✅ [HTTP] Usuario validado: ${result.email}`);
    return result;
  }

  @Post('logout')
  @HttpCode(200)
  async logout() {
    this.logger.log(`🚪 [HTTP POST] /auth/logout`);
    return { message: 'Logged out successfully' };
  }
}
