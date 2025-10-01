import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DietController } from './diet.controller';
import { DietService } from './diet.service';
import { ExternalApisModule } from '../external-apis/external-apis.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [ConfigModule, ExternalApisModule, SupabaseModule],
  controllers: [DietController],
  providers: [DietService],
  exports: [DietService],
})
export class DietModule {}