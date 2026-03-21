import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../database/prisma/prisma.service'
import { UserService } from './user.service'

jest.mock('../database/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}))

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
