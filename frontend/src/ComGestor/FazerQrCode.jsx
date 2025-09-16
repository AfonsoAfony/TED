import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

 function FazerQrCode (props) {
  console.log(props.codigo)
let [cod,setcod]=useState(props.codigo)
  return (
    <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto">
      
     
      <QRCodeSVG value={cod}  bgColor="#ffffff"
            fgColor="#000000" size={256} level="H"/>
    </div>
  );
};

export default FazerQrCode;
