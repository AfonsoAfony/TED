import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'

export default function RastreamentoGestor() {
  const [operadores, setOperadores] = useState(new Map());

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3003');

    socket.onmessage = (event) => {
      const dados = JSON.parse(event.data);
      const { operadorId, lat, lng, timestamp } = dados;

      setOperadores((prev) => {
        const novo = new Map(prev);
        novo.set(operadorId, { lat, lng, timestamp });
        return novo;
      });
    };

    return () => socket.close();
  }, []);

  // Caminho para tua imagem PNG
  const iconePersonalizado = L.icon({
    iconUrl: '/img/garbageTruck.png', // ou 'caminho/marcador.png'
    iconSize: [30, 30],               // tamanho do ícone
    iconAnchor: [15, 30],             // ponto que será alinhado à coordenada
    popupAnchor: [0, -30],            // onde o popup aparece em relação ao ícone
     
  });

  return (
    <div>
    <div className='map  w-[400px] md:w-[550px] xl:w-[670px] rounded'>
      <MapContainer center={[-8.839, 13.289]} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {[...operadores.entries()].map(([id, pos]) => (
          <Marker key={id} position={[pos.lat, pos.lng]} icon={iconePersonalizado}>
            <Popup>
              Operador {id}<br />
              Última atualização: {new Date(pos.timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
    </div>

  );
}
