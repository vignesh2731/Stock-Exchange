import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { CREATE_ORDER, DELETE_ORDER, GET_OPEN_ORDERS } from "../types/types";

export const orderRouter = Router();


orderRouter.post("/",async(req,res)=>{
    const{ market , price , quantity , side , userId} = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CREATE_ORDER,
        data: {
            market,
            price,
            quantity,
            side,
            userId
        }
    })
    console.log(response);
    res.json(response);
})

orderRouter.delete("/",async(req,res)=>{
    const { orderId, market } = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type: DELETE_ORDER,
        data:{
            orderId,
            market
        }
    })

    res.json(response.payload);
})

orderRouter.get("/open",async(req,res)=>{
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_OPEN_ORDERS,
        data:{
            userId: req.query.userId as string,
            market: req.query.market as string
        }
    })
    return res.json(response.payload);
})
