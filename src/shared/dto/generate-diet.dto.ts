import { IsString, IsEnum, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DietGoal, DietaryRestriction } from '../types/diet.interface';

export class GenerateDietDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-123-456-789',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Target daily calories',
    minimum: 1000,
    maximum: 5000,
    example: 2200,
  })
  @IsNumber()
  @Min(1000)
  @Max(5000)
  @Transform(({ value }) => parseInt(value))
  calories: number;

  @ApiProperty({
    description: 'Diet goal',
    enum: DietGoal,
    example: DietGoal.LOSE_WEIGHT,
  })
  @IsEnum(DietGoal)
  goal: DietGoal;

  @ApiProperty({
    description: 'Dietary restrictions',
    enum: DietaryRestriction,
    isArray: true,
    required: false,
    example: [DietaryRestriction.NO_DAIRY, DietaryRestriction.VEGETARIAN],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DietaryRestriction, { each: true })
  restrictions?: DietaryRestriction[];

  @ApiProperty({
    description: 'Number of meals per day',
    minimum: 3,
    maximum: 6,
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(6)
  @Transform(({ value }) => parseInt(value))
  mealsPerDay?: number;

  @ApiProperty({
    description: 'Target protein in grams',
    required: false,
    example: 150,
  })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(300)
  @Transform(({ value }) => parseInt(value))
  targetProtein?: number;

  @ApiProperty({
    description: 'Preferred foods',
    required: false,
    example: ['chicken', 'rice', 'broccoli'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredFoods?: string[];

  @ApiProperty({
    description: 'Foods to avoid',
    required: false,
    example: ['processed foods', 'sugar'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  avoidFoods?: string[];

  @ApiProperty({
    description: 'User preferences and additional context',
    required: false,
  })
  @IsOptional()
  @IsString()
  preferences?: string;
}