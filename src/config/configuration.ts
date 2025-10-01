import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3001),
  
  // OpenAI Configuration
  OPENAI_API_KEY: Joi.string().required(),
  
  // Gemini Configuration
  GEMINI_API_KEY: Joi.string().required(),
  
  // Supabase Configuration
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_SERVICE_KEY: Joi.string().required(),
  
  // AI Provider Configuration
  DEFAULT_AI_PROVIDER: Joi.string().valid('openai', 'gemini').default('openai'),
});

export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  OPENAI_API_KEY: string;
  GEMINI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  DEFAULT_AI_PROVIDER: 'openai' | 'gemini';
}

export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  ai: {
    defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'openai',
  },
});