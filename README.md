#  Sistema de Control de Semáforos con Computación Paralela

Sistema inteligente de control de semáforos que simula el funcionamiento coordinado de un cruce de calles utilizando computación paralela y sincronización asíncrona en React.

## Descripción del Proyecto

Este proyecto implementa un sistema de control de tráfico que simula **4 semáforos independientes** (Norte, Sur, Este, Oeste) que funcionan de manera coordinada para controlar el flujo vehicular en un cruce de calles. El sistema garantiza que nunca haya dos direcciones opuestas en verde simultáneamente.

## Características Principales

### Computación Paralela
- **4 hilos de ejecución independientes**: Cada semáforo opera en su propio ciclo de tiempo
- **Sincronización asíncrona**: Uso de `useEffect` y `useRef` para simular hilos paralelos
- **Controlador central**: Sistema de bloqueo (lock) que coordina los cambios de estado

### Control del Sistema
- **Iniciar**: Arranca el sistema de semáforos
- **Pausar**: Detiene temporalmente la ejecución sin perder el estado
- **Reanudar**: Continúa desde donde se pausó
- **Reiniciar**: Resetea todo el sistema al estado inicial

### Configuración Dinámica
- Tiempo de luz verde configurable (1-20 segundos)
- Tiempo de luz amarilla configurable (1-10 segundos)
- Tiempo de luz roja configurable (1-30 segundos)

### Estadísticas en Tiempo Real
- Conteo de ciclos completados
- Tiempo total transcurrido
- Estado actual de cada dirección (Norte-Sur y Este-Oeste)
- Verificación de seguridad (detección de conflictos)
- Métricas de rendimiento (ciclos por minuto, tiempo promedio)

### Interfaz Visual Atractiva
- Animaciones suaves y transiciones fluidas
- Efectos de brillo (glow) en las luces activas
- Diseño responsive para diferentes tamaños de pantalla
- Indicadores visuales del estado del sistema

## Tecnologías Utilizadas

- **React 18.2**: Framework principal
- **React Hooks**: `useState`, `useEffect`, `useRef`
- **CSS3**: Animaciones y estilos avanzados
- **JavaScript ES6+**: Lógica de control

## Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/KeynerCM/Semaforo_computacion_paralela.git
cd Semaforo_computacion_paralela
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Iniciar el proyecto**:
```bash
npm start
```

El proyecto se abrirá automáticamente en `http://localhost:3000`

Link de deploy: `https://semaforocompuparalela.netlify.app/`

## Arquitectura del Sistema

### Modelo de Computación Paralela

El sistema utiliza **React Hooks** para simular hilos de ejecución paralelos:

1. **Hilos Independientes (useEffect)**:
   - Cada grupo de semáforos (Norte-Sur y Este-Oeste) tiene su propio `useEffect`
   - Los efectos se ejecutan de manera independiente pero coordinada
   - Uso de `setTimeout` para simular ciclos asíncronos

2. **Controlador Central (useRef)**:
   - `centralController` mantiene un sistema de bloqueo (lock)
   - Previene cambios simultáneos que puedan causar conflictos
   - Coordina la sincronización mediante señales asíncronas

3. **Estado Compartido (useState)**:
   - Los estados se actualizan de manera reactiva
   - Garantiza consistencia entre todos los componentes
   - Previene condiciones de carrera (race conditions)

### Algoritmo de Sincronización

```javascript
1. Un semáforo solicita cambio de estado
2. El controlador central verifica si puede proceder (lock == false)
3. Si está disponible, adquiere el lock
4. Realiza el cambio de estado
5. Verifica que el opuesto esté en rojo si va a verde
6. Libera el lock después de 100ms
7. El siguiente semáforo puede proceder
```

