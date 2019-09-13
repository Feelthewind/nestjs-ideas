import {
  Args,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { CommentService } from 'comment/comment.service';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @Query()
  users(@Args('page') page: number) {
    return this.userService.showAll(page);
  }

  @ResolveProperty()
  comments(@Parent() user) {
    const { id } = user;
    return this.commentService.showByUser(id);
  }
}
