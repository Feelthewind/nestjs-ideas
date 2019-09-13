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

  private toResponseObject(comment: CommentEntity) {
    return {
      ...comment,
      author: comment.author && comment.author.toResponseObject(),
    };
  }

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

  async showByIdea(ideaId: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { idea: { id: ideaId } },
      relations: ['author', 'idea'],
      take: 25,
      skip: 25 * (page - 1),
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async showByUser(userId: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { author: userId },
      relations: ['author', 'idea'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return comments.map(comment => this.toResponseObject(comment));
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
