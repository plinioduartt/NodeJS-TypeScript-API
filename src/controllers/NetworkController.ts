import { Request, Response } from "express";
import Networks from "../entity/Network";
import Visitors from "../entity/Visitors";
import { getRepository, getConnection } from "typeorm";




class NetworkController {

    
    static index = async (req: Request, res: Response) => {

        const networks = await getRepository(Networks)
        .createQueryBuilder("networks")
        .leftJoinAndSelect("networks.visitor", "visitor")
        .getMany();

        return res.json(networks);

    }


    static show = async (req: Request, res: Response) => {

        try {
            var network = await Networks.findOneOrFail({ where: {id: +req.params.id}, relations: ['visitor'] });
        } catch (error) {
            return res.status(400).json({ message: "Rede não encontrada"});
        }
        return res.send(network);

    }


    //Enviar o atributo "visitors" como um array vazio -> []
    static store = async (req: Request, res: Response) => {

        const hasNetwork = await Networks.findOne({ str_cnpj: req.body.str_cnpj });
        if (hasNetwork != null) return res.status(400).json({ message: "Rede já cadastrada!"});

        var network = await Networks.create(req.body);

        if (!network.save()) return res.status(500).send("Erro ao cadastrar network");
        
        return res.status(201).send(network);

    }


    //  Este método não adiciona e nem remove visitantes da(s) rede(s), apenas edita as descrições&informações da(s) rede(s)
    // Para adicionar ou remover visitantes de alguma rede, utilize os métodos networkAddVisitor() e networkRmVisitor() respectivamente
    static update = async (req: Request, res: Response) => {
       
        var data = req.body;
        var network = await Networks.findOne({ id: +req.params.id });
        if (network == null) return res.status(400).json({ message: "Rede não encontrada"});
        
        NetworkController.handleVisitors(req, res).then( async (relations: any) => {
            try {
                network.visitor = data.visitor = await relations;
                network = await Networks.merge(network, data);
                network.save();
                return res.send(network);
            } catch (error) {
                return res.status(500).json({ message: "Erro ao atualizar rede", error: error});
            }
        });        

    }


    static delete = async (req: Request, res: Response) => {

        var network = await Networks.findOne({ id: +req.params.id });
        if (network == null) return res.status(400).json({ message: "Rede não encontrada"});
      
        try {

            await Networks.remove(network);
            return res.status(200).json({ message: "Rede deletada!" });
        
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar rede!", error: error });
        }
        
        
    }


    static handleVisitors = async (req, res) => {

       return new Promise( async (resolve) => {

            var visitorsArray = [];
            const visitorsReq = req.body.visitors;

            // Se não tiver nenhum ID dentro da request, retorna um array vazio logo no início
            if (visitorsReq.length == 0) resolve([]); 

            await visitorsReq.forEach( async (item, index) => {

                // Verifica se existe alguma rede com este ID
                const visitor = await Visitors.findOne({ id: item });
                if (visitor == null) return res.status(400).json({ message: `Visitante de id "${item}" não encontrado.` });
                
                visitorsArray.push(visitor);
                // Sobrescrevendo o array de Networks
                req.body.visitors = visitorsArray;
                // Caso seja o último item do foreach, executar...
                if (index == (visitorsReq.length - 1)) {
                    resolve(req.body.visitors);
                }                

            });

        });        

    }

}

export default NetworkController;