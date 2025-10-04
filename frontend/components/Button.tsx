"use client"
export function Button({label,onClickAction,className}:{label:string,onClickAction: ()=>void,className?:string}){
    return(
        <div className={`${className}  h-10 w-25 rounded-md flex justify-center items-center cursor-pointer`} onClick={onClickAction}>
            <p className="font-semibold">{label}</p>
        </div>
    )
}