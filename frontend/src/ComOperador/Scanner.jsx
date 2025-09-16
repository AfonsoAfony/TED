
import { useState,useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function Scanner({ onScan }) {
const scannerRef = useRef(null);


useEffect(()=>{
 // criamos um scanner dentro da variavel html5QrCode
 //  e adicionamoso video a um elemento html com o id="Regiao-html5-qr-Code"
 const scannerId = 'Regiao-html-div';
 const html5QrCode = new Html5Qrcode(scannerId);

 //inicimos a camara/scanner
  html5QrCode.start(
      { facingMode: 'environment' },   // câmera traseira, (user- para camara de frente)
      {
       
        fps: 10,                           //tenta detectar QR Code 10 vezes por segundo.
        qrbox: { width: 250, height: 250 } //define uma área de leitura de 250x250 pixels.
      },
      (TextoDecodificado) => {
        //QR code Detectado aplicar uma ação (Callback)
        
        console.log(' QR Code detectado:', TextoDecodificado);
        if (onScan) {
          onScan(TextoDecodificado)
        };
      },
      (errorMessage) => {   //chamado em erros de leitura (geralmente ignorado).
        // Ignora erros de leitura contínuos
      }
    ).catch((err) => {
      console.error(' Erro ao iniciar scanner:', err);
    });

    scannerRef.current = html5QrCode;   //Salva a instância do scanner para poder parar depois.

    return () => {
      //Quando o componente é desmontado, 
      // o scanner é parado e limpo para liberar a câmera 
      // e evitar vazamentos de memória:

      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
        });
      }
    };
},[onScan])

 return (
    <div className="flex flex-col items-center justify-center p-4">
      <div id="Regiao-html-div" className="w-full max-w-md" />
    </div>
  );
}