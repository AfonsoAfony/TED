// webSockets.js
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 3003 });
  console.log('Sevidor webSockets ouvindo na Porta 3003 ');

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (mensagem) => {
    const dados = JSON.parse(mensagem);
    console.log('Localização recebida:', dados);

    // retransmitir para todos os gestores conectados
    wss.clients.forEach((cliente) => {
      if (cliente.readyState === WebSocket.OPEN) {
        cliente.send(JSON.stringify(dados));
      }
    });
  });
});
