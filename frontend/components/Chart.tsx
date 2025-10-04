"use client"

import { getKLines } from '@/app/utils/httpClient';
import { CandlestickSeries, createChart,SeriesType, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export function Chart({ market }: { market: string }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = createChart(chartRef.current!, {
            layout: {
                textColor: 'white',
                background: {
                    color: 'black'
                }
            },
            grid: {
                vertLines: {
                    color: '#1e293b',
                    style: 1
                },
                horzLines: {
                    color: '#1e293b',
                    style: 1
                }
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: true,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        });




        const now = Math.floor(Date.now() / 1000);
        const oneHourAgo = now - 60 * 60;

        getKLines(market, '1m', oneHourAgo, now).then(data => {
            const finalData = data
                .map(x => {
                    const utcSeconds = Math.floor(new Date(x.end).getTime() / 1000);
                    const istSeconds = utcSeconds + 5.5 * 3600;
                    return {
                        time: istSeconds as UTCTimestamp,
                        open: parseFloat(x.open),
                        high: parseFloat(x.high),
                        low: parseFloat(x.low),
                        close: parseFloat(x.close),
                    };
                })
                .sort((a, b) => a.time - b.time);
                // console.log(finalData);
            candlestickSeries.setData(finalData);
            chart.timeScale().fitContent();
        });
    }, [market]);

    return (
        <div
            ref={chartRef}
            style={{ width: "90%", height: "400px" }}
            className="flex flex-col justify-center border-white"
        />
    );
}
