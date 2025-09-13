
import { useState } from 'react'
import './App.css'
import QRCode from 'react-qr-code'
import QrScanner from './Scanner'

import Mapeamento from './Mapeamento'
import RastreamentoGestor from './RastreamentoGestor'

function App() {
  const [value,setValue]=useState("www.facebook.com")
  //valor do código qr
  return (
    
      <div>
        <QRCode value={value} size={256}/>
        <QrScanner/>
        <Mapeamento/>
        <RastreamentoGestor/>
      </div>
      
  )
}

export default App
