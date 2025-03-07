import { Module } from '@nestjs/common';
import postgresConfig, { PostgresConfig } from './postgres.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const postgresConfig = configService.get<PostgresConfig>('postgresql');
        return {
          type: 'postgres',
          host: postgresConfig.host,
          port: postgresConfig.port,
          username: postgresConfig.username,
          password: postgresConfig.password,
          database: postgresConfig.database,
          autoLoadEntities: true,
          synchronize: true,
          ssl: postgresConfig.host !== 'localhost',
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class PostgresqlModule {}
