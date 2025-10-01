# 🏋️‍♂️ LevelUp AI Microservice

Microservicio de inteligencia artificial para la aplicación LevelUp Gym App. Proporciona generación personalizada de rutinas de entrenamiento, planes nutricionales y recomendaciones adaptativas utilizando OpenAI y Gemini AI.

## 🎯 Características Principales

- **Generación de Rutinas**: Planes de entrenamiento personalizados basados en objetivos, nivel y preferencias
- **Planes Nutricionales**: Dietas balanceadas con restricciones alimentarias y objetivos calóricos
- **Recomendaciones Inteligentes**: Análisis de progreso y sugerencias adaptativas
- **Multi-Provider AI**: Soporte para OpenAI GPT-4 y Google Gemini
- **Integración Supabase**: Almacenamiento automático de planes generados
- **API REST Completa**: Endpoints documentados con Swagger
- **Arquitectura Limpia**: Módulos desacoplados siguiendo principios SOLID

## 🏗️ Arquitectura del Proyecto

```
src/
├── ai/                    # Módulo principal de orquestación
├── workout/               # Generación de rutinas de entrenamiento
├── diet/                  # Generación de planes nutricionales
├── recommendation/        # Sistema de recomendaciones
├── external-apis/         # Proveedores de IA (OpenAI, Gemini)
├── supabase/             # Integración con base de datos
├── shared/               # DTOs, tipos e interfaces compartidas
└── config/               # Configuración y validación de entorno
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Configura las siguientes variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=tu_clave_openai_aqui

# Gemini Configuration  
GEMINI_API_KEY=tu_clave_gemini_aqui

# Supabase Configuration
SUPABASE_URL=tu_url_supabase_aqui
SUPABASE_SERVICE_KEY=tu_clave_servicio_supabase_aqui

# Application Configuration
PORT=3001
NODE_ENV=development
DEFAULT_AI_PROVIDER=openai
```

### 3. Ejecutar el Microservicio

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📚 Documentación de API

Una vez ejecutado el microservicio, accede a la documentación interactiva:

- **Swagger UI**: http://localhost:3001/api/ai/docs
- **Health Check**: http://localhost:3001/api/ai/health

## 🔗 Endpoints Principales

### Workout Generation
```http
POST /api/ai/workout
```
Genera un plan de entrenamiento personalizado.

**Ejemplo de Request:**
```json
{
  "userId": "uuid-123",
  "goal": "gain_muscle",
  "difficulty": "intermediate", 
  "daysPerWeek": 4,
  "duration": 60,
  "equipment": ["dumbbells", "barbell"],
  "targetMuscles": ["chest", "legs", "back"]
}
```

### Diet Planning
```http
POST /api/ai/diet
```
Genera un plan nutricional personalizado.

**Ejemplo de Request:**
```json
{
  "userId": "uuid-123",
  "calories": 2200,
  "goal": "lose_weight",
  "restrictions": ["no_dairy", "vegetarian"],
  "mealsPerDay": 4,
  "targetProtein": 150
}
```

### Recommendations
```http
POST /api/ai/recommendation
```
Genera recomendaciones basadas en progreso del usuario.

**Ejemplo de Request:**
```json
{
  "userId": "uuid-123",
  "progressData": {
    "completedWorkouts": 15,
    "adherenceRate": 85,
    "weightProgress": -2.5,
    "strengthProgress": {
      "bench_press": 10,
      "squat": 15
    }
  }
}
```

### Complete Profile
```http
POST /api/ai/complete-profile/:userId
```
Genera un perfil completo (workout + diet + recomendaciones iniciales).

## 🧪 Pruebas de API

Utiliza el script de pruebas incluido:

```bash
./scripts/test-api.sh
```

O prueba endpoints individuales con curl:

```bash
# Health Check
curl -X GET "http://localhost:3001/api/ai/health"

# Generate Workout
curl -X POST "http://localhost:3001/api/ai/workout" \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-123","goal":"gain_muscle","difficulty":"intermediate","daysPerWeek":4,"duration":60}'
```

## 🔧 Configuración Avanzada

### Cambiar Proveedor de IA

Modifica la variable de entorno:
```env
DEFAULT_AI_PROVIDER=gemini  # o "openai"
```

### Personalizar Modelos

En `src/external-apis/openai.provider.ts`:
```typescript
model: 'gpt-4-turbo-preview'  // Cambiar modelo OpenAI
```

En `src/external-apis/gemini.provider.ts`:
```typescript
'/models/gemini-pro:generateContent'  // Cambiar modelo Gemini
```

## 🗄️ Esquema de Base de Datos Supabase

### Tablas Requeridas

```sql
-- Workout Plans
CREATE TABLE workout_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),
  goal VARCHAR(50),
  days_per_week INTEGER,
  estimated_duration INTEGER,
  exercises JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Diet Plans  
CREATE TABLE diet_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  goal VARCHAR(50),
  total_calories INTEGER,
  target_macros JSONB,
  meals JSONB,
  restrictions TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Recommendations
CREATE TABLE recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  actionable BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Profiles (opcional)
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY,
  age INTEGER,
  weight DECIMAL,
  height DECIMAL,
  gender VARCHAR(20),
  activity_level VARCHAR(50),
  fitness_goals TEXT[],
  medical_conditions TEXT[],
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 Integración con Frontend React

### Ejemplo de Servicio React

```typescript
// services/aiService.ts
import axios from 'axios';

const AI_BASE_URL = 'http://localhost:3001/api/ai';

export const aiService = {
  // Generar rutina
  generateWorkout: async (workoutData: any) => {
    const response = await axios.post(`${AI_BASE_URL}/workout`, workoutData);
    return response.data;
  },

  // Generar dieta  
  generateDiet: async (dietData: any) => {
    const response = await axios.post(`${AI_BASE_URL}/diet`, dietData);
    return response.data;
  },

  // Obtener recomendaciones
  getRecommendations: async (userId: string, progressData: any) => {
    const response = await axios.post(`${AI_BASE_URL}/recommendation`, {
      userId,
      progressData
    });
    return response.data;
  },

  // Perfil completo
  generateCompleteProfile: async (userId: string, profileData: any) => {
    const response = await axios.post(
      `${AI_BASE_URL}/complete-profile/${userId}`, 
      profileData
    );
    return response.data;
  }
};
```

### Hook de React

```typescript
// hooks/useAI.ts
import { useState } from 'react';
import { aiService } from '../services/aiService';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWorkout = async (workoutData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.generateWorkout(workoutData);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateWorkout, loading, error };
};
```

## 🔒 Seguridad y Mejores Prácticas

- ✅ Validación de entrada con `class-validator`
- ✅ Transformación de datos con `class-transformer`
- ✅ Variables de entorno validadas con Joi
- ✅ CORS configurado para URLs específicas
- ✅ Rate limiting recomendado para producción
- ✅ API Keys protegidas en variables de entorno

## 🚀 Despliegue

### Docker (Recomendado)

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
EXPOSE 3001

CMD ["node", "dist/main"]
```

### Variables de Entorno para Producción

```env
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=prod_openai_key
GEMINI_API_KEY=prod_gemini_key
SUPABASE_URL=prod_supabase_url
SUPABASE_SERVICE_KEY=prod_supabase_key
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Add nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crear un issue en el repositorio
- Revisar la documentación de Swagger en `/api/ai/docs`
- Verificar logs del microservicio para debugging

---

Desarrollado con ❤️ para LevelUp Gym App
