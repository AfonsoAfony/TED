import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Verifier() {
   
      const navigate=useNavigate()

    
useEffect(()=>{
    try {
const dados = localStorage.getItem("dadosOperadorAutenticado");
if (dados ) {
  const operador = JSON.parse(dados);
if(operador.id && operador.email && operador.autencicado =="sim"){
   //se existir tudo, verificaremos a funcao se gerente ou opperdado aqui
                     if(operador.funcao.toLowerCase()=="gerente" ){
                        navigate('/areagestor')
                    }
                    else {
                        navigate('/areaoperadores')

                    }
}

   else{
     navigate('/login')
    }


}
else{
   navigate('/login')

    }
    } 
catch (error) {console.log(error) }

},[])

    


}
export default Verifier