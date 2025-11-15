import React from 'react';
import './Semaforo.css';

const Semaforo = ({ direccion, estado, posicion }) => {
  const obtenerLuzActiva = () => {
    return {
      rojo: estado === 'ROJO',
      amarillo: estado === 'AMARILLO',
      verde: estado === 'VERDE'
    };
  };

  const luzActiva = obtenerLuzActiva();

  return (
    <div className={`semaforo ${posicion}`}>
      <div className="semaforo-poste"></div>
      <div className="semaforo-caja">
        <div className="etiqueta-direccion">{direccion}</div>
        <div className={`luz rojo ${luzActiva.rojo ? 'activa' : ''}`}>
          {luzActiva.rojo && <div className="brillo brillo-rojo"></div>}
        </div>
        <div className={`luz amarillo ${luzActiva.amarillo ? 'activa' : ''}`}>
          {luzActiva.amarillo && <div className="brillo brillo-amarillo"></div>}
        </div>
        <div className={`luz verde ${luzActiva.verde ? 'activa' : ''}`}>
          {luzActiva.verde && <div className="brillo brillo-verde"></div>}
        </div>
      </div>
    </div>
  );
};

export default Semaforo;
