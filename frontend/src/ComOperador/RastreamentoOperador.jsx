import { useEffect, useState } from 'react';
import MapaOperador from './MapaOperador';
import { useNavigate } from 'react-router-dom';
import BtnTerminarSessao from '../components/BtnTerminarSessao';

export default function RastreamentoOperador() {
  const [operadorId,setoperadorId]=useState()
  const [operadorNome,setoperadorNome]=useState("")
  const [operadorFuncao,setoperadorFuncao]=useState("")
  
  useEffect(()=>{
    
      const dados=localStorage.getItem("dadosOperadorAutenticado")
      if (dados) {
        const operador=JSON.parse(dados)
        setoperadorId(operador.id)
        setoperadorNome(operador.nome)
        setoperadorFuncao(operador.funcao)
      }
      else{
        alert("Dados do operador não encontrado, por favor faça a sessão novamente")
        navigate("/")
      }

  },[])
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
            operadorNome:operadorNome,
            operadorFuncao:operadorFuncao,
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
    <div>
    <div className='w-full flex py-4 px-4 border-t border-indigo-800 justify-between  '>
            <div className='flex text-start'>
                <h1 className=" font-semibold letra1 text-3xl md:text-4xl lg:text-5xl px-4 text-white transition">T E D</h1>
            </div>
            <div className="flex text-right ">
                 <BtnTerminarSessao/>
            </div>
                
        </div>
    <div className='overflow-hidden h-[610px] mx-4 rounded-xl  border-4 border-black '>

    
        <div >
      <MapaOperador posicao={posicao} />

        </div>
    </div>
    </div>
  );
}
