import { useNavigate } from "react-router-dom"
import eventBus from "./eventBus"
import { DoorOpen } from "lucide-react"

export default function BtnTerminarSessao(){

    const navigate=useNavigate()
    function TerminarSessao(){

                try {
                    localStorage.removeItem("dadosOperadorAutenticado")

                    if(localStorage.getItem('googleLogin')){
                        eventBus.emit('CloseGoogleSession')
                    }

                     navigate('/login')
                } catch (error) {
                    console.log(error)
                }

            }
       

    return(
        
            <button className="transicao rounded  mr-7 px-5 md:px-7 py-2 border-1 cursor-pointer hover:bg-red-500 border-indigo-400 hover:border-slate-400 text-indigo-400 hover:text-slate-200 " onClick={TerminarSessao}><DoorOpen size={40}/></button>
        
    )
}
