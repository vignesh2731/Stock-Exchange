export function InputBox({placeholder,type,onChangeAction,className}:{placeholder:string,type:string,onChangeAction:(value:number)=>void,className?:string}){
    return(
        <div>
            <input placeholder={placeholder} type={type} className={`${className}`} onChange={(e)=>{
                onChangeAction(Number(e.target.value ));
            }} />
        </div>
    )
}