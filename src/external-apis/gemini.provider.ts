import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { GenerateWorkoutDto } from '../shared/dto/generate-workout.dto';
import { GenerateDietDto } from '../shared/dto/generate-diet.dto';
import { RecommendationDto } from '../shared/dto/recommendation.dto';

@Injectable()
export class GeminiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private httpClient: AxiosInstance;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('gemini.apiKey') || '';
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    this.httpClient = axios.create({
      baseURL: 'https://generativelanguage.googleapis.com/v1beta',
      timeout: 30000,
    });
  }

  async generateWorkoutPlan(dto: GenerateWorkoutDto): Promise<any> {
    try {
      const prompt = this.buildWorkoutPrompt(dto);
      
      const response = await this.httpClient.post(
        `/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Eres un entrenador personal experto. Genera un plan de entrenamiento personalizado en formato JSON válido. 
                  El JSON debe tener la estructura exacta: {
                    "name": "string",
                    "description": "string",
                    "exercises": [
                      {
                        "name": "string",
                        "sets": number,
                        "reps": "string",
                        "weight": "string (opcional)",
                        "duration": "string (opcional)",
                        "restTime": "string",
                        "instructions": "string",
                        "targetMuscles": ["string"],
                        "equipment": "string (opcional)"
                      }
                    ]
                  }
                  
                  Requisitos:
                  ${prompt}
                  
                  Responde SOLO con el JSON válido, sin texto adicional ni markdown.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        }
      );

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('No response from Gemini');
      }

      // Clean the response from potential markdown formatting
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedContent);
    } catch (error) {
      this.logger.error('Error generating workout plan with Gemini:', error);
      throw new Error(`Failed to generate workout plan: ${error.message}`);
    }
  }

  async generateDietPlan(dto: GenerateDietDto): Promise<any> {
    try {
      const prompt = this.buildDietPrompt(dto);
      
      const response = await this.httpClient.post(
        `/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Eres un nutricionista experto. Genera un plan nutricional personalizado en formato JSON válido.
                  El JSON debe tener la estructura exacta: {
                    "name": "string",
                    "description": "string",
                    "meals": [
                      {
                        "name": "string",
                        "items": [
                          {
                            "name": "string",
                            "quantity": "string",
                            "calories": number,
                            "protein": number,
                            "carbs": number,
                            "fat": number
                          }
                        ],
                        "totalCalories": number,
                        "macros": {
                          "protein": number,
                          "carbs": number,
                          "fat": number,
                          "fiber": number
                        },
                        "instructions": "string (opcional)",
                        "prepTime": number
                      }
                    ]
                  }
                  
                  Requisitos:
                  ${prompt}
                  
                  Responde SOLO con el JSON válido, sin texto adicional ni markdown.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,
          }
        }
      );

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('No response from Gemini');
      }

      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedContent);
    } catch (error) {
      this.logger.error('Error generating diet plan with Gemini:', error);
      throw new Error(`Failed to generate diet plan: ${error.message}`);
    }
  }

  async generateRecommendations(dto: RecommendationDto): Promise<any> {
    try {
      const prompt = this.buildRecommendationPrompt(dto);
      
      const response = await this.httpClient.post(
        `/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Eres un coach de fitness y nutrición experto. Genera recomendaciones personalizadas basadas en el progreso del usuario en formato JSON válido.
                  El JSON debe tener la estructura exacta: {
                    "recommendations": [
                      {
                        "type": "workout_adjustment|diet_modification|rest_recommendation|goal_suggestion|motivational",
                        "title": "string",
                        "description": "string",
                        "priority": "low|medium|high|critical",
                        "category": "fitness|nutrition|recovery|motivation|health",
                        "actionable": boolean,
                        "metadata": object
                      }
                    ]
                  }
                  
                  Análisis del usuario:
                  ${prompt}
                  
                  Responde SOLO con el JSON válido, sin texto adicional ni markdown.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2000,
          }
        }
      );

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('No response from Gemini');
      }

      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedContent);
    } catch (error) {
      this.logger.error('Error generating recommendations with Gemini:', error);
      throw new Error(`Failed to generate recommendations: ${error.message}`);
    }
  }

  private buildWorkoutPrompt(dto: GenerateWorkoutDto): string {
    return `
Genera un plan de entrenamiento personalizado con las siguientes especificaciones:
- Objetivo: ${dto.goal}
- Nivel de dificultad: ${dto.difficulty}
- Días por semana: ${dto.daysPerWeek}
- Duración por sesión: ${dto.duration} minutos
${dto.equipment ? `- Equipamiento disponible: ${dto.equipment.join(', ')}` : ''}
${dto.targetMuscles ? `- Músculos objetivo: ${dto.targetMuscles.join(', ')}` : ''}
${dto.preferences ? `- Preferencias adicionales: ${dto.preferences}` : ''}

El plan debe incluir ejercicios variados, apropiados para el nivel y objetivo especificado.
    `.trim();
  }

  private buildDietPrompt(dto: GenerateDietDto): string {
    return `
Genera un plan nutricional personalizado con las siguientes especificaciones:
- Objetivo: ${dto.goal}
- Calorías diarias: ${dto.calories}
- Comidas por día: ${dto.mealsPerDay || 4}
${dto.restrictions ? `- Restricciones dietéticas: ${dto.restrictions.join(', ')}` : ''}
${dto.targetProtein ? `- Proteína objetivo: ${dto.targetProtein}g` : ''}
${dto.preferredFoods ? `- Alimentos preferidos: ${dto.preferredFoods.join(', ')}` : ''}
${dto.avoidFoods ? `- Alimentos a evitar: ${dto.avoidFoods.join(', ')}` : ''}
${dto.preferences ? `- Preferencias adicionales: ${dto.preferences}` : ''}

El plan debe ser balanceado, nutritivo y cumplir con las restricciones especificadas.
    `.trim();
  }

  private buildRecommendationPrompt(dto: RecommendationDto): string {
    const { progressData } = dto;
    return `
Analiza el progreso del usuario y genera recomendaciones personalizadas:
- Entrenamientos completados: ${progressData.completedWorkouts}
- Progreso de peso: ${progressData.weightProgress || 'No especificado'}
- Progreso de fuerza: ${JSON.stringify(progressData.strengthProgress) || 'No especificado'}
- Progreso de resistencia: ${progressData.enduranceProgress || 'No especificado'}%
- Tasa de adherencia: ${progressData.adherenceRate}%
${progressData.feedback ? `- Feedback del usuario: ${progressData.feedback}` : ''}
${dto.context ? `- Contexto adicional: ${dto.context}` : ''}

Genera 3-5 recomendaciones específicas y accionables para mejorar el rendimiento del usuario.
    `.trim();
  }
}