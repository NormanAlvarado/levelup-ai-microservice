# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-01

### Agregado
- 🎉 **Inicial release del LevelUp AI Microservice**
- 🏋️‍♂️ **Módulo de Workout**: Generación de rutinas personalizadas
  - Soporte para diferentes objetivos (ganar músculo, perder peso, etc.)
  - Niveles de dificultad (principiante, intermedio, avanzado, experto)
  - Configuración de días por semana y duración
  - Selección de equipamiento disponible
  - Targeting de grupos musculares específicos
  
- 🥗 **Módulo de Diet**: Planes nutricionales inteligentes
  - Cálculo automático de calorías y macronutrientes
  - Soporte para restricciones dietéticas (vegetariano, vegano, sin gluten, etc.)
  - Configuración de número de comidas por día
  - Lista de alimentos preferidos y a evitar
  
- 💡 **Módulo de Recommendations**: Sistema de recomendaciones adaptativas
  - Análisis de progreso del usuario
  - Recomendaciones personalizadas basadas en adherencia
  - Contenido motivacional dinámico
  - Insights personalizados sobre planes actuales
  
- 🤖 **Múltiples Proveedores de IA**:
  - **OpenAI GPT-4 Turbo**: Generación avanzada de contenido fitness
  - **Google Gemini Pro**: Alternativa robusta para generación de planes
  - Patrón Strategy para intercambio dinámico entre proveedores
  
- 🗄️ **Integración Supabase**:
  - Almacenamiento automático de planes generados
  - Recuperación de perfiles de usuario
  - Gestión completa de recomendaciones
  
- 📚 **API REST Completa**:
  - Endpoints RESTful bien estructurados
  - Documentación automática con Swagger
  - Validación robusta con class-validator
  - Manejo de errores centralizado
  
- 🛠️ **Arquitectura y Herramientas**:
  - Arquitectura limpia con módulos desacoplados
  - Inyección de dependencias completa
  - Configuración validada con Joi
  - CORS configurado para frontend
  - Docker support con multi-stage builds
  
- 📖 **Documentación**:
  - README detallado con ejemplos de uso
  - Documentación de API con Swagger
  - Scripts de testing incluidos
  - Ejemplos de integración con React

### Configuración Técnica
- **Node.js**: v18+ requerido
- **NestJS**: Framework principal v10+
- **TypeScript**: Tipado completo
- **Swagger**: Documentación automática
- **Docker**: Containerización lista para producción
- **Validation**: class-validator + class-transformer
- **Configuration**: @nestjs/config + Joi

### Endpoints Disponibles
- `GET /api/ai/health` - Health check del microservicio
- `GET /api/ai/docs` - Documentación Swagger
- `POST /api/ai/workout` - Generar rutina de entrenamiento
- `POST /api/ai/diet` - Generar plan nutricional
- `POST /api/ai/recommendation` - Obtener recomendaciones
- `GET /api/ai/recommendation/:userId/insights` - Insights personalizados
- `GET /api/ai/recommendation/:userId/motivation` - Contenido motivacional
- `POST /api/ai/complete-profile/:userId` - Generar perfil completo

---

## Próximas Versiones Planeadas

### [1.1.0] - Planificado
- Sistema de caching para mejorar performance
- Rate limiting configurable
- Métricas y monitoreo avanzado
- Tests unitarios y de integración
- CI/CD pipeline

### [1.2.0] - Planificado  
- Soporte para más proveedores de IA
- Análisis de imágenes para evaluación de forma
- Integración con wearables y dispositivos IoT
- Recomendaciones en tiempo real

---

**Nota**: Las fechas y features de versiones futuras son aproximadas y sujetas a cambio.