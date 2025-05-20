import { DataSource } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

export const refreshTokenProvider = [
  {
    provide: 'REFRESHTOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RefreshToken),
    inject: ['DATA_SOURCE'],
  },
];
