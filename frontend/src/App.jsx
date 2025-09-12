
import { useState } from 'react'
import './App.css'
import QRCode from 'react-qr-code'
import QrScanner from './Scanner'
import Mapeamento from './Mapeamento'

function App() {
  const [value,setValue]=useState("www.facebook.com")
  return (
    
      <div>
        <QRCode value={value} size={256}/>
        <QrScanner/>
        <Mapeamento/>
      </div>
      
  )
}

export default App
