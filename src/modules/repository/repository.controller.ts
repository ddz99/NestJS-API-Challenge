import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { Repository as RepositoryEntity } from './repository.entity';

@Controller('repositories')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get('search?')
  async searchRepositories(
    @Query('q') keyword: string,
  ): Promise<RepositoryEntity[]> {
    // console.log(keyword)
    return this.repositoryService.searchRepositories(keyword);
  }

  @Post(':username')
  async copyUserRepositories(
    @Param('username') username: string,
  ): Promise<RepositoryEntity[]> {
    return this.repositoryService.fetchAndStoreRepositories(username);
  }
  
  @Get(':userLogin')
  async getUserRepositories(
    @Param('userLogin') userLogin: string,
  ): Promise<RepositoryEntity[]> {
    return this.repositoryService.getRepositoriesByUser(userLogin);
  }

}
