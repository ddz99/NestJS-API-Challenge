import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repository as RepositoryEntity } from './entities/repository.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(RepositoryEntity)
    private repoRepository: Repository<RepositoryEntity>,
    private httpService: HttpService,
  ) {}

  async fetchAndStoreRepositories(username: string): Promise<RepositoryEntity[]> {
    const url = `https://api.github.com/users/${username}/repos`;
    const response = await firstValueFrom(this.httpService.get(url));

    if (response.status !== 200) {
      throw new NotFoundException(`GitHub user ${username} not found.`);
    }

    const repositories = response.data.map(repo => {
      const repository = new RepositoryEntity();
      repository.repositoryId = repo.id;
      repository.name = repo.name;
      repository.description = repo.description;
      repository.url = repo.html_url;
      repository.mainLanguage = repo.language;
      repository.creationDate = new Date(repo.created_at);
      repository.userId = repo.owner.id;
      repository.userLogin = repo.owner.login;
      repository.userAvatar = repo.owner.avatar_url;
      return repository;
    });

    return this.repoRepository.save(repositories);
  }
  async getRepositoriesByUser(userLogin: string): Promise<RepositoryEntity[]> {
    const repositories = await this.repoRepository.find({
      where: { userLogin },
      select: [
        'repositoryId',
        'name',
        'description',
        'url',
        'mainLanguage',
        'creationDate',
      ],
    });

    if (repositories.length === 0) {
      throw new NotFoundException(`No repositories found for user ${userLogin}.`);
    }

    return repositories;
  }

  async searchRepositories(keyword: string): Promise<RepositoryEntity[]> {
    // console.log(keyword)
    const query = this.repoRepository
      .createQueryBuilder('repository')
      .where('repository.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('repository.description ILIKE :keyword', { keyword: `%${keyword}%` })
      .select([
        'repository.repositoryId',
        'repository.name',
        'repository.description',
        'repository.url',
        'repository.mainLanguage',
        'repository.creationDate',
      ]);
    console.log('Generated Query:', query.getSql());
    return query.getMany();
  }
}
