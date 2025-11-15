import React from 'react';
import './PanelControl.css';

const PanelControl = ({ 
  estaEjecutando, 
  estaPausado, 
  alIniciar, 
  alPausar, 
  alReanudar, 
  alReiniciar,
  tiempos,
  alCambiarTiempo 
}) => {
  return (
    <div className="panel-control">
      <h2>Panel de Control</h2>
      
      <div className="grupo-botones">
        {!estaEjecutando ? (
          <button className="btn btn-iniciar" onClick={alIniciar}>
            Iniciar
          </button>
        ) : (
          <>
            {!estaPausado ? (
              <button className="btn btn-pausar" onClick={alPausar}>
                Pausar
              </button>
            ) : (
              <button className="btn btn-reanudar" onClick={alReanudar}>
                Reanudar
              </button>
            )}
          </>
        )}
        <button className="btn btn-reiniciar" onClick={alReiniciar}>
          Reiniciar
        </button>
      </div>

      <div className="indicador-estado">
        <div className={`luz-estado ${estaEjecutando && !estaPausado ? 'ejecutando' : estaPausado ? 'pausado' : 'detenido'}`}></div>
        <span className="texto-estado">
          {estaEjecutando && !estaPausado ? 'En ejecución' : estaPausado ? 'Pausado' : 'Detenido'}
        </span>
      </div>

      <div className="controles-tiempo">
        <h3>Configuración de Tiempos</h3>
        <div className="grupo-entrada-tiempo">
          <label>
            <span className="etiqueta-tiempo">Verde:</span>
            <input 
              type="number" 
              min="1" 
              max="20" 
              value={tiempos.VERDE / 1000}
              onChange={(e) => alCambiarTiempo('VERDE', e.target.value)}
              disabled={estaEjecutando}
            />
            <span className="unidad-tiempo">seg</span>
          </label>
        </div>

        <div className="grupo-entrada-tiempo">
          <label>
            <span className="etiqueta-tiempo">Amarillo:</span>
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={tiempos.AMARILLO / 1000}
              onChange={(e) => alCambiarTiempo('AMARILLO', e.target.value)}
              disabled={estaEjecutando}
            />
            <span className="unidad-tiempo">seg</span>
          </label>
        </div>

        <div className="grupo-entrada-tiempo">
          <label>
            <span className="etiqueta-tiempo">Rojo:</span>
            <input 
              type="number" 
              min="1" 
              max="30" 
              value={tiempos.ROJO / 1000}
              onChange={(e) => alCambiarTiempo('ROJO', e.target.value)}
              disabled={estaEjecutando}
            />
            <span className="unidad-tiempo">seg</span>
          </label>
        </div>

        {estaEjecutando && (
          <p className="nota-tiempo">Detén el sistema para cambiar tiempos</p>
        )}
      </div>

      <div className="seccion-info">
        <h4>Información del Sistema</h4>
        <ul>
          <li>Sincronización asíncrona activa</li>
          <li>4 semáforos independientes</li>
          <li>Control central coordinado</li>
        </ul>
      </div>
    </div>
  );
};

export default PanelControl;
