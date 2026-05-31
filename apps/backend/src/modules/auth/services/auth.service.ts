import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../shared/database/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    role: string = 'RESTAURANT_OWNER'
  ) {
    this.logger.log(`📝 [SIGNUP] Registrando usuario: ${email}`);
    this.logger.debug(`📝 [SIGNUP] Datos: firstName=${firstName}, lastName=${lastName}, phone=${phone}, role=${role}`);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      this.logger.warn(`⚠️ [SIGNUP] Email ya existe: ${email}`);
      throw new BadRequestException('Email already exists');
    }

    // Validar rol permitido
    if (role !== UserRole.RESTAURANT_OWNER && role !== UserRole.ADMIN) {
      this.logger.warn(`⚠️ [SIGNUP] Rol no permitido: ${role}`);
      throw new BadRequestException(`Role must be RESTAURANT_OWNER or ADMIN`);
    }

    this.logger.log(`🔐 [SIGNUP] Hash de contraseña...`);
    const hashedPassword = await bcrypt.hash(password, 10);

    this.logger.log(`💾 [SIGNUP] Guardando usuario en BD...`);
    const userRole = role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.RESTAURANT_OWNER;
    const newUser = await this.prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, phone, role: userRole },
    });

    this.logger.log(`✅ [SIGNUP] Usuario creado: ${newUser.id} con rol: ${role}`);
    const tokens = await this.generateTokens(newUser.id, newUser.email, newUser.role);
    this.logger.log(`🎫 [SIGNUP] Tokens generados para: ${newUser.email}`);
    return { user: { id: newUser.id, email: newUser.email, firstName, lastName, role: newUser.role }, ...tokens };
  }

  async signin(email: string, password: string) {
    this.logger.log(`🔑 [SIGNIN] Intentando login: ${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      this.logger.warn(`⚠️ [SIGNIN] Usuario no encontrado: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`⚠️ [SIGNIN] Contraseña inválida para: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.log(`✅ [SIGNIN] Login exitoso para: ${email}`);
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }, ...tokens };
  }

  async generateTokens(userId: string, email: string, role: string) {
    this.logger.debug(`🎫 [TOKENS] Generando tokens para userId=${userId}, role=${role}`);
    const accessToken = this.jwtService.sign(
      { sub: userId, email, role },
      { expiresIn: '1h', secret: process.env.JWT_SECRET },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
    );

    this.logger.log(`✅ [TOKENS] Tokens generados exitosamente`);
    return { accessToken, refreshToken, expiresIn: 3600 };
  }

  async refreshAccessToken(refreshToken: string) {
    this.logger.log(`🔄 [REFRESH] Refrescando token...`);
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      this.logger.log(`✅ [REFRESH] Token refrescado para usuario: ${user.email}`);
      const tokens = await this.generateTokens(user.id, user.email, user.role);
      return tokens;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ [REFRESH] Error refrescando token: ${errorMessage}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: string) {
    this.logger.debug(`🔍 [VALIDATE] Validando usuario: ${userId}`);
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }
}
