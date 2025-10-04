"use client"

interface OrderStatusType{
    onClickCloseAction:()=>void,
    status:{
        executedQty: string,
        status:string
    }
}

export function OrderStatus({onClickCloseAction,status}:OrderStatusType){
    return (
        <div className="bg-white/90 rounded-4xl flex flex-col items-center-center p-5 w-80 h-80 text-black absolute top-30 backdrop-blur left-140 z-50" >
            <div className="flex justify-end font-bold text-2xl cursor-pointer" onClick={onClickCloseAction}>
                {"X"}
            </div>
            <div className="font-bold text-2xl flex justify-center pb-10">
                {"Order Executed"}
            </div>
            <div className="flex gap-10 pb-10 pl-5">
                <div>
                    Executed Qty :
                </div>
                <div>
                    {status.executedQty}
                </div>
            </div>
            <div className="flex gap-10 pl-5">
                <div>
                    Status :
                </div>
                <div>
                    {status.status}
                </div>
            </div>
        </div>
    )
}