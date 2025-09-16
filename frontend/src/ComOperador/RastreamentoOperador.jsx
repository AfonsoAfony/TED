import { useEffect, useState } from 'react';
import MapaOperador from './MapaOperador';
import { useNavigate } from 'react-router-dom';

export default function RastreamentoOperador() {

  
const operadorId=15
  const [posicao, setPosicao] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3003');

    socket.onopen = () => {
      console.log('Conectado ao servidor WebSocket');

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const novaPosicao = { lat: latitude, lng: longitude };
          setPosicao(novaPosicao);

          // Enviar dados via WebSocket
          const dados = {
            operadorId: parseInt(operadorId, 10),
            ...novaPosicao,
            timestamp: new Date().toISOString()
          };

          socket.send(JSON.stringify(dados));
        },
        (erro) => console.error('Erro ao rastrear posição:', erro),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      // Limpeza ao desmontar
      return () => {
        navigator.geolocation.clearWatch(watchId);
        socket.close();
      };
    };

    // Em caso de erro de conexão
    socket.onerror = (err) => {
      console.error('Erro no WebSocket:', err);
    };
  }, [operadorId]);

 
 const navigate=useNavigate()

useEffect(()=>{
const dados = localStorage.getItem("dadosOperadorAutenticado");
if (dados ) {
  const operador = JSON.parse(dados);
if(!operador.id || !operador.email || operador.autencicado !="sim"){
   navigate('/')
}
//se  existem, pausará aqui
}
else{
   navigate('/')

}

},[])


  return (
    
      <MapaOperador posicao={posicao} />
    
  );
}
