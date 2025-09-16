
import { useNavigate } from 'react-router-dom'
import '../App.css'
import BtnTerminarSessao from '../components/BtnTerminarSessao.jsx'


import Mapeamento from './Mapeamento.jsx'
import RastreamentoGestor from './RastreamentoGestor.jsx'
import { useEffect } from 'react'

function AreaGestor() {
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
    <div className='w-full flex py-4 px-4 border border-indigo-800 justify-between'>
        <div className='flex text-start'>
            <h1 className=" font-semibold letra1 text-3xl md:text-4xl lg:text-5xl px-4 text-white transition">T E D</h1>
        </div>
        <div className="flex text-right ">
             <BtnTerminarSessao/>
        </div>
            
    </div>
    
      <div className=' text-center pt-14 px-9 pb-12'>
        
        
      <h3 className=" font-semibold letra1 text-2xl md:text-3xl lg:text-4xl px-4 text-white transition">Mapeamento e Gestão de rotas de recolhas de resíduos</h3>
        
        <div className='flex w-full justify-between mt-16 px-3 flex-wrap lg:flex-nowrap'>

                <div className='flex items-center justify-center w-full lg:w-[45%]  '>
                        <Mapeamento/>
                        
                </div>
                <div className='flex w-full lg:w-[45%] justify-center'>
                         <RastreamentoGestor/>
                </div>
        </div>
        
       
      </div>
     </div>
      
  )
}

export default AreaGestor
