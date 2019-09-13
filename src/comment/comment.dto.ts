import { IsString } from 'class-validator';
import { IdeaRO } from '../idea/idea.dto';
import { UserRO } from '../user/user.dto';

export class CommentDTO {
  @IsString()
  comment: string;
}

export class CommentRO {
  id: string;
  created: Date;
  comment: string;
  author: UserRO;
  idea: IdeaRO;
}
