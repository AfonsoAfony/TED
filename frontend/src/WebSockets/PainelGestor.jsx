import { useEffect, useState } from 'react';

export default function PainelGestor() {
  const [localizacoes, setLocalizacoes] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3003');
     // ou wss:// para produção segura

    socket.onopen = () => {
      console.log('Conexão WebSocket aberta');
    };

    socket.onmessage = (event) => {
      const dados = JSON.parse(event.data);
      setLocalizacoes((prev) => [...prev, dados]); // atualiza com nova posição
    };

    socket.onerror = (error) => {
      console.error('Erro WebSocket:', error);
    };

    socket.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };

    return () => socket.close(); // limpa ao desmontar
  }, []);

  return (
    <div>
      {localizacoes.map((loc, index) => (
        <p key={index}>Operador {loc.operadorId}: {loc.lat}, {loc.lng}</p>
      ))}
    </div>
  );
}
