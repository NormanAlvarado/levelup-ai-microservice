#!/bin/bash

# LevelUp AI Microservice - Example Usage Script
# This script demonstrates how to use the AI microservice endpoints

BASE_URL="http://localhost:3001/api/ai"

echo "🚀 LevelUp AI Microservice - API Testing Script"
echo "=============================================="

# Health Check
echo ""
echo "1. Health Check:"
curl -X GET "$BASE_URL/health" \
  -H "Content-Type: application/json" | jq '.'

# Generate Workout Plan
echo ""
echo "2. Generate Workout Plan:"
curl -X POST "$BASE_URL/workout" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "goal": "gain_muscle",
    "difficulty": "intermediate",
    "daysPerWeek": 4,
    "duration": 60,
    "equipment": ["dumbbells", "barbell", "bench"],
    "targetMuscles": ["chest", "legs", "back"]
  }' | jq '.'

# Generate Diet Plan
echo ""
echo "3. Generate Diet Plan:"
curl -X POST "$BASE_URL/diet" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "calories": 2200,
    "goal": "gain_muscle",
    "restrictions": ["no_dairy"],
    "mealsPerDay": 4,
    "targetProtein": 150,
    "preferredFoods": ["chicken", "rice", "vegetables"]
  }' | jq '.'

# Generate Recommendations
echo ""
echo "4. Generate Recommendations:"
curl -X POST "$BASE_URL/recommendation" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "progressData": {
      "completedWorkouts": 10,
      "adherenceRate": 85,
      "weightProgress": 2.5,
      "strengthProgress": {
        "bench_press": 10,
        "squat": 15
      }
    }
  }' | jq '.'

# Get Personalized Insights
echo ""
echo "5. Get Personalized Insights:"
curl -X GET "$BASE_URL/recommendation/user-123/insights" \
  -H "Content-Type: application/json" | jq '.'

# Get Motivational Content
echo ""
echo "6. Get Motivational Content:"
curl -X GET "$BASE_URL/recommendation/user-123/motivation" \
  -H "Content-Type: application/json" | jq '.'

# Generate Complete Profile
echo ""
echo "7. Generate Complete Profile:"
curl -X POST "$BASE_URL/complete-profile/user-123" \
  -H "Content-Type: application/json" \
  -d '{
    "workout": {
      "userId": "user-123",
      "goal": "gain_muscle",
      "difficulty": "intermediate",
      "daysPerWeek": 4,
      "duration": 60
    },
    "diet": {
      "userId": "user-123",
      "calories": 2200,
      "goal": "gain_muscle",
      "restrictions": ["no_dairy"],
      "mealsPerDay": 4
    }
  }' | jq '.'

echo ""
echo "✅ API Testing Complete!"
echo "📚 Full API Documentation: $BASE_URL/docs"