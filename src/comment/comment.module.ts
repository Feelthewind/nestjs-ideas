import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from '../idea/idea.entity';
import { UserEntity } from '../user/user.entity';
import { CommentController } from './comment.controller';
import { CommentEntity } from './comment.entity';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, UserEntity, IdeaEntity])],
  controllers: [CommentController],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
