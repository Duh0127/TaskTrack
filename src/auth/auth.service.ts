import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AuthSignupDto } from './dto/auth-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    if (!user) throw new ForbiddenException('Email ou senha Inválidos');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ForbiddenException('Email ou senha Inválidos');

    const payload = { sub: user.id };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async signup(
    credentials: AuthSignupDto,
  ): Promise<{ id: number; name: string; email: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
      select: { id: true },
    });
    if (user) throw new ForbiddenException('Este usuário já possui cadastro');

    const newUser = await this.prisma.user.create({
      data: credentials,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return newUser;
  }
}
