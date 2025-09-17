
import { useNavigate } from 'react-router-dom'
import '../App.css'
import BtnTerminarSessao from '../components/BtnTerminarSessao.jsx'
import { useEffect, useState } from 'react'



//FUNÇÃO PARA BUSCAR TODAS AS ROTAS NA BASE DE DADOS:***********************************
async function buscarTodosRelatorio(){
  
 const response=await fetch("http://localhost:3000/server/BuscarTodosRelatorios")

 const dados=await response.json()
 if(response.ok){
  try {

    console.log("dados de rotas recebidos:"+dados.returnSuccess)
      return dados.relatorios
  
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





/****************************************************** */
function Relatorio() {
/***************************************************** */    
 let [rotas,setRotas] = useState([]);    
 let [relatorios,setRelatorios] = useState([]);    
  

 const navigate=useNavigate()

useEffect(()=>{

    //Buscar relatorios:
        buscarTodosRelatorio().then(relatorios=>{
            setRelatorios(relatorios)
          })

    //Buscar dados para a lista de rotas:
        buscaRotas().then(rotas=>{
            setRotas(rotas)
          })

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
    <div className='w-full flex py-4 px-4 border border-indigo-800 justify-between'>
        <div className='flex text-start'>
            <h1 className=" font-semibold letra1 text-3xl md:text-4xl lg:text-5xl px-4 text-white transition">T E D</h1>
        </div>
        <div className="flex text-right ">
             <BtnTerminarSessao/>
        </div>
            
    </div>
    
      <div className=' text-center pt-14 px-9 pb-12'>
        
        
      <h3 className=" font-semibold letra1 text-2xl md:text-3xl lg:text-4xl px-4 text-white transition">Relatório de volume e tipo de resíduos recolhidos </h3>
        
        <div className='flex w-full justify-between mt-16 px-3 flex-wrap lg:flex-nowrap'>

                <div className='flex items-center justify-center w-full lg:w-[25%]  '>
                        <div className="lista ml-1 mr-3">
                            <ul>
                            <h2 className='text-lg md:text-2xl font-bold text-indigo-200'>Lista das Rotas</h2>
                                { 
                                
                                rotas.map((r)=>(
                                <li className="flex justify-end text-sm md:text-md lg:text-lg my-2" onClick={()=>buscarRelatorio(r.id)} key={r.id}> {r.nome} - {r.id}  </li>
                                )) 
                                }
                            </ul>
                        </div>
                        
                </div>
                <div className='flex w-full mt-16 lg:mt-0 lg:w-[70%] justify-center'>
                         <div className=" border-slate-500 flex justify-center ">
     <table className="letra3 transicao border-2 w-full  rounded">
  <thead>
    <tr className="text-xs md:text-sm lg:text-xl bg-slate-900  text-slate-500">
      
      <th className="py-2 ">Relatório</th>
      <th className="py-2 ">Cod Rota</th>
      <th className="py-2 ">Tipo Resíduo</th>
      <th className="py-2 ">Volume</th>
      <th className="py-2 ">Cod Operador</th>
      <th className="py-2 ">Nome Operador</th>
      
    </tr>
  </thead>
  <tbody >
  

    
      {
       relatorios.map((relatorio,thekey)=>(
       <tr className="trData text-xs md:text-sm" id={thekey} key={thekey}>

        <td className="text-[70%] md:text-[100%] py-3"> {relatorio.id} </td>
        <td className="text-[70%] md:text-[100%] py-3"> {relatorio.rota} </td>
        <td className="text-[70%] md:text-[100%]">{relatorio.tipo}</td>
        <td className="text-[70%] md:text-[100%]">{relatorio.volume}</td>
        <td className="text-[70%] md:text-[100%]">{relatorio.operador}</td>
        <td className="text-[70%] md:text-[100%]">{relatorio.nomeoperador}</td>
        
        </tr>
     ))
     }

  </tbody>
</table>
</div>
                </div>
        </div>
        
       
      </div>
     </div>
      
  )
}

export default Relatorio
