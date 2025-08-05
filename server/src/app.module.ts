import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { TrackModule } from './modules/track/track.module';

@Module({
  imports: [UserModule, CategoryModule, TrackModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
