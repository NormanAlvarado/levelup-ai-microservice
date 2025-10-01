import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { WorkoutModule } from '../workout/workout.module';
import { DietModule } from '../diet/diet.module';
import { RecommendationModule } from '../recommendation/recommendation.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    ConfigModule,
    WorkoutModule,
    DietModule,
    RecommendationModule,
    SupabaseModule,
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}