import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity } from '../idea/idea.entity';
import { UserEntity } from '../user/user.entity';
import { CommentDTO, CommentRO } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(ideaId: string, userId: string, data: CommentDTO) {
    const idea = await this.ideaRepository.findOne({ id: ideaId });
    const user = await this.userRepository.findOne({ id: userId });
    const comment = await this.commentRepository.create({
      ...data,
      idea,
      author: user,
    });
    await this.commentRepository.save(comment);
    return comment;
  }

  async showByIdea(ideaId: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id: ideaId },
      relations: ['comments', 'comments.author', 'comments.idea'],
    });

    return idea.comments;
  }

  async showByUser(userId: string) {
    const comments = await this.commentRepository.find({
      where: { author: userId },
      relations: ['author'],
    });
    return comments.map(comment => ({
      ...comment,
      author: comment.author.toResponseObject(false),
    }));
  }

  async show(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'idea'],
    });
    return this.commentToResponseObject(comment);
  }

  async destroy(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (comment.author.id !== userId) {
      throw new HttpException(
        'You do not own this comment',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.commentRepository.remove(comment);
    return this.commentToResponseObject(comment);
  }

  private commentToResponseObject(comment: CommentEntity): CommentRO {
    const responseObject: any = {
      ...comment,
      author: comment.author ? comment.author.toResponseObject(false) : null,
    };
    return responseObject;
  }
}
