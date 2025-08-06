import { Module } from '@nestjs/common';
import { CategoryModule } from './modules/category/category.module';
import { TrackModule } from './modules/track/track.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CoreModule, CategoryModule, TrackModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
