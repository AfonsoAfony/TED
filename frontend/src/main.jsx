
import { createRoot } from 'react-dom/client'

import Login from './Login.jsx';

import {createBrowserRouter, RouterProvider} from "react-router-dom";

import { GoogleOAuthProvider } from '@react-oauth/google';
import Verifier from './verifier.jsx';

import AreaOperadores from './ComOperador/AreaOperadores.jsx';
import RastreamentoOperador from './ComOperador/RastreamentoOperador.jsx';
import AreaGestor from './ComGestor/AreaGestor.jsx';
import Relatorio from './ComGestor/Relatorio.jsx';

const router = createBrowserRouter([
   {
    path: "/",
    element: <Verifier/>,
  },
  {
    path: "areaoperadores",
    element: <AreaOperadores/>
  },
  {
    path: "areaoperadores/rastreamentooperador",
    element: <RastreamentoOperador/>
  },
  {
    path: "areagestor",
    element: <AreaGestor/>
  },
  {
    path: "login",
    element: <Login/>
  },
   {
    path: "areagestor/relatorio",
    element: <Relatorio/>
  },
  
]);


createRoot(document.getElementById('root')).render(
  
<GoogleOAuthProvider clientId="410368789410-eu7c0s80f765uep3dm6bjtbvtngcm0e5.apps.googleusercontent.com">
    <RouterProvider router={router} />
 </GoogleOAuthProvider>
)

