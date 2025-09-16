import { useNavigate } from 'react-router-dom';
import InputLogin from './components/InputLogin'
import './Login.css'
import { useEffect } from 'react';

function Login() {
    //primeiro verificar, se há usuário logado
    const navigate=useNavigate()
    useEffect(()=>{
    const dados = localStorage.getItem("dadosOperadorAutenticado");
    if (dados ) {
      const operador = JSON.parse(dados);
    if(operador.id && operador.email && operador.autencicado =="sim"){
       navigate('/')
    }
    
    //se não existem, pausará aqui
    }
    
    },[])
    
    return(
        <div className="border-black-500 h-190 " id='body_login'>
                <div className='sections'> 
                <main id="container">
                <section className="row">
                    
                    <div id="part2">
                        <div id="div-formulario">
                                
                                <div id="formLogin">
                                  
                                <InputLogin/>
                                </div>

                        </div>
                    </div>

                </section>
                </main>
                </div>
        </div>
    )
}
export default Login