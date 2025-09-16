
import { useEffect, useState } from 'react'
import '../App.css'
import FazerQrCode from '../ComGestor/FazerQrCode.jsx'

import Scanner from './Scanner.jsx'
import { useNavigate } from 'react-router-dom'
import BtnTerminarSessao from '../components/BtnTerminarSessao.jsx'



function AreaOperadores() {


  const navigate=useNavigate()

async function CheckinOperator(dadosQR,id,email){

  const response = await fetch(`http://localhost:3000/server/checkin`,{
    method:"POST",
    headers: ({"Content-type":"application/json"}),
    body: JSON.stringify({dadosQR,id,email})
  })

  const dataRes= await response.json();
  if (response.ok) {
    //se Código qr existir, e usuário também
    // ACEITE, enviamos para mapaOperador
    
      console.log(dataRes.returnSuccess)
    if (dataRes.permissao=="doada") {
         
         navigate("/areaoperadores/rastreamentooperador")
    } 

  } else {
    // NEGADO
    
      console.log(dataRes.returnError)
      alert(dataRes.returnError)
    
  }
}
  


useEffect(()=>{
const dados =  localStorage.getItem("dadosOperadorAutenticado");
if (dados ) {
  const operador = JSON.parse(dados);
if(!(operador.id) || !(operador.email) || (operador.autencicado) !="sim"){
   navigate('/')
}
//se  existem, pausará aqui
}
else{
   navigate('/')

}

},[])




  //o código do qr deve vir de uma tb que tem o código qr que é alterado pelo usuário quando necessário
  const [value,setValue]=useState("QRInicioTrabalho")
  //valor do código qr

  const handleScan = (data) => {
    alert(`QR Code lido`);
    //enviando dados de id e email, e também o código de barra de entrada para autenticar operador
    //os dados de email e id do operador virão do LocalStorage
    const dados =  localStorage.getItem("dadosOperadorAutenticado");
if (dados ) {
  const operador = JSON.parse(dados);

  CheckinOperator(data,operador.id,operador.email)
}
else{
  alert("Dados de operador não achado, precisas primeiro iniciar sessão para esse fim")
  navigate("/")
}
  };


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
      <div className='text-center pt-14 '>

      <h2 className=" font-semibold letra1 text-3xl md:text-4xl lg:text-5xl px-4 text-white transition">Faça check-in Para começar a trabalhar</h2>
        
        <div className='flex w-full justify-between mt-16 px-3 flex-wrap lg:flex-nowrap'>
                <div className='flex items-center p-10 justify-center w-full lg:w-[50%] '>
                        <FazerQrCode codigo={value}/>
                </div>
                <div className=' w-full lg:w-[50%] justify-center'>
                        <Scanner onScan={handleScan} />
                </div>
        </div>
        
       
      </div>
      </div>

      
  )
}

export default AreaOperadores
