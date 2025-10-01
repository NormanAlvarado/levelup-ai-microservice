import { IsString, IsNumber, IsOptional, IsObject, IsArray, IsEnum, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RecommendationType } from '../types/user.interface';

export class ProgressDataDto {
  @ApiProperty({
    description: 'Number of completed workouts',
    example: 10,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  completedWorkouts: number;

  @ApiProperty({
    description: 'Weight progress in kg (positive for gain, negative for loss)',
    required: false,
    example: -2.5,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  weightProgress?: number;

  @ApiProperty({
    description: 'Strength progress for different exercises',
    required: false,
    example: { 'bench_press': 10, 'squat': 15 },
  })
  @IsOptional()
  @IsObject()
  strengthProgress?: Record<string, number>;

  @ApiProperty({
    description: 'Endurance improvement percentage',
    required: false,
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => parseFloat(value))
  enduranceProgress?: number;

  @ApiProperty({
    description: 'Diet adherence rate (0-100)',
    example: 85,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => parseFloat(value))
  adherenceRate: number;

  @ApiProperty({
    description: 'User feedback or notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  feedback?: string;
}

export class RecommendationDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-123-456-789',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'User progress data',
    type: ProgressDataDto,
  })
  @Type(() => ProgressDataDto)
  progressData: ProgressDataDto;

  @ApiProperty({
    description: 'Current workout plan ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  currentWorkoutId?: string;

  @ApiProperty({
    description: 'Current diet plan ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  currentDietId?: string;

  @ApiProperty({
    description: 'Types of recommendations requested',
    enum: RecommendationType,
    isArray: true,
    required: false,
    example: [RecommendationType.WORKOUT_ADJUSTMENT, RecommendationType.MOTIVATIONAL],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(RecommendationType, { each: true })
  requestedTypes?: RecommendationType[];

  @ApiProperty({
    description: 'Additional context for recommendations',
    required: false,
  })
  @IsOptional()
  @IsString()
  context?: string;
}