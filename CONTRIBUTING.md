# Contributing to LevelUp AI Microservice

¡Gracias por tu interés en contribuir al microservicio de IA de LevelUp Gym App! 🎉

## 🚀 Cómo Contribuir

### 1. Fork del Repositorio
```bash
# Fork el repositorio en GitHub y luego clónalo
git clone https://github.com/tu-usuario/levelupai.git
cd levelupai
```

### 2. Configurar el Entorno de Desarrollo
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys

# Ejecutar en modo desarrollo
npm run start:dev
```

### 3. Crear una Rama de Feature
```bash
git checkout -b feature/nueva-funcionalidad
```

### 4. Hacer Cambios y Testear
```bash
# Compilar para verificar errores de TypeScript
npm run build

# Ejecutar linting
npm run lint

# Ejecutar tests (cuando estén disponibles)
npm run test
```

### 5. Commit y Push
```bash
git add .
git commit -m "feat: añadir nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### 6. Crear Pull Request
Crea un PR en GitHub con una descripción detallada de los cambios.

## 📝 Convenciones de Código

### Nomenclatura
- **Archivos**: kebab-case (ej: `user-profile.service.ts`)
- **Clases**: PascalCase (ej: `UserProfileService`)
- **Métodos/Variables**: camelCase (ej: `getUserProfile()`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_BASE_URL`)

### Estructura de Commits
Usar convencional commits:
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato
- `refactor:` - Refactorización de código
- `test:` - Añadir o modificar tests
- `chore:` - Mantenimiento

### Arquitectura
- Mantener la separación de módulos
- Usar inyección de dependencias
- Validar todos los DTOs
- Manejar errores apropiadamente
- Documentar nuevos endpoints con Swagger

## 🐛 Reportar Bugs

Para reportar bugs, por favor:

1. Verificar que el bug no esté ya reportado
2. Crear un issue con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Información del entorno (Node.js, npm versions)
   - Logs relevantes

## 💡 Solicitar Features

Para solicitar nuevas funcionalidades:

1. Crear un issue describiendo:
   - El problema que resuelve
   - La solución propuesta
   - Casos de uso específicos
   - Posible implementación

## 📋 Checklist para Pull Requests

Antes de enviar un PR, verificar que:

- [ ] El código compila sin errores (`npm run build`)
- [ ] El linting pasa (`npm run lint`)
- [ ] Los tests pasan (`npm run test`)
- [ ] La documentación está actualizada
- [ ] Los nuevos endpoints tienen documentación Swagger
- [ ] Se siguieron las convenciones de código
- [ ] Los commits son descriptivos y siguen el formato convencional

## 🤝 Código de Conducta

Este proyecto adhiere a un código de conducta. Al participar, se espera que mantengas este código. Reporta comportamientos inaceptables a los maintainers del proyecto.

## 📞 Contacto

Si tienes preguntas sobre cómo contribuir, puedes:
- Abrir un issue para discusión
- Contactar a los maintainers directamente
- Unirte a las discusiones del proyecto

¡Gracias por ayudar a mejorar LevelUp AI! 🚀