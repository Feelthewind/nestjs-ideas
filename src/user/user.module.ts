import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'comment/comment.entity';
import { CommentService } from 'comment/comment.service';
import { IdeaEntity } from 'idea/idea.entity';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, IdeaEntity, CommentEntity])],
  controllers: [UserController],
  providers: [UserService, UserResolver, CommentService],
})
export class UserModule {}
