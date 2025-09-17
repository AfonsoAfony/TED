import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet'
import eventBus from '../components/eventBus';


//Salvar Rrelatório




async function salvarRelatórioRota(tipoResiduos,volume,idRota,operadorId,nomeOperador){
  if(volume!="" && tipoResiduos!="" && idRota!="" && operadorId!=""){
const response=await fetch("http://localhost:3000/server/SalvarRelatorio",{
  method:"post",
  headers:({"Content-type":"application/json"}),
  body: JSON.stringify({tipoResiduos,volume,idRota,operadorId,nomeOperador})
})

const dados=await response.json()
console.log(dados)
if(response.ok){
    alert(dados.returnSuccess)
}
else{
    alert(dados.returnError)

}



}
else{
  alert("Introduza os dados de volume e tipo de residuos")
}
}


//FUNÇÃO PARA BUSCAR TODAS os operadores NA BASE DE DADOS:***********************************
async function buscaTodosOperadores(){
  
 const response=await fetch("http://localhost:3000/server/BuscarTodosOperadores")

 const dados=await response.json()
 if(response.ok){
  try {

    console.log("dados dos operadores recebidos:"+dados.returnSuccess)
      return dados.operadores
  
    } catch (error) {
    console.log(`problemas: ${error}`);
  }
 }

}








/*************************************************************** */
export default function RastreamentoGestor() {
/*************************************************************** */
 let [todosOperadores,settodosOperadores] = useState([]);
 
 const [conjuntoPontos, setConjuntoPontos] = useState([]);

 //relatório:
 const [tipoDeResiduos,setTipoDeResiduos]=useState("")
 const [volumeDeResiduos,setVolumeDeResiduos]=useState("")
  const [operadorId,setOperadorId]=useState("")
 const [idRota,setIdRota]=useState()
 const[nomeOperador,setNomeOperador]=useState("")




  //*****************Executar Buscar dados de rotas no inicio:************************
  //Criar um eventBus para buscar os dados e aciona-la na useEffect quando começaro p
eventBus.on("BuscarTodosUsuariosEmostrarLista",()=>{
        buscaTodosOperadores().then(operadores=>{
            settodosOperadores(operadores)
          })
      })
  useEffect(()=>{
    eventBus.emit("BuscarTodosUsuariosEmostrarLista")      
    
  },[])



  
//FUNÇÃO PARA BUSCAR OS PONTOS NA TABELA PONTOS COM RELAÇÃO AO ID DE ROTA:***********************************
async function buscarPontosDaRota(idRota){
  
 const response=await fetch(`http://localhost:3000/server/BuscarPontosRota/${idRota}` ,{
      method:"GET",
    })

 const dados=await response.json()
 if(response.ok){
  try {

    console.log("Pontos de rotas recebidos:"+dados.returnSuccess)
   
    //push, como é um hook usamos o operador ... "spread"
    setConjuntoPontos(dados.pontosRecebidos); // atualiza estado 
  
    
      return dados.rotas
  
    } catch (error) {
    console.log(`problemas: ${error}`);
  }
 }

}
/******************************************************************/



/*************************VERIFICAR SE FUNCIONA´RIO ESTÁ EM SERVIÇO (ENVIA SINAL)*********************** */


  const [operadores, setOperadores] = useState(new Map());

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3003');

    socket.onmessage = (event) => {
      const dados = JSON.parse(event.data);
      const { operadorId,operadorNome,operadorFuncao, lat, lng, timestamp } = dados;
      

      setOperadores((prev) => {
        const novo = new Map(prev);
        novo.set(operadorId, { lat, lng, timestamp,operadorNome,operadorFuncao });
        return novo;
      });
    };

    return () => socket.close();
  }, []);

  const iconePersonalizadoLIXO = L.icon({
      iconUrl: 'img/garbage.png', // ou 'https://teusite.com/marcador.png'
      iconSize: [30, 30],               // tamanho do ícone
      iconAnchor: [15, 30],             // ponto que será alinhado à coordenada
      popupAnchor: [0, -30],            // onde o popup aparece em relação ao ícone
       
    });


  // Caminho para tua imagem PNG
  const iconePersonalizado = L.icon({
    iconUrl: '/img/garbageTruck.png', // ou 'caminho/marcador.png'
    iconSize: [30, 30],               // tamanho do ícone
    iconAnchor: [15, 30],             // ponto que será alinhado à coordenada
    popupAnchor: [0, -30],            // onde o popup aparece em relação ao ícone
     
  });

  const [mostrarForm,setMostrarForm]=useState(false)

  return (
    <div>
    <div className='map  w-[400px] md:w-[550px] xl:w-[670px] rounded'>
      <MapContainer center={[-8.839, 13.289]} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {[...operadores.entries()].map(([id, pos]) => (
          <Marker key={id} position={[pos.lat, pos.lng]} icon={iconePersonalizado}>
            <Popup>
              <strong>Operador: <span className='text-indigo-500' >{id}</span></strong><br />
              Nome:   <i>{pos.operadorNome}</i><br />
              Função: <i>{pos.operadorFuncao}</i><br />
              Pontos: <i>Lat-{pos.lat} </i>e <i>lng-{pos.lng}</i><br />
              Última atualização: {new Date(pos.timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
        {conjuntoPontos.map((p, i) => (
            <Marker key={i} position={[p.lat, p.lng]} icon={iconePersonalizadoLIXO} />
          ))}
        <Polyline positions={conjuntoPontos.map((p) => [p.lat, p.lng])} color="blue" />
      </MapContainer>
    </div>
    
          <div className=' px-2 mt-3 flex justify-between transicao'>
            <div className={mostrarForm ? ' w-[45%] border-2 transicao MostrarAddRelatorio pb-3' : 'transicao NaoMostrar'}>
                <h2 className='font-semibold text-indigo-400'>Resultado de Rota Nº {idRota}</h2>
                
                    <div className='mt-2 px-2 transicao'>
                    <input type="text" className='w-full rounded text-black bg-indigo-100  mb-2 py-1 px-2 transicao ' value={tipoDeResiduos} onChange={(e)=>setTipoDeResiduos(e.target.value)} placeholder='Tipo de Resíduos'/>
                 <input type="text" className='w-full rounded text-black bg-indigo-100  mb-2 py-1 px-2 transicao ' value={volumeDeResiduos} onChange={(e)=>setVolumeDeResiduos(e.target.value)} placeholder='Volume de Residuos'/>
                 
                </div>
                    
                       <button className=' ml-1 mr-3  bg-transparent text-indigo-200 font-semibold text-sm md:text-lg border-2 rounded border-indigo-200 py-3 px-5 transicao hover:border-none hover:bg-indigo-400  hover:text-slate-950' onClick={() => salvarRelatórioRota(tipoDeResiduos,volumeDeResiduos,idRota,operadorId,nomeOperador)}>
                    Salvar relatório
                  </button>
                   <button className=' ml-1 mt-2  bg-transparent text-red-300 font-semibold text-sm md:text-lg border-2 rounded border-red-300 py-3 px-6 transicao hover:border-none hover:bg-red-800  hover:text-slate-950' onClick={() => {
                setTipoDeResiduos("")
                setVolumeDeResiduos("")
                setMostrarForm(false)

              }}>
              Parar
              </button>
                   
                        
                    
                  
            </div>
            <div className='w-[53%] transicao border-2  flex justify-end text-right'>
                    <div className="lista ml-1 mr-3">
                <ul>
                  <h2 className='text-lg transicao md:text-2xl font-bold text-indigo-200'>Lista de Operadores</h2>
                    { 
                    
                      todosOperadores.map((op)=>(
                       
                      <li className="flex transicao justify-end my-1" onClick={()=>{
                        buscarPontosDaRota(op.rotaId)
                        //Mostrar Formulário de relatar add os respectivos valores req:
                        setMostrarForm(true)
                        setIdRota(op.rotaId)
                        setOperadorId(op.id)
                        setNomeOperador(op.nome)
                      }}  key={op.id} > 
                        <span > <i> *Em Serviço* - </i></span> 
                         {op.nome} - {op.id} <span className='text-blue-500'> = Rota Nº {op.rotaId}</span> </li>
                      )) 
                    }
                </ul>
              </div>
            </div>
      </div>
          
    </div>

  )
}
