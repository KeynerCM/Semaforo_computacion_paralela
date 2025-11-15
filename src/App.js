import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Semaforo from './components/Semaforo';
import PanelControl from './components/PanelControl';

// Estados de los semáforos
const ESTADOS_LUZ = {
  ROJO: 'ROJO',
  AMARILLO: 'AMARILLO',
  VERDE: 'VERDE'
};

// Direcciones en orden de secuencia
const SECUENCIA_DIRECCIONES = ['NORTE', 'OESTE', 'SUR', 'ESTE'];

// Configuración de tiempos 
const TIEMPOS_PREDETERMINADOS = {
  VERDE: 5000,    // 5 segundos en verde
  AMARILLO: 2000,   // 2 segundos en amarillo
  ROJO: 3000
};

function App() {
  // Estados principales
  const [estaEjecutando, setEstaEjecutando] = useState(false);
  const [estaPausado, setEstaPausado] = useState(false);
  
  // Estadosde cada semáforo
  const [estadoNorte, setEstadoNorte] = useState(ESTADOS_LUZ.VERDE);
  const [estadoSur, setEstadoSur] = useState(ESTADOS_LUZ.ROJO);
  const [estadoEste, setEstadoEste] = useState(ESTADOS_LUZ.ROJO);
  const [estadoOeste, setEstadoOeste] = useState(ESTADOS_LUZ.ROJO);
  
  // Índice del semáforo actual en verde
  const [indiceActual, setIndiceActual] = useState(0);
  
  // Configuración de tiempos
  const [tiempos, setTiempos] = useState(TIEMPOS_PREDETERMINADOS);
  
  // Estadísticas
  const [contadorCiclos, setContadorCiclos] = useState(0);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  
  // Referencias
  const intervaloSemaforoRef = useRef(null);
  const intervaloEstadisticasRef = useRef(null);
  const tiempoPausaRef = useRef(0);
  const tiempoInicioRef = useRef(null);
  const estadoActualRef = useRef(ESTADOS_LUZ.VERDE);

  // Controlador central - coordina los cambios de luces
  const controladorCentral = useRef({
    bloqueado: false
  });

  // Función para actualizar el estado de un semáforo específico
  const actualizarEstadoSemaforo = (direccion, nuevoEstado) => {
    switch(direccion) {
      case 'NORTE':
        setEstadoNorte(nuevoEstado);
        break;
      case 'SUR':
        setEstadoSur(nuevoEstado);
        break;
      case 'ESTE':
        setEstadoEste(nuevoEstado);
        break;
      case 'OESTE':
        setEstadoOeste(nuevoEstado);
        break;
      default:
        break;
    }
  };

  // Función principal que gestiona los cambios de semáforo
  const cambiarSemaforo = () => {
    if (controladorCentral.current.bloqueado) return;
    
    controladorCentral.current.bloqueado = true;

    const direccionActual = SECUENCIA_DIRECCIONES[indiceActual];
    
    // Si está en verde, cambiar a amarillo
    if (estadoActualRef.current === ESTADOS_LUZ.VERDE) {
      actualizarEstadoSemaforo(direccionActual, ESTADOS_LUZ.AMARILLO);
      estadoActualRef.current = ESTADOS_LUZ.AMARILLO;
    }
    // Si está en amarillo, cambiar a rojo y pasar al siguiente
    else if (estadoActualRef.current === ESTADOS_LUZ.AMARILLO) {
      actualizarEstadoSemaforo(direccionActual, ESTADOS_LUZ.ROJO);
      
      // Calcular el siguiente índice
      const siguienteIndice = (indiceActual + 1) % SECUENCIA_DIRECCIONES.length;
      const siguienteDireccion = SECUENCIA_DIRECCIONES[siguienteIndice];
      
      // Inmediatamente poner el siguiente en verde
      actualizarEstadoSemaforo(siguienteDireccion, ESTADOS_LUZ.VERDE);
      estadoActualRef.current = ESTADOS_LUZ.VERDE;
      
      // Actualizar índice
      setIndiceActual(siguienteIndice);
      
      // Incrementar contador de ciclos cuando completamos la vuelta
      if (siguienteIndice === 0) {
        setContadorCiclos(prev => prev + 1);
      }
    }
    
    setTimeout(() => {
      controladorCentral.current.bloqueado = false;
    }, 100);
  };

  // Efecto principal que controla el ciclo del semáforo
  useEffect(() => {
    if (!estaEjecutando || estaPausado) {
      if (intervaloSemaforoRef.current) {
        clearTimeout(intervaloSemaforoRef.current);
      }
      return;
    }

    const programarProximoCambio = () => {
      let retraso;
      if (estadoActualRef.current === ESTADOS_LUZ.VERDE) {
        retraso = tiempos.VERDE;
      } else {
        retraso = tiempos.AMARILLO;
      }

      intervaloSemaforoRef.current = setTimeout(() => {
        cambiarSemaforo();
      }, retraso);
    };

    programarProximoCambio();

    return () => {
      if (intervaloSemaforoRef.current) {
        clearTimeout(intervaloSemaforoRef.current);
      }
    };
  }, [estaEjecutando, estaPausado, indiceActual, estadoNorte, estadoSur, estadoEste, estadoOeste, tiempos]);

  // Contador de tiempo transcurrido
  useEffect(() => {
    if (estaEjecutando && !estaPausado) {
      if (!tiempoInicioRef.current) {
        tiempoInicioRef.current = Date.now() - tiempoPausaRef.current;
      }
      
      intervaloEstadisticasRef.current = setInterval(() => {
        const tiempoActual = Date.now();
        setTiempoTranscurrido(Math.floor((tiempoActual - tiempoInicioRef.current) / 1000));
      }, 1000);
    } else if (estaPausado) {
      tiempoPausaRef.current = tiempoTranscurrido * 1000;
      if (intervaloEstadisticasRef.current) {
        clearInterval(intervaloEstadisticasRef.current);
      }
    }

    return () => {
      if (intervaloEstadisticasRef.current) {
        clearInterval(intervaloEstadisticasRef.current);
      }
    };
  }, [estaEjecutando, estaPausado]);

  // Funciones de control
  const manejarIniciar = () => {
    setEstaEjecutando(true);
    setEstaPausado(false);
    if (!tiempoInicioRef.current) {
      tiempoInicioRef.current = Date.now();
    }
  };

  const manejarPausar = () => {
    setEstaPausado(true);
    tiempoPausaRef.current = tiempoTranscurrido * 1000;
  };

  const manejarReanudar = () => {
    setEstaPausado(false);
    tiempoInicioRef.current = Date.now() - tiempoPausaRef.current;
  };

  const manejarReiniciar = () => {
    setEstaEjecutando(false);
    setEstaPausado(false);
    setEstadoNorte(ESTADOS_LUZ.VERDE);
    setEstadoSur(ESTADOS_LUZ.ROJO);
    setEstadoEste(ESTADOS_LUZ.ROJO);
    setEstadoOeste(ESTADOS_LUZ.ROJO);
    setIndiceActual(0);
    estadoActualRef.current = ESTADOS_LUZ.VERDE;
    setContadorCiclos(0);
    setTiempoTranscurrido(0);
    tiempoPausaRef.current = 0;
    tiempoInicioRef.current = null;
    
    if (intervaloSemaforoRef.current) {
      clearTimeout(intervaloSemaforoRef.current);
    }
    if (intervaloEstadisticasRef.current) {
      clearInterval(intervaloEstadisticasRef.current);
    }
  };

  const manejarCambioDeTiempo = (tipo, valor) => {
    setTiempos(prev => ({
      ...prev,
      [tipo]: parseInt(valor) * 1000
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Control de Semáforos</h1>
        <p className="subtitle">Computación y Programación Paralela</p>
      </header>

      <div className="main-container">
        <div className="intersection-container">
          <div className="road horizontal">
            <div className="lane"></div>
            <div className="lane"></div>
          </div>
          <div className="road vertical">
            <div className="lane"></div>
            <div className="lane"></div>
          </div>

          {/* Semáforo Norte */}
          <div className="traffic-light-wrapper north">
            <Semaforo 
              direccion="Norte"
              estado={estadoNorte}
              posicion="north"
            />
          </div>
          
          {/* Semáforo Sur */}
          <div className="traffic-light-wrapper south">
            <Semaforo 
              direccion="Sur"
              estado={estadoSur}
              posicion="south"
            />
          </div>

          {/* Semáforo Este */}
          <div className="traffic-light-wrapper east">
            <Semaforo 
              direccion="Este"
              estado={estadoEste}
              posicion="east"
            />
          </div>
          
          {/* Semáforo Oeste */}
          <div className="traffic-light-wrapper west">
            <Semaforo 
              direccion="Oeste"
              estado={estadoOeste}
              posicion="west"
            />
          </div>

          {/* Centro del cruce */}
          <div className="intersection-center">
            <div className="center-marker"></div>
          </div>
        </div>

        <div className="controls-stats-container">
          <PanelControl
            estaEjecutando={estaEjecutando}
            estaPausado={estaPausado}
            alIniciar={manejarIniciar}
            alPausar={manejarPausar}
            alReanudar={manejarReanudar}
            alReiniciar={manejarReiniciar}
            tiempos={tiempos}
            alCambiarTiempo={manejarCambioDeTiempo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
