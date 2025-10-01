import { IsString, IsEnum, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WorkoutGoal, WorkoutDifficulty } from '../types/workout.interface';

export class GenerateWorkoutDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-123-456-789',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Workout goal',
    enum: WorkoutGoal,
    example: WorkoutGoal.GAIN_MUSCLE,
  })
  @IsEnum(WorkoutGoal)
  goal: WorkoutGoal;

  @ApiProperty({
    description: 'Workout difficulty level',
    enum: WorkoutDifficulty,
    example: WorkoutDifficulty.INTERMEDIATE,
  })
  @IsEnum(WorkoutDifficulty)
  difficulty: WorkoutDifficulty;

  @ApiProperty({
    description: 'Number of workout days per week',
    minimum: 1,
    maximum: 7,
    example: 4,
  })
  @IsNumber()
  @Min(1)
  @Max(7)
  @Transform(({ value }) => parseInt(value))
  daysPerWeek: number;

  @ApiProperty({
    description: 'Workout duration in minutes',
    minimum: 15,
    maximum: 180,
    example: 60,
  })
  @IsNumber()
  @Min(15)
  @Max(180)
  @Transform(({ value }) => parseInt(value))
  duration: number;

  @ApiProperty({
    description: 'Available equipment',
    required: false,
    example: ['dumbbells', 'barbell', 'bench'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment?: string[];

  @ApiProperty({
    description: 'Target muscle groups',
    required: false,
    example: ['chest', 'legs', 'back'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetMuscles?: string[];

  @ApiProperty({
    description: 'User preferences and additional context',
    required: false,
  })
  @IsOptional()
  @IsString()
  preferences?: string;
}