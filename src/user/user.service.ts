import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new User();

      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = createUserDto.password;

      return this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });
    } catch (error) {
      console.error('Erro ao criar um usuario', error);

      throw new InternalServerErrorException(
        'Erro interno ao criar um usuario',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany({
        include: { tasks: true },
      });
    } catch (error) {
      console.error('Erro ao buscar todos os usuarios', error);

      throw new InternalServerErrorException(
        'Erro interno ao buscar todos os usuarios',
      );
    }
  }

  async findOne(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Id de usuario invalido');
    }

    try {
      return await this.prisma.user.findUnique({
        where: { id },
        include: { tasks: true },
      });
    } catch (error) {
      console.error('Erro ao buscar o usuario', error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Usuario com id ${id} nao encontrado`);
      }

      throw new InternalServerErrorException(
        'Erro interno ao buscar o usuario',
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Id de usuario invalido');
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar o usuario', error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Usuario com id ${id} nao encontrado`);
      }

      throw new InternalServerErrorException(
        'Erro interno ao atualizar o usuario',
      );
    }
  }

  async remove(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Id de usuario invalido');
    }

    try {
      await this.prisma.$transaction([
        this.prisma.task.deleteMany({ where: { userId: id } }),
        this.prisma.user.delete({ where: { id } }),
      ]);

      return 'Usuario deletado com sucesso';
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Usuario com id ${id} nao encontrado`);
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'Nao foi possivel excluir o usuario por causa de registros relacionados',
        );
      }

      throw new InternalServerErrorException(
        'Erro interno ao excluir o usuario',
      );
    }
  }
}
