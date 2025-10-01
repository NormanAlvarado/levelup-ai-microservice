import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { ExternalApisModule } from '../external-apis/external-apis.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [ConfigModule, ExternalApisModule, SupabaseModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}