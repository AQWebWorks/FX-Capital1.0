import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const BTCChart = () => {
  const chartContainerRef = useRef();
  const chart = useRef();
  const candleSeries = useRef();
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);

  const fetchHistoricalData = async () => {
    try {
      const res = await fetch(
        "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1500"
      );
      const data = await res.json();

      return data.map((d) => ({
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));
    } catch (err) {
      console.error("Error fetching historical data:", err);
      return [];
    }
  };

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#1a1a1a" },
        textColor: "#d9d9d9",
      },
      grid: {
        vertLines: { color: "rgba(42, 46, 57, 0.5)" },
        horzLines: { color: "rgba(42, 46, 57, 0.5)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: window.innerHeight,
      crosshair: { mode: 1 },
    });

    chart.current.timeScale().applyOptions({
      rightBarStaysOnScroll: true,
      barSpacing: 0.8,
      minBarSpacing: 0.1,
    });

    chart.current.applyOptions({
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    candleSeries.current = chart.current.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    fetchHistoricalData().then((histData) => {
      if (histData.length > 0) {
        candleSeries.current.setData(histData);
        chart.current.timeScale().fitContent();

        const last = histData[histData.length - 1];
        setPrice(last.close);
        setChange(((last.close - last.open) / last.open) * 100);
      }
    });

    const ws = new WebSocket("https://api.binance.com/api/v3/ticker/price");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.k) {
        const k = message.k;
        const dataPoint = {
          time: k.t / 1000,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
        };

        candleSeries.current.update(dataPoint);
        setPrice(dataPoint.close);
        setChange(((dataPoint.close - dataPoint.open) / dataPoint.open) * 100);
      }
    };

    const handleResize = () => {
      chart.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chart.current) chart.current.remove();
      ws.close();
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={chartContainerRef} className="w-full h-full" />
      {price && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 rounded px-2 py-1 text-xs">
          Price:{" "}
          <span className={change >= 0 ? "text-green-400" : "text-red-400"}>
            {price.toFixed(2)} ({change.toFixed(2)}%)
          </span>
        </div>
      )}
    </div>
  );
};

export default BTCChart;
