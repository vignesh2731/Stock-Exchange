import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_AVAILABLE_TICKERS } from "../types/types";

export const tickerRouter = Router();

tickerRouter.get("/",async(req,res)=>{
    const response = await RedisManager.getInstance().sendAndAwait({type:GET_AVAILABLE_TICKERS})
    return res.json(response);
})
