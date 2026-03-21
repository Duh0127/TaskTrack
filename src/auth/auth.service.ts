import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

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

    const payload = { sub: user.id, username: user.name };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
