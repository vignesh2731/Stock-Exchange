"use client"
import { useState } from "react";
import { Button } from "./Button";
import { InputBox } from "./InputBox";
import { placeOrder } from "@/app/utils/httpClient";
import { OrderStatus } from "./OrderStatus";

export function BuySell({market}:{market:string}){
    const [select,setSelect] = useState('Buy');
    const [price,setPrice] = useState(0);
    const [quantity,setQuantity] = useState(0);
    const [showStatusBar,setShowStatusBar] = useState(false);
    const [status,setStatus] = useState({executedQty:"",status:""});
    return(
        <div className="p-10 flex flex-col gap-10 font-semibold">
            <div className="flex">
                <Button label="Buy" onClickAction={()=>{
                    setSelect('Buy');
                }} className={`w-40 flex justify-center items-center  ${select==='Buy'? 'bg-green-300 text-green-400':'text-slate-500 bg-slate-800'}`}/>
                <Button label="Sell" onClickAction={()=>{
                    setSelect('Sell');
                }} className={`w-40 flex justify-center items-center ${select==='Sell'? 'bg-red-300 text-red-400':'text-slate-500 bg-slate-800'}`} />
            </div>
            <div className="flex justify-between w-full">
                <p className="text-sm text-slate-100">Balance</p>
                <p>-</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-100">Price</p>
                <InputBox type="string" placeholder="0" onChangeAction={(value:number)=>{
                    setPrice(value);
                }} className="w-80 bg-slate-600 h-15 flex justify-center pl-4 rounded-2xl"/>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-100">Quantity</p>
                <InputBox type="string" placeholder="0" onChangeAction={(value:number)=>{
                    setQuantity(value)
                }}  className="w-80 bg-slate-600 h-15 flex justify-center pl-4 rounded-2xl"/>
            </div>
            <div>
                <Button label={select} onClickAction={async()=>{
                    const side = select === 'Buy'? 'buy' : 'sell'
                    try{
                        if(showStatusBar){
                            alert("Close the status bar to trade");
                            return;
                        }
                        let prev = select;
                        setSelect("Order Processing...")
                        const response = await placeOrder(String(price),String(quantity),side,'1',market);
                        setStatus({executedQty:response.executedQty,status:(quantity===response.executedQty)?"Order Completed" : "Order pending"})
                        setShowStatusBar(true);
                        setSelect(prev);
                    }catch(err){
                        console.error(err);
                    }
                    
                }} className="w-80 h-15 bg-white flex justify-center items-center text-black"/>
            </div>
            {showStatusBar && <OrderStatus status={status} onClickCloseAction={()=>{
                setShowStatusBar(false);
            }}/>}
        </div>
    )
}