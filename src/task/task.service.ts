import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: createTaskDto.userId },
    });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    try {
      return await this.prisma.task.create({
        data: {
          title: createTaskDto.title,
          content: createTaskDto.content,
          userId: createTaskDto.userId,
        },
      });
    } catch (error) {
      console.error('Erro ao criar uma tarefa', error);

      throw new InternalServerErrorException(
        'Erro interno ao criar uma tarefa',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.task.findMany();
    } catch (error) {
      console.error('Erro ao buscar todas as tarefas', error);

      throw new InternalServerErrorException(
        'Erro interno ao buscar todas as tarefas',
      );
    }
  }

  async findOne(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Id da tarefa invalido');
    }

    try {
      return await this.prisma.task.findUnique({ where: { id } });
    } catch (error) {
      console.error('Erro ao buscar a tarefa', error);

      throw new InternalServerErrorException('Erro interno ao buscar a tarefa');
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Id da tarefa invalido');
    }

    try {
      return await this.prisma.task.update({
        where: { id },
        data: {
          title: updateTaskDto.title,
          content: updateTaskDto.content,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar a tarefa', error);

      throw new InternalServerErrorException(
        'Erro interno ao atualizar a tarefa',
      );
    }
  }

  async remove(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Id da tarefa invalido');
    }

    try {
      await this.prisma.task.delete({ where: { id } });
      return 'Tarefa excluída com sucesso';
    } catch (error) {
      console.error('Erro ao excluir uma tarefa', error);

      throw new InternalServerErrorException(
        'Erro interno ao excluir a tarefa',
      );
    }
  }
}
