import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const { email, password } = authDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, passwordHash });
    await this.userRepository.save(user);

    return { message: 'Registration successful' };
  }

  async login(authDto: AuthDto) {
  const { email, password } = authDto;
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new UnauthorizedException('Invalid credentials');
  }
  return this.generateTokens(user.id, user.email);
}

async refresh(dto: RefreshTokenDto) {
  try {
    const payload = this.jwtService.verify(dto.refreshToken);
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    
    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException('Access Denied');

    const isMatched = await bcrypt.compare(dto.refreshToken, user.hashedRefreshToken);
    if (!isMatched) throw new UnauthorizedException('Access Denied');

    return this.generateTokens(user.id, user.email);
  } catch {
    throw new UnauthorizedException('Session expired');
  }}

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { hashedRefreshToken });

    return { accessToken, refreshToken };
  }
}
