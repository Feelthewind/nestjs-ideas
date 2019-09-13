import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { ValidationPipe } from '../shared/validation.pipe';
import { User } from '../user/user.decorator';
import { UserEntity } from '../user/user.entity';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';

@Controller('api/ideas')
export class IdeaController {
  private logger = new Logger('IdeaController');

  constructor(private ideaService: IdeaService) {}

  private logData(options: any) {
    options.user && this.logger.log(`USER ${JSON.stringify(options.user)}`);
    options.body && this.logger.log(`BODY ${JSON.stringify(options.body)}`);
    options.id && this.logger.log(`IDEA ${JSON.stringify(options.id)}`);
  }

  @Get()
  showAllIdeas(@Query('page') page: number) {
    return this.ideaService.showAll(page);
  }

  @Get('/newest')
  showNewestIdeas(@Query('page') page: number) {
    return this.ideaService.showAll(page, true);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@User() user, @Body() body: IdeaDTO) {
    this.logData({ user, body });
    return this.ideaService.create(user.id, body);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    this.logData({ id });
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateIdea(
    @Param('id') id: string,
    @User('id') user,
    @Body() body: Partial<IdeaDTO>,
  ) {
    this.logData({ id, user, body });
    return this.ideaService.update(id, user, body);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyIdea(@Param('id') id: string, @User() user) {
    this.logData({ id, user });
    return this.ideaService.destroy(id, user.id);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  upvoteIdea(@Param('id') id: string, @User() user: UserEntity) {
    this.logData({ id, user });
    return this.ideaService.upvote(id, user.id);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  downvoteIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.downvote(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmarkIdea(@Param('id') id: string, @User() user: UserEntity) {
    this.logData({ id, user });
    return this.ideaService.bookmark(id, user.id);
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  unbookmarkIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.unbookmark(id, user);
  }
}
