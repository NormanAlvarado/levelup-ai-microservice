import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { WorkoutModule } from './workout/workout.module';
import { DietModule } from './diet/diet.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ExternalApisModule } from './external-apis/external-apis.module';
import configuration, { validationSchema } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    AiModule,
    WorkoutModule,
    DietModule,
    RecommendationModule,
    SupabaseModule,
    ExternalApisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
