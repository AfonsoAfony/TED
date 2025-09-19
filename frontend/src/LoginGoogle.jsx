
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

import { useNavigate } from 'react-router-dom';
import eventBus from './components/eventBus';

//função para salvar os dados do usuário autenticado no LocalStorage

function SalvarDadosNoLocalStorage(id,nomeOper,emailOper,funcaoOper){
    console.log(id,nomeOper,emailOper,emailOper,funcaoOper)
    localStorage.removeItem("dadosOperadorAutenticado")
       const operador = {
  autencicado:"sim",   
  id: id,
  nome: nomeOper,
  funcao: funcaoOper,
  email: emailOper
}

localStorage.setItem("dadosOperadorAutenticado", JSON.stringify(operador));
}


/************************************************************** */
 function LoginGoogle() {
/************************************************************** */
    const navigate = useNavigate();
    const [user, setUser] = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
    });





//Criando função para consultar se email é de um usuário na base de dados

async function VerificarEmailNaBD(emailUser){
    console.log(emailUser)
    //chamar icone de espera
   
    
    let response= await fetch("http://localhost:3000/server/verificarEmailOnBd",{
        method:"POST",
        headers:({"Content-type":"application/json"}),
        body: JSON.stringify({emailUser})
    })
    
    let dados=await response.json()
   
    
    if (response.ok) {
        
       
        try {
            if(dados.DadosDoOperador){
                const operador = dados.DadosDoOperador
                console.log("existente")
                eventBus.emit("GetOffWaitingIcon")
                eventBus.emit("ActiveSms",`Boa: ${dados.returnSuccess}`,"positivo")

                 //guardar dados no local storage e direccionar para dentro do sistema
                SalvarDadosNoLocalStorage(operador.id,operador.nome,operador.email,operador.funcao)
                navigate("/")                    

            }
             else{
              eventBus.emit("ActiveSms",`OPS! ${dados.returnSuccess}`,"negativo")

            }
        

        //salvar esses dados no localStorage e verificar a função se é um gestor, se for 
        //então vai para a aréa de gestão de rotas etc.
        // se for operador, vai para area de operador para fazer scanner e começar a circular na rota!

        } catch (error) {
            eventBus.emit("GetOffWaitingIcon")
            console.log(`OPS! ${error}`)
            //Activar função mostrar sms que está em DivInfo.jsx
            eventBus.emit("ActiveSms","Problemas ao verificar email, por favor actualize e tente novamente","negativo")

        }

        
    } else {
        //Usuário inexistente na base de dados
        //Activar função mostrar sms que está em DivInfo.jsx
            eventBus.emit("GetOffWaitingIcon")

            console.log(`OPS! ${dados.returnError}`)
         eventBus.emit("ActiveSms",`${dados.returnError}`,"negativo")

    }
}





    useEffect(() => {
        if (user) {
            fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    Accept: 'application/json',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar dados do usuário');
                    }
                    return response.json();
                })
                .then((data) => {
                             //Create code to navigate into the page if the email != null
                        if(data.email != null){
                         //Se o email for válido, envio faremos um fech no server para verificar se o email existe na base de dados
                            //se permitiremos a entrada e pegaremos os dados do usuário que faz o login!
                         VerificarEmailNaBD(data.email)
                         

                        //se o login for feito com sucesso então activaremos no Bus a função de terminar a sessão
                            eventBus.on('CloseGoogleSession', () => {
                                googleLogout();
                                localStorage.removeItem('dadosOperador');

                            });

                       
                    } else {
                        alert('Email Nulo');
                    }
                })
                .catch((err) => console.log(err));
        }
    }, [user]);


    return (
        <button type="button" onClick={login} className="btnLoginGoogle cursor-pointer">
            Ou faça login com o Google
        </button>
    );
}

export default LoginGoogle;
