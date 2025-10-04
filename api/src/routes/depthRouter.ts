import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_DEPTH } from "../types/types";

export const depthRouter = Router();

depthRouter.get("/",async(req,res)=>{
    const { symbol } = req.query;
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_DEPTH,
        data:{
            market: symbol
        }
    })
    res.json(JSON.parse(response));
})

