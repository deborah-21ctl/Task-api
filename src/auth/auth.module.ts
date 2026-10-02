import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import{JwtModule} from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),

 JwtModule.register({
    secret: 'temporary-secret-key', // Replace with a secure
    signOptions: { expiresIn: '1h' }, // Token expiration time

  })

],


  controllers: [AuthController],

  providers: [AuthService],
  exports:[JwtModule]
})
export class AuthModule {}
