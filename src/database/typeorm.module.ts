import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DBSource } from './datasource';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        await DBSource.initialize().then(async () => {
          //console.log("Data Source Mysql has been initialized!")
          //DBSource.runMigrations({transaction:'all'})
        });
        return DBSource;
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmDBModule {}
