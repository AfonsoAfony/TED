import {useEffect, useState } from "react"
import eventBus from "./eventBus"

function Waiting() {

    const [waitingIconActived,setWaitingIconActived]=useState(false)

    useEffect(()=>{
        //GetOnWaitingIcon é o nome que representa a função que aparece como segundo parametro no
        //  eventBus.on("nomearFunção",função à ser executada quando chamarmos o eventBus.emit ) ex:
        // eventBus.emit("nomearFunção")
        //se na funçãoa houver parametro é só passar ex: eventBus.emit("nomearFunção", param1, param2 ...)

         eventBus.on("GetOnWaitingIcon", ()=>{
            setWaitingIconActived(true)
        })
         eventBus.on("GetOffWaitingIcon", ()=>{
            setWaitingIconActived(false)
        })
    },[])
       

        

    return(
        
        <div className={waitingIconActived ? "Mostrar flex justify-center" : "NaoMostrar"}>
            <div className="border-t-4 border-blue-500 border-solid rounded-full w-10 h-10 animate-spin"></div>
        </div>
    )
}
export default Waiting