import express from "express"
import cors from "cors"

import prisma from "@prisma/client"

const {PrismaClient}= prisma
const pc = new PrismaClient(); 

//invocar express
const app = express()

app.use(cors({
  origin: 'http://localhost:5173', // ou '*', se for teste
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}))
app.use(express.json())

app.listen("3000",()=>console.log("Ouvindo na porta 3000"))

//verificar checkin de operador com dados do código que ele enviou
app.post("/server/checkin",async (req,res)=>{
    const {dadosQR,id,email}= req.body

    if(dadosQR && id && email){
        
        console.log("Dados requeridos enviados")
        /*se realmente envou os dados, verificamos se realmente dão iguais aos 
        que estão na nossa data base, para assim dar por autenticado ou não */
        const verificador=await  pc.operadores.findFirst({
           
            where:{
                id:Number(id),
                email:email,
            } 
        })
        if (!verificador) {
        // Nenhum operador encontrado com esse id + email
            return res.status(403).json({ returnError: 'Acesso negado' })
        }
        else{
            //se usuário que faz o escanner existe, então verificaremos o código qr enviado
            const verificarQR= await pc.qRCodes.findUnique({
                where:{
                    dadosQR:dadosQR
                }
            })
            if (!verificarQR) {
                //QR code inexistente
                console.log("não existe esse qr code na nossa tabela de codigos QR")
                  return res.status(403).json({ returnError: 'Acesso negado' })
            } else {
                    //QR CODE ENCONTRADO, RETORNAR ACESSO PERMITIDO
                    
                      return res.status(200).json({returnSuccess: 'Código QR Existente'})
            }
        }
       
    }
    else{
        console.log("Dados requeridos não enviados")

        //retornar sms de erro:
        return res.status(404).json({
            returnError: 'usuário não encontrado'
        })
    }
})
/****************************CRIAR ROTAS*********************** */

app.post("/server/salvarPontosERotas", async (req,res)=>{
    const {nomeRota,PontosRota} =req.body;

    if (nomeRota && PontosRota) {
        //se forem passados dados válidos:
        //inserimos nas base de dados:
        try {
            
            await pc.rota.create({
                data:{
                    nome:nomeRota,
                    pontos:{
                        create: PontosRota.map(p=>({
                                lat:p.lat,
                                lng:p.lng
                            }))
                    }
                },
                include:{pontos:true}
            });
            //se passar pelo insert em 2 data bases(rota e pontos) returna
            return res.status(201).json({returnSuccess : `Rota Salva com sucesso!`});
            
        } catch (error) {
             console.error('Erro ao salvar rota:', error);
            return res.status(500).json({ returnError: 'Erro interno' });
        }

    } 
    else {
        return res.status(400).json({ returnError: 'Dados inválidos' });
    }
})


/****************************BUSCAR TODAS ROTAS*********************** */

app.get('/server/BuscarTodasRotas', async (req,res)=>{
   
    try {
        
    const rotas=await pc.rota.findMany({
      select:{
          id:true,
          nome:true,   
       }
    })
    
    console.log("good")
    
            if (rotas) {
                
                    return res.json({
                        rotas,
                        returnSuccess:'todas as rotas encontradas com sucesso'})
                    
                    } else {
                    return res.status(400).json({returnError:'problemas ao pegar todas as rotas na base de dados'})
                    
                    }
        }
            catch (error) {
           console.log(`Erro ao executar código em api ou base de dados ${error}`) 
           return res.json({returnError:`Erro ao executar código em api ou base de dados: ${error}`})
        }
    
})


/****************************BUSCAR {LAT E LNG} DE ROTAS NA TABELA PONTO*********************** */

app.get('/server/BuscarPontosRota/:idRota', async (req,res)=>{
     const {idRota} = req.params
   
     if(idRota){
            try {
                const buscarPontos= await pc.ponto.findMany({
                    select:{
                        lat:true,
                        lng:true,
                    },
                    where:{
                        rotaId:Number(idRota)
                    }
                })
                if(buscarPontos){
                    console.log("Pontos encontrados")
                    return res.json({pontosRecebidos:buscarPontos, returnSuccess : `Pontos (latitude e longitude) da rota encontrados`})
                   
                }
            } catch (error) {
                return res.json({returnError: `Erro ao Buscar os pontos na db ${error}`})
            }
     }
     else{

     }
    
})


