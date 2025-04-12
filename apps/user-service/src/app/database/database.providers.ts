import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB_NAME'),
        entities: [User],
        synchronize: true,
      });
      await dataSource.initialize();
      return dataSource;
    },
    inject: [ConfigService],
  },
];
