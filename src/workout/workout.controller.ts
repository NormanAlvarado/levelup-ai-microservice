import { Controller, Post, Get, Body, Param, ValidationPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiParam } from '@nestjs/swagger';
import { WorkoutService } from './workout.service';
import { GenerateWorkoutDto } from '../shared/dto/generate-workout.dto';
import { WorkoutPlan } from '../shared/types/workout.interface';
import { ApiResponse } from '../shared/utils/api-response';

@ApiTags('Workout')
@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  @ApiOperation({
    summary: 'Generate personalized workout plan',
    description: 'Creates a personalized workout plan based on user preferences, goals, and fitness level',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Workout plan generated successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: 'uuid-123',
          name: 'Muscle Growth Plan',
          exercises: [
            {
              name: 'Bench Press',
              sets: 4,
              reps: '8-10',
              weight: '70-80kg',
              restTime: '2-3 min',
              instructions: 'Keep your back flat on the bench...',
              targetMuscles: ['chest', 'triceps', 'shoulders'],
              equipment: 'barbell'
            }
          ]
        },
        message: 'Workout plan generated successfully'
      }
    }
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @SwaggerApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to generate workout plan',
  })
  async generateWorkout(
    @Body(ValidationPipe) generateWorkoutDto: GenerateWorkoutDto,
  ): Promise<ApiResponse<WorkoutPlan>> {
    return await this.workoutService.generateWorkout(generateWorkoutDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get workout plan by ID',
    description: 'Retrieves a specific workout plan by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Workout plan ID',
    type: 'string',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Workout plan retrieved successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workout plan not found',
  })
  async getWorkout(@Param('id') id: string): Promise<ApiResponse<WorkoutPlan>> {
    return await this.workoutService.getWorkout(id);
  }

  @Post(':id/regenerate')
  @ApiOperation({
    summary: 'Regenerate workout plan with modifications',
    description: 'Creates a new version of an existing workout plan with specified modifications',
  })
  @ApiParam({
    name: 'id',
    description: 'Existing workout plan ID',
    type: 'string',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Workout plan regenerated successfully',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Original workout plan not found',
  })
  async regenerateWorkout(
    @Param('id') id: string,
    @Body(ValidationPipe) modifications: Partial<GenerateWorkoutDto>,
  ): Promise<ApiResponse<WorkoutPlan>> {
    return await this.workoutService.regenerateWorkout(id, modifications);
  }
}