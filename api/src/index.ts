import express from 'express'
import { depthRouter } from './routes/depthRouter';
import { tickerRouter } from './routes/tickerRouter';
import { kLinesRouter } from './routes/kLinesRouter';
import { orderRouter } from './routes/orderRouter';
import cors from 'cors'
import { tradesRouter } from './routes/tradesRouter';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/depth",depthRouter);
app.use("/api/v1/tickers",tickerRouter);
app.use("/api/v1/klines",kLinesRouter);
app.use("/api/v1/orders",orderRouter);
app.use("/api/v1/trades",tradesRouter)

app.listen(3000,()=>{
    console.log(`Listening to port 3000`);
})