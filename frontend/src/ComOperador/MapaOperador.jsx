import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'

//Ponto de partida - Empresa
const pontoInicial = [{ lat: -8.839, lng: 13.289 }];

// Caminho para tua imagem PNG
const iconePersonalizado = L.icon({
  iconUrl: '/img/garbageTruck.png', // ou 'caminho/marcador.png'
  iconSize: [30, 30],               // tamanho do ícone
  iconAnchor: [15, 30],             // ponto que será alinhado à coordenada
  popupAnchor: [0, -30],            // onde o popup aparece em relação ao ícone
   
});

export default function MapaOperador(props) {
const posicao = props.posicao
   
  return (
    
                  <MapContainer center={pontoInicial[0]} zoom={8} >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
                      {posicao.lat && posicao.lng && (
                          <Marker position={[posicao.lat, posicao.lng]}  icon={iconePersonalizado}>
                         <Popup>Operador em tempo real</Popup>
                      </Marker>
)}
                      
                  </MapContainer>
               
    
    
  );
}