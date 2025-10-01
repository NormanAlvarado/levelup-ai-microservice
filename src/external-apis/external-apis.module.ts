import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAiProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';

@Module({
  imports: [ConfigModule],
  providers: [OpenAiProvider, GeminiProvider],
  exports: [OpenAiProvider, GeminiProvider],
})
export class ExternalApisModule {}