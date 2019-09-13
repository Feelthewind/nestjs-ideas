import { IsString } from 'class-validator';
import { UserRO } from '../user/user.dto';

export class IdeaDTO {
  @IsString()
  idea: string;

  @IsString()
  description: string;
}

export class IdeaRO {
  id: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
  author: UserRO;
  upvotes?: number;
  downvotes?: number;
}
