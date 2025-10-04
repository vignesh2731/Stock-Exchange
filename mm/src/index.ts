import axios from "axios"

const BASE_URL = "http://localhost:3000"
async function main(){
    while(1){
        const response = await axios.post(`${BASE_URL}/api/v1/orders`,{
            price: Number(Math.random()*100),
            quantity: Number(Math.random()*100),
            market: "ITC_USDC",
            userId: "1"
        })
        console.log(response.data);
    }
}

main();