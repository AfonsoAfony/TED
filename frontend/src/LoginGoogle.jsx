
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

import { useNavigate } from 'react-router-dom';
import eventBus from './components/eventBus';

//Criando função para consultar se email é de um usuário na base de dados

async function VerificarEmailNaBD(emailUser){
    console.log(emailUser)
    //chamr icone de escpera
   
    
    let response= await fetch("http://localhost:3000/server/verificarEmailOnBd",{
        method:"POST",
        headers:({"Content-type":"application/json"}),
        body: JSON.stringify({emailUser})
    })
    
    let dados=await response.json()
    console.log("AS"+dados)
    
    if (response.ok) {
       console.log("responseOKA_y")
       console.log("asss"+dados.returnSuccess)
        try {
            if(dados.DadosDoOperador){
                const operador = dados.DadosDoOperador
                console.log("existente")
                eventBus.emit("GetOffWaitingIcon")
                eventBus.emit("ActiveSms",`Boa: ${dados.returnSuccess}`,"positivo")

                 console.log(`${operador.id} mn ${operador.nome} mn ${operador.email}mn ${operador.funcao}`)
                 //guardar dados no local storage e direccionar para dentro do sistema
                localStorage.setItem('autenticacao', 'autenticado');
                //SalvarDadosNoLocalStorage(dados.id,dados.nome,dados.email,dados.funcao)

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

//função para salvar os dados do usuário autenticado no LocalStorage
function SalvarDadosNoLocalStorage(id,nomeOper,emailOper,funcaoOper){
    const operador = {
  autencicado:"sim",   
  id: id,
  nome: nomeOper,
  funcao: emailOper,
  email: funcaoOper
};

localStorage.setItem("dadosOperador", JSON.stringify(operador));
}





 function LoginGoogle() {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
    });

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
                                localStorage.removeItem('autenticacao');
                                localStorage.removeItem('googleLogin');
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
