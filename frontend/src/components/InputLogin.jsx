import { useEffect, useState } from 'react'
import '../Login.css'
import { useNavigate } from 'react-router-dom'
import DivInfo from './DivInfo';
import Waiting from './Waiting';
import eventBus from './eventBus';
import LoginGoogle from '../LoginGoogle';



function SalvarDadosNoLocalStorage(id,nomeOper,emailOper,funcaoOper){
    const operador = {
  autencicado:"sim",   
  id: id,
  nome: nomeOper,
  funcao: funcaoOper,
  email: emailOper
}

localStorage.setItem("dadosOperadorAutenticado", JSON.stringify(operador));
}
function InputLogin() {
    const navigate=useNavigate();

    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    
    

 async function VerificarEmailSenha(){
    eventBus.emit("GetOnWaitingIcon")
    
    //Validate formulários
    if(email=="" || password==""){
        eventBus.emit("GetOffWaitingIcon")
        eventBus.emit("ActiveSms"," Os campos de Email e Senha devem ser devidamente preenchidos ex: xxxxxx@gmail.com  e senha: abcdefg ","positivo")
    }
    else{
        // autenticação
         const response= await fetch("http://localhost:3000/server/verificarEmailESenhaOnBd",{
            method:"POST",
            headers:({"Content-type":"application/json"}),
             body: JSON.stringify({email,password})
        }) 
        const dados= await response.json()
        if(response.ok){
            console.log(dados.returnSuccess)
            if(dados.operador.id && dados.operador.email && dados.operador.funcao  ){
                    //entrar dependendo da função:
                    
                    if(dados.operador.funcao.toLowerCase()=="gerente" ){
                        //passar os dados para o localStorage e
                        //entrar em are de operador
                        SalvarDadosNoLocalStorage(dados.operador.id,dados.operador.nome,dados.operador.email,dados.operador.funcao)
                        navigate('/areagestor')
                    }
                    else {
                        //passar os dados para o localStorage e
                        //entrar em are de operador
                        SalvarDadosNoLocalStorage(dados.operador.id,dados.operador.nome,dados.operador.email,dados.operador.funcao)
                        navigate('/areaoperadores')

                    }
                    
            }
            
            
        }else{
                console.log(` Barra Bara Barrote`)
        }
        
}
      
}
    return(
<div className=' backdrop-blur-xl w-80'>
  
    
        <div className=" transicao border-2 rounded-3xl w-80 px-5 py-5 flex justify-center flex-col">
            <div className='icon-login mb-5'>
            </div>
        <label htmlFor="*email" className='letra1_2 transicao text-amber-50'>E-mail:</label>
        <input className=" rounded text-slate-900 transicao text-center bg-slate-300 h-9 mb-6 mt-3" type="Email"  name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}  placeholder="Digite o seu mail por favor" required />
                
        <label htmlFor="password" className='letra1_2 transicao text-amber-50'>Senha:</label>
        <input className=" rounded transicao text-slate-900 text-center bg-slate-300 h-9 mb-2 mt-3" type="text" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite a sua senha por favor" required />
        
       
        <button onClick={VerificarEmailSenha} className=' transicao btnLogin'>Entrar na conta</button>

         <LoginGoogle/>
          <div id="lembrar">
                 <label className='text-slate-400'>
                   <input className="checkbox" type="checkbox" name="remember"/> Lembre de mim                  
                </label><br/><br/>
               
                  </div>

       {/*calling function that give a sms for user */}
        <div className=' flex h-0 justify-center mb-5 pt-7  border-t-2'>
            <Waiting/>
           
        </div>
           
        </div>
         <DivInfo/>
         </div>
    )
}
export default InputLogin