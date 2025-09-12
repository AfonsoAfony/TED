import { useState } from 'react'
import { QrReader } from 'react-qr-reader'

async function CheckinOperator(dadosQR,id,email){
  const response = await fetch(`http://localhost:3000/server/checkin`,{
    method:"POST",
    headers: ({"Content-type":"application/json"}),
    body: JSON.stringify({dadosQR,id,email})
  })

  const dataRes= await response.json();
  if (response.ok) {
    //se Código qr existir, e usuário também
    // ACEITE
    
      console.log(dataRes.returnSuccess)
    

  } else {
    // NEGADO
    
      console.log(dataRes.returnError)
    
  }
}


export default function QrScanner() {
  const [data, setData] = useState('GHI')

  return (
    <div>
      <button onClick={()=>CheckinOperator(data,1,"A@prisma")}>
          Clica cá
      </button>
      <h2>Fazer Checkin</h2>

     

      <p>Resultado: {data}</p>
    </div>
  )
}
















