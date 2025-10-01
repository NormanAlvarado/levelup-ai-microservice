import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';
import { ExternalApisModule } from '../external-apis/external-apis.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [ConfigModule, ExternalApisModule, SupabaseModule],
  controllers: [WorkoutController],
  providers: [WorkoutService],
  exports: [WorkoutService],
})
export class WorkoutModule {}