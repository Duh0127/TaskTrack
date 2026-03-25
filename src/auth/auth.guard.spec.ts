import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const jwtService = {
      verifyAsync: jest.fn(),
    } as unknown as JwtService;

    expect(new AuthGuard(jwtService)).toBeDefined();
  });
});
