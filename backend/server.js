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

/**********************************CHEQUIN COM QR CODE************************************/

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
                    
                      return res.status(200).json({
                        permissao:'doada',
                        returnSuccess: 'Código QR Existente'})
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
    const {nomeRota,detalheRota,PontosRota} =req.body;

    if (nomeRota && detalheRota && PontosRota) {
        //se forem passados dados válidos:
        //inserimos nas base de dados:
        try {
            
            await pc.rota.create({
                data:{
                    nome:nomeRota,
                    detalhe:detalheRota,
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


/****************************DELETAR ROTA E OS PONTOS DE LAT E LNG NA TABELA PONTOS*********************** */
app.delete("/server/deletarRotaEPontos",async (req,res)=>{
    const {idRota}=req.body
     
    if(idRota){
        try {
            const deletarPontos= await pc.rota.delete({
                //deletar os pontos primeiro:  
                where:{
                    id:Number(idRota)
                }

            })
            return res.json({ deletado:"sim",returnSuccess:"Rota Deletada com Sucesso!"})
            
        } catch (error) {
            console.log("OPS! "+error)
            return res.json({ returnError:"Erro  ao deletar dados na base de dados"})
        }

    }
    else{
            return res.json({ returnError:"OPS! Os dados passados são inválidos"})

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


//********************************************LOGIN COM GOOGLE Verificar se Email existe na base de dados (tabela operadores) */
/*
app.post("/server/verificarEmailOnBd", async (req,res)=>{
    const {emailUser}=req.body
    
    if (emailUser) {
        try {
            const DadosDoOperador = await pc.operadores.findFirst({
                select:{
                    id:true,
                    nome:true,
                    funcao:true,
                    email:true,
                },
                where:{
                    email:emailUser
                }
            })
            if (DadosDoOperador) {
                console.og(DadosDoOperador)
                return res.json({
                    DadosDoOperador,
                    
                    returnSuccess:"Email de operador existente encontrado com sucesso" 
                })
            } else {
                return res.json({returnError:"Email Não cadastrado na Base de dados"})
                
            }
            
        }
        catch (error) {

        return res.json({returnError:`Problemas ao verificar email na base de dados ${error}`})

        }
        
    } else {
        return res.status(401).json({returnError:`dados enviados são inválidos`})
    }
})

//********************************************LOGIN NORmal Verificar se Email e Senha existe na base de dados (tabela operadores) */
app.post('/server/verificarEmailESenhaOnBd',async (req,res)=>{
  const {email,password}=req.body;
    if (email && password) {
        //prisma
        const buscarOperado = await pc.operadores.findFirst({
            where:{
                email:email,
                password:password
            },
            select:{
                id:true,
                nome:true,
                email:true,
                funcao:true,
            }
        })
        if (buscarOperado) {
            console.log("achado")
            return res.json({operador:buscarOperado, returnSuccess:'Operador achado, tem permissão para avançar'})
            
        } else {
            console.log("não achado")
        return res.status(401).json({returnError:"Usuário não existe na base de dados"})
            
        }

    } else {
        return res.status(401).json({returnError:"Dados invalidos"})
        
    }
})
















/****************************BUSCAR TODAS OPERADORES*********************** */

app.get('/server/BuscarTodosOperadores', async (req,res)=>{
   
    try {
        
    const operadores=await pc.operadores.findMany({
      select:{
          id:true,
          nome:true,  
          rotaId:true,
          rota:{
            select:{
                nome:true,
                
            }
          }   
       }
    })
    
    console.log("good")
    
            if (operadores) {
                
                    return res.json({
                        operadores,
                        returnSuccess:'todas os operadores encontradoss com sucesso'})
                    
                    } else {
                    return res.status(400).json({returnError:'problemas ao pegar os operadores na base de dados'})
                    
                    }
        }
            catch (error) {
           console.log(`Erro ao executar código em api ou base de dados ${error}`) 
           return res.json({returnError:`Erro ao executar código em api ou base de dados: ${error}`})
        }
    
})






/****************************SLAVAR REALATÓRIO*********************** */

app.post("/server/SalvarRelatorio", async (req,res)=>{
    const {tipoResiduos,volume,idRota,operadorId,nomeOperador} =req.body;

    if (tipoResiduos && volume && idRota && operadorId && nomeOperador) {
        //se forem passados dados válidos:
        //inserimos nas base de dados:
        try {
            const relatorio= await pc.relatorio.create({
                data:{
                    
                    tipo:tipoResiduos,
                    volume:volume,
                    rota:Number(idRota),
                    operador:Number(operadorId),
                    nomeoperador:nomeOperador
                }
            })
            if(relatorio){
                return res.json({returnSuccess:'BOa, Relatório guardado com sucesso'})
            }
            else{
              return res.json({returnError:'Problemas ao inserir dados na base de dados'})

            }
        } catch (error) {
            return res.json({returnError:'Problemas ao inserir dados na base de dados'+ error})
        }
    }
    else{
            return res.json({returnError:'Dados inválidos'})

    }
})


/****************************BUSCAR TODAS ROTAS*********************** */

app.get('/server/BuscarTodosRelatorios', async (req,res)=>{
   
    try {
        
    const relatorios=await pc.relatorio.findMany({
      select:{
          id:true,
          tipo:true,   
          volume:true,   
          rota:true,   
          operador:true,   
          nomeoperador:true,   
       }
    })
   
            if (relatorios) {
                
                    return res.json({
                        relatorios,
                        returnSuccess:'todo o Relatório encontrado com sucesso'})
                    
                    } else {
                    return res.status(400).json({returnError:'problemas ao pegar todo relatório na base de dados'})
                    
                    }
        }
            catch (error) {
           console.log(`Erro ao executar código em api ou base de dados ${error}`) 
           return res.json({returnError:`Erro ao executar código em api ou base de dados: ${error}`})
        }
    
})
