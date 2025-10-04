import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";
import dotenv from 'dotenv'
dotenv.config({path:"../.env"})
const wss = new WebSocketServer({port:Number(process.env.WEBSOCKET_PORT!)});

wss.on('connection',(ws)=>{
    UserManager.getInstance().addUser(ws);
})
