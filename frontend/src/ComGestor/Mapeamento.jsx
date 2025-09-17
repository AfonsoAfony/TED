import { useEffect } from 'react';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import eventBus from '../components/eventBus';
import { Trash2 } from 'lucide-react';

deletarRota
//FUNÇÃO PARA DELETAR ROTA E OS PONTOS QUE A PERTENCEM NA TABELA PONTOS:***********************************
async function deletarRota(idRota){
  
 const response=await fetch("http://localhost:3000/server/deletarRotaEPontos",{
  method:"DELETE",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({idRota })
 })

 const dados=await response.json()
   

 if(response.ok){
  try {
    if(dados.deletado=="sim"){
        console.log("dados de rotas eletados com sucesso:"+dados.returnSuccess)
        //actualizar lista de rotas
        eventBus.emit("BuscarTodasRotasEmostrarLista")      

    } 
    else{
        console.log("OPS! "+dados.returnError)


    }     
  
    } catch (error) {
    console.log(`problemas: ${error}`);
  }
 }

}




//FUNÇÃO PARA BUSCAR TODAS AS ROTAS NA BASE DE DADOS:***********************************
async function buscaRotas(){
  
 const response=await fetch("http://localhost:3000/server/BuscarTodasRotas")

 const dados=await response.json()
 if(response.ok){
  try {

    console.log("dados de rotas recebidos:"+dados.returnSuccess)
      return dados.rotas
  
    } catch (error) {
    console.log(`problemas: ${error}`);
  }
 }

}


//FUNÇÃO PARA SALVAR ROTA NA BASE DE DADOS:**********************************************
async function salvarRota(nomeRota,detalheRota,PontosRota){
  //Salvar Rota na table rota que relaciona-se com os pontos que são criados na mesma hora que criamos a rotas

  if (nomeRota!="" && PontosRota.length>=2) {
 
  const response= await fetch("http://localhost:3000/server/salvarPontosERotas",{
  method:"POST",
  headers: ({"Content-type":"application/json"}),
  body: JSON.stringify({nomeRota,detalheRota, PontosRota})
})

const dados= await response.json()
if (response.ok) {
  console.log(`Boa: ${dados.returnSuccess}`)
    eventBus.emit("BuscarTodasRotasEmostrarLista")      

  
} else {
  console.log(`OPS! ${dados.returnError}`)

}
 
} else {
  alert("seleccione os ponto digite o nome da rota para salvar rota")
}
}





function Localizador({ adicionarPonto }) {
  //Localizar/Seleccionar latitude e longitude no map:
  const [posicao, setPosicao] = useState(null);

  //Quando Clicarmos no map
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosicao([lat, lng]);
      adicionarPonto({ lat, lng }); //aqui onde o adicionarPonto pega o ponto atualiza estado no componente pai
      console.log('Coordenadas selecionadas:', lat, lng);
    },
  });

  return posicao ? <Marker position={posicao} /> : null;
}

//Ponto de partida - Empresa
const pontoInicial = [{ lat: -8.839, lng: 13.289 }];













/*****************************************************************/
export default function Mapeamento() {
/******************************************************************/


  const [conjuntoPontos, setConjuntoPontos] = useState([]);
  let [rotas,setRotas] = useState([]);
  
  //Dados para criar rotas:
  const [detalheRota,setDetalheRota]=useState("")
  const [nomeRota,setNomeRota]=useState("")

  //*****************Executar Buscar dados de rotas no inicio:************************
  //Criar um eventBus para buscar os dados e aciona-la na useEffect quando começaro p
eventBus.on("BuscarTodasRotasEmostrarLista",()=>{
        buscaRotas().then(rotas=>{
            setRotas(rotas)
          })
      })
  useEffect(()=>{
    eventBus.emit("BuscarTodasRotasEmostrarLista")      
    
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



// a função add novo ponto é executado sempre que clicamos na tela em :
// <Localizador adicionarPonto={adicionarPonto} />

  const adicionarPonto = (ponto) => {
    //usamos um spread para add um novo ponto, se fosse apenas um array usariamos push, como é um hook usamos o operador ... "spread"
    setConjuntoPontos((prev) => [...prev, ponto]); // atualiza estado 
  };


  
    // Caminho para imagem PNG
    const iconePersonalizado = L.icon({
      iconUrl: 'img/garbage.png', // ou 'https://teusite.com/marcador.png'
      iconSize: [30, 30],               // tamanho do ícone
      iconAnchor: [15, 30],             // ponto que será alinhado à coordenada
      popupAnchor: [0, -30],            // onde o popup aparece em relação ao ícone
       
    });




  return (
    <div className=' text-left'>
      <div className="map w-[400px] md:w-[550px] xl:w-[670px] mb-4" >
        <MapContainer center={pontoInicial[0]} zoom={11} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {conjuntoPontos.map((p, i) => (
            <Marker key={i} position={[p.lat, p.lng]} icon={iconePersonalizado} />
          ))}

          <Polyline positions={conjuntoPontos.map((p) => [p.lat, p.lng])} color="green" />

          <Localizador adicionarPonto={adicionarPonto} />
        </MapContainer>
      </div>

      <div className=' flex justify-between'>
        <div className='w-[40%]'>
                <div className='mt-2'>
                    <input type="text" className='w-full rounded text-black bg-indigo-100 ml-1 mb-2 py-1 px-2 transicao ' value={nomeRota} onChange={(e)=>setNomeRota(e.target.value)} placeholder='Nome da rota'/>
                    <textarea className=' rounded w-full h-20 text-black bg-indigo-100 ml-1 mb-2 py-2 px-2 transicao' value={detalheRota} onChange={(e)=>setDetalheRota(e.target.value)} placeholder='detalhe da rota'/>
                    
                </div>
                    
                    <button className=' ml-1 mr-3  bg-transparent text-indigo-200 font-semibold text-sm md:text-lg border-2 rounded border-indigo-200 py-3 px-5 transicao hover:border-none hover:bg-indigo-400  hover:text-slate-950' onClick={() => salvarRota(nomeRota,detalheRota,conjuntoPontos)}>
                Guardar Rota
              </button>
              <button className=' ml-1 mt-2  bg-transparent text-red-300 font-semibold text-sm md:text-lg border-2 rounded border-red-300 py-3 px-6 transicao hover:border-none hover:bg-red-800  hover:text-slate-950' onClick={() => {
                setConjuntoPontos([])
                console.log(conjuntoPontos)
                setNomeRota("")
                setDetalheRota("")
              }}>
              Parar
              </button>
        </div>
        <div className='w-[55%] flex justify-end text-right'>
                <div className="lista ml-1 mr-3">
            <ul>
              <h2 className='text-lg md:text-2xl font-bold text-indigo-200'>Lista das Rotas</h2>
                { 
                
                  rotas.map((r)=>(
                  <li className="flex justify-end my-1" onClick={()=>buscarPontosDaRota(r.id)} key={r.id}> {r.nome} - {r.id} <button onClick={()=>deletarRota(r.id)} className='transicao ml-2 text-indigo-300 hover:text-red-500'><Trash2/></button></li>
                  )) 
                }
            </ul>
          </div>
        </div>
  </div>
      


      
      
      
    </div>
  );
}
