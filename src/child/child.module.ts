import { Module } from '@nestjs/common';
import { ChildService } from './child.service';
import { ChildController } from './child.controller';
import { ClasseModule } from 'src/classe/classe.module';

@Module({
  controllers: [ChildController],
  providers: [ChildService],
  imports:[ClasseModule]
})
export class ChildModule {}
