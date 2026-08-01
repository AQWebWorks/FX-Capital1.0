// TradingExactRealtime.jsx
import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

/* ---------------- Indicator helpers ---------------- */
const emaArray = (values, period) => {
  const res = new Array(values.length).fill(null);
  const k = 2 / (period + 1);
  let emaPrev = null;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (i < period - 1) { res[i] = null; continue; }
    if (i === period - 1) {
      const sum = values.slice(0, period).reduce((s, x) => s + x, 0);
      emaPrev = sum / period;
      res[i] = emaPrev;
    } else {
      emaPrev = (v - emaPrev) * k + emaPrev;
      res[i] = emaPrev;
    }
  }
  return res;
};

const calcMAseries = (closes, period, times) => {
  const out = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < period) continue;
    const mean = closes.slice(i - period, i).reduce((s, x) => s + x, 0) / period;
    out.push({ time: times[i], value: mean });
  }
  return out;
};

const computeMACD = (closes, times) => {
  const fast = emaArray(closes, 12);
  const slow = emaArray(closes, 26);
  const macdLine = closes.map((_, i) => fast[i] !== null && slow[i] !== null ? fast[i] - slow[i] : null);
  const compact = macdLine.filter((v) => v !== null);
  const signalCompact = emaArray(compact, 9);
  const signal = [];
  let idx = 0;
  for (let i = 0; i < macdLine.length; i++) {
    if (macdLine[i] === null) signal.push(null);
    else { signal.push(signalCompact[idx] ?? null); idx++; }
  }
  const hist = macdLine.map((m, i) => m !== null && signal[i] !== null ? m - signal[i] : null);

  const difSeries = [], deaSeries = [], histSeries = [];
  for (let i = 0; i < times.length; i++) {
    if (macdLine[i] !== null) difSeries.push({ time: times[i], value: macdLine[i] });
    if (signal[i] !== null) deaSeries.push({ time: times[i], value: signal[i] });
    if (hist[i] !== null)
      histSeries.push({ time: times[i], value: hist[i], color: hist[i] >= 0 ? "#22c55e" : "#ef4444" });
  }
  return { difSeries, deaSeries, histSeries };
};

/* ---------------- Order Modal ---------------- */
const OrderModal = ({ show, onClose, price, direction, pair }) => {
  const [selectedTime, setSelectedTime] = useState("120s");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!show) return null;

  const handleOk = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const amt = customAmount || selectedAmount;
    const seconds = parseInt(selectedTime, 10);
    if (!pair) alert("Trading pair is required")
    if (!direction) alert("Direction is required")
    if (!amt || isNaN(amt)) alert("Please enter a valid amount")
    if (!seconds) alert("Please select a valid time duration")
    if (!price) alert("Current price is unavailable")
    if (!price || !direction || !pair || !amt || isNaN(amt) || !seconds) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/order-set/create-order`,
        {
          coin: pair,
          direction: direction.toUpperCase(),
          orderDuration: seconds,
          timeUnit: "SECONDS",
          amount: amt,
          openingPrice: price
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (onClose) {
        onClose({
          pair,
          direction,
          price,
          time: seconds,
          amount: amt,
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error.message)
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0f172a] rounded-xl shadow-2xl w-[300px] text-white border border-gray-700">
        <div className="px-3 py-2 border-b border-gray-700">
          <h2 className="text-base font-bold">Order Confirmation</h2>
        </div>

        <div className="p-3 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Trading Pair</span>
            <span className="font-semibold">{pair || "BTC/USDT"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Direction</span>
            <span className={`font-semibold ${direction === "Buy" ? "text-green-400" : "text-red-400"}`}>{direction}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Current Price</span>
            <span className="font-semibold">{price ? price.toFixed(3) : "--"}</span>
          </div>

          <div>
            <p className="text-xs text-gray-300 mb-1">Select expiration time</p>
            <div className="grid grid-cols-4 gap-1">
              {[{ t: "120s", p: "20%" }, { t: "160s", p: "30%" }, { t: "200s", p: "40%" }, { t: "240s", p: "50%" }].map((opt) => (
                <button key={opt.t} onClick={() => setSelectedTime(opt.t)} className={`flex flex-col items-center justify-center py-1.5 rounded-lg border text-xs transition ${selectedTime === opt.t ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"}`}>
                  {opt.t}
                  <span className="text-[10px] text-gray-400">{opt.p}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-300 mb-1">Amount</p>
            <div className="grid grid-cols-3 gap-1 mb-1">
              {[500, 2000, 5000, 10000, 50000, 100000].map((amt) => (
                <button key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }} className={`py-1.5 rounded-lg border text-xs transition ${selectedAmount === amt ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"}`}>
                  {amt === "All" ? "All" : `$${amt}`}
                </button>
              ))}
            </div>
            <input type="number" placeholder="Custom Amount" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} className="w-full px-2 py-1.5 rounded-lg bg-transparent border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs" />
          </div>

          <div className="flex justify-between text-xs text-gray-400">
            <span>Balance: {localStorage.getItem("balance")}</span>
            <span className="text-red-400">Handling fee: 0% (0 USDT)</span>
          </div>
        </div>

        <div className="flex border-t border-gray-700">
          <button onClick={() => onClose && onClose(null)} className="flex-1 py-1.5 text-gray-400 bg-[#1e293b] hover:bg-[#2d3b50] rounded-bl-xl text-xs">Cancel</button>
          <button
            onClick={handleOk}
            disabled={isLoading}
            className={`flex-1 py-1.5 rounded-br-xl font-semibold text-white text-xs 
    ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isLoading ? "Processing..." : "OK"}
          </button>

        </div>
      </div>
    </div>
  );
};

/* ---------------- Countdown Modal ---------------- */
const TradeCountdownModal = ({ show, onClose, order }) => {
  const [timeLeft, setTimeLeft] = useState(order?.time ?? 0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!show || !order) return;
    setTimeLeft(order.time ?? 0);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [show, order]);

  if (!show || !order) return null;

  const percent = (timeLeft / (order.time || 1)) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0f172a] rounded-xl shadow-2xl w-[300px] text-white border border-gray-700 p-4 flex flex-col items-center">
        <h3 className="text-base font-bold mb-3">Trade in Progress</h3>

        {/* Circular Timer */}
        <div className="relative w-24 h-24 mb-3">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle cx="48" cy="48" r="45" stroke="#1e293b" strokeWidth="6" fill="none" />
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="#3b82f6"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={(1 - percent / 100) * 2 * Math.PI * 45}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {timeLeft}s
          </div>
        </div>

        {/* Order Details */}
        <div className="w-full text-sm space-y-1 mb-3">
          <div className="flex justify-between"><span>Pair</span><span>{order.pair}</span></div>
          <div className="flex justify-between">
            <span>Direction</span>
            <span className={order.direction === "Buy" ? "text-green-400" : "text-red-400"}>
              {order.direction}
            </span>
          </div>
          <div className="flex justify-between"><span>Buy Price</span><span>{order.price?.toFixed(3) ?? "--"}</span></div>
          <div className="flex justify-between"><span>Time</span><span>{order.time}s</span></div>
          <div className="flex justify-between"><span>Amount</span><span>{order.amount}</span></div>
        </div>

        {/* Continue Button (always visible + clickable) */}
        <button
          onClick={onClose}
          className={`mt-2 px-4 py-2 rounded-md text-white text-sm font-semibold w-full ${timeLeft > 0 ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {timeLeft > 0 ? `Continue to Trade (${timeLeft}s)` : "Continue to Trade"}
        </button>
      </div>
    </div>
  );
};

/* ---------------- Main component (start) ---------------- */
const TradingExactRealtime = () => {
  const mainRef = useRef(); const volRef = useRef(); const macdRef = useRef();
  const mainChartRef = useRef(null); const volChartRef = useRef(null); const macdChartRef = useRef(null);
  const candleSeriesRef = useRef(null); const ma5Ref = useRef(null); const ma10Ref = useRef(null); const ma30Ref = useRef(null);
  const volSeriesRef = useRef(null); const macdHistRef = useRef(null); const difRef = useRef(null); const deaRef = useRef(null);
  const priceLineRef = useRef(null); const candlesRef = useRef([]);

  const [selectedCoin, setSelectedCoin] = useState("BTCUSDT");
  const [showDropdown, setShowDropdown] = useState(false);
  const [interval, setIntervalState] = useState("1m");
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);
  const [todayHigh, setTodayHigh] = useState(null);
  const [todayLow, setTodayLow] = useState(null);
  const [maVals, setMaVals] = useState({ ma5: null, ma10: null, ma30: null });
  const [showModal, setShowModal] = useState(false);
  const [modalDirection, setModalDirection] = useState("Buy");
  const [countdownOrder, setCountdownOrder] = useState(null); // NEW - handles TradeCountdownModal

  // coins with CoinGecko icons
  const coins = [
    { symbol: "BTCUSDT", name: "BTC/USDT", icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
    { symbol: "ETHUSDT", name: "ETH/USDT", icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
    { symbol: "BNBUSDT", name: "BNB/USDT", icon: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png" },
    { symbol: "XRPUSDT", name: "XRP/USDT", icon: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png" },
    { symbol: "ADAUSDT", name: "ADA/USDT", icon: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
    { symbol: "DOGEUSDT", name: "DOGE/USDT", icon: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
    { symbol: "SOLUSDT", name: "SOL/USDT", icon: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
    { symbol: "DOTUSDT", name: "DOT/USDT", icon: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png" },
    { symbol: "MATICUSDT", name: "MATIC/USDT", icon: "https://assets.coingecko.com/coins/images/4713/large/polygon.png" },
    { symbol: "AVAXUSDT", name: "AVAX/USDT", icon: "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png" },
    { symbol: "SHIBUSDT", name: "SHIB/USDT", icon: "https://assets.coingecko.com/coins/images/11939/large/shiba.png" },
    { symbol: "TRXUSDT", name: "TRX/USDT", icon: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png" },
    { symbol: "ATOMUSDT", name: "ATOM/USDT", icon: "https://assets.coingecko.com/coins/images/1481/large/cosmos.png" },
    { symbol: "LINKUSDT", name: "LINK/USDT", icon: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png" },
    { symbol: "LTCUSDT", name: "LTC/USDT", icon: "https://assets.coingecko.com/coins/images/2/large/litecoin.png" },
  ];

  const getKlineWs = (sym, intv) => `wss://data-stream.binance.vision/ws/${sym.toLowerCase()}@kline_${intv}`;
  const getTickerWs = (sym) => `wss://data-stream.binance.vision/ws/${sym.toLowerCase()}@ticker`;
  const getCombinedTickerWs = (symbols) => {
    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join("/");
    return `wss://data-stream.binance.vision/stream?streams=${streams}`;
  };

  const [coinPrices, setCoinPrices] = useState({}); // real-time prices for dropdown coins

  /* ---------- create and sync charts ---------- */
  useEffect(() => {
    if (!mainRef.current || !volRef.current || !macdRef.current) return;

    const mainChart = createChart(mainRef.current, {
      layout: {
        background: { type: "solid", color: "#0f172a" },
        textColor: "#d1d5db",
        fontSize: 7
      },
      width: mainRef.current.clientWidth,
      height: 220,
      grid: {
        vertLines: { color: "rgba(255,255,255,0.08)" },
        horzLines: { color: "rgba(255,255,255,0.08)" }
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: {
        borderColor: "#334155",
        drawTicks: false,
      },
      timeScale: { borderColor: "#334155", timeVisible: false },
    });

    mainChartRef.current = mainChart;

    candleSeriesRef.current = mainChart.addCandlestickSeries({ upColor: "#22c55e", downColor: "#ef4444", borderDownColor: "#ef4444", borderUpColor: "#22c55e", wickDownColor: "#ef4444", wickUpColor: "#22c55e" });
    ma5Ref.current = mainChart.addLineSeries({ color: "orange", lineWidth: 1 });
    ma10Ref.current = mainChart.addLineSeries({ color: "#a78bfa", lineWidth: 1 });
    ma30Ref.current = mainChart.addLineSeries({ color: "#3b82f6", lineWidth: 1 });

    priceLineRef.current = candleSeriesRef.current.createPriceLine({
      price: 0,
      color: "#f97316",
      lineWidth: 1,
      axisLabelVisible: false,
      lineStyle: 2
    });

    const volChart = createChart(volRef.current, {
      layout: {
        background: { type: "solid", color: "#0f172a" },
        textColor: "#d1d5db",
        fontSize: 8
      },
      width: volRef.current.clientWidth,
      height: 60,
      grid: {
        vertLines: { color: "rgba(255,255,255,0.06)" },
        horzLines: { color: "rgba(255,255,255,0.06)" }
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { visible: true, borderColor: "#334155" },
      timeScale: { borderVisible: true, borderColor: "#334155", timeVisible: true },
    });
    volChartRef.current = volChart;
    volSeriesRef.current = volChart.addHistogramSeries({ priceFormat: { type: "volume" }, priceScaleId: "" });

    const macdChart = createChart(macdRef.current, {
      layout: {
        background: { type: "solid", color: "#0f172a" },
        textColor: "#d1d5db",
        fontSize: 8   // 👈 yahan font size set karo
      },
      width: macdRef.current.clientWidth,
      height: 70,
      grid: {
        vertLines: { color: "rgba(255,255,255,0.06)" },
        horzLines: { color: "rgba(255,255,255,0.06)" }
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { visible: true, borderColor: "#334155" },
      timeScale: { borderVisible: true, borderColor: "#334155", timeVisible: true },
    });
    macdChartRef.current = macdChart;
    macdHistRef.current = macdChart.addHistogramSeries({ color: "#22c55e", priceFormat: { type: "volume" }, priceScaleId: "" });
    difRef.current = macdChart.addLineSeries({ color: "#f59e0b", lineWidth: 1 });
    deaRef.current = macdChart.addLineSeries({ color: "#7c3aed", lineWidth: 1 });

    const unsubVisible = mainChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
      if (!range) return;
      try { volChart.timeScale().setVisibleRange(range); macdChart.timeScale().setVisibleRange(range); } catch (e) { }
    });

    const handleResize = () => {
      const w = mainRef.current.clientWidth;
      mainChart.applyOptions({ width: w }); volChart.applyOptions({ width: w }); macdChart.applyOptions({ width: w });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (typeof unsubVisible === "function") { try { unsubVisible(); } catch (e) { } }
      window.removeEventListener("resize", handleResize);
      try { mainChart.remove(); volChart.remove(); macdChart.remove(); } catch { }
    };
  }, []);

  /* --------- fetch history + attach selected coin websockets --------- */
  useEffect(() => {
    if (!candleSeriesRef.current || !volSeriesRef.current) return;
    let wsKline = null; let wsTickerSelected = null; let isMounted = true;

    const fetchAndInit = async () => {
      try {
        const url = `https://data-api.binance.vision/api/v3/klines?symbol=${selectedCoin}&interval=${interval}&limit=500`;
        const res = await fetch(url); const data = await res.json();
        if (!isMounted) return;

        const candles = data.map((d) => ({ time: d[0] / 1000, open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]), volume: parseFloat(d[5]) }));
        candlesRef.current = candles;
        candleSeriesRef.current.setData(candles.map((c) => ({ time: c.time, open: c.open, high: c.high, low: c.low, close: c.close })));
        volSeriesRef.current.setData(candles.map((c) => ({ time: c.time, value: c.volume, color: c.close >= c.open ? "#22c55e" : "#ef4444" })));

        const closes = candles.map((c) => c.close); const times = candles.map((c) => c.time);
        const ma5Data = calcMAseries(closes, 5, times);
        const ma10Data = calcMAseries(closes, 10, times);
        const ma30Data = calcMAseries(closes, 30, times);
        ma5Ref.current.setData(ma5Data);
        ma10Ref.current.setData(ma10Data);
        ma30Ref.current.setData(ma30Data);

        setMaVals({
          ma5: ma5Data[ma5Data.length - 1]?.value ?? null,
          ma10: ma10Data[ma10Data.length - 1]?.value ?? null,
          ma30: ma30Data[ma30Data.length - 1]?.value ?? null
        });

        const { difSeries, deaSeries, histSeries } = computeMACD(closes, times);
        difRef.current.setData(difSeries); deaRef.current.setData(deaSeries); macdHistRef.current.setData(histSeries);

        const last = candles[candles.length - 1]; setPrice(last.close);
        const prevClose = candles[candles.length - 2]?.close ?? last.open;
        setChange(((last.close - prevClose) / prevClose) * 100);
        if (priceLineRef.current) { try { priceLineRef.current.applyOptions({ price: last.close }); } catch { } }
      } catch (err) { console.error("history fetch error:", err); }
    };

    fetchAndInit();

    try {
      wsKline = new WebSocket(getKlineWs(selectedCoin, interval));
      wsKline.onmessage = (ev) => {
        const msg = JSON.parse(ev.data); if (!msg.k) return;
        const k = msg.k; const candle = { time: k.t / 1000, open: parseFloat(k.o), high: parseFloat(k.h), low: parseFloat(k.l), close: parseFloat(k.c), volume: parseFloat(k.v) };
        const arr = candlesRef.current;
        if (arr.length === 0) arr.push(candle);
        else { const last = arr[arr.length - 1]; if (last.time === candle.time) arr[arr.length - 1] = candle; else if (candle.time > last.time) { arr.push(candle); if (arr.length > 1000) arr.shift(); } }

        try {
          candleSeriesRef.current.update({ time: candle.time, open: candle.open, high: candle.high, low: candle.low, close: candle.close });
          volSeriesRef.current.update({ time: candle.time, value: candle.volume, color: candle.close >= candle.open ? "#22c55e" : "#ef4444" });
        } catch (e) {
          candleSeriesRef.current.setData(candlesRef.current.map((c) => ({ time: c.time, open: c.open, high: c.high, low: c.low, close: c.close })));
          volSeriesRef.current.setData(candlesRef.current.map((c) => ({ time: c.time, value: c.volume, color: c.close >= candle.open ? "#22c55e" : "#ef4444" })));
        }

        const closes = candlesRef.current.map(c => c.close); const times = candlesRef.current.map(c => c.time);
        const ma5Data = calcMAseries(closes, 5, times);
        const ma10Data = calcMAseries(closes, 10, times);
        const ma30Data = calcMAseries(closes, 30, times);
        ma5Ref.current.setData(ma5Data);
        ma10Ref.current.setData(ma10Data);
        ma30Ref.current.setData(ma30Data);
        setMaVals({
          ma5: ma5Data[ma5Data.length - 1]?.value ?? null,
          ma10: ma10Data[ma10Data.length - 1]?.value ?? null,
          ma30: ma30Data[ma30Data.length - 1]?.value ?? null
        });

        const { difSeries, deaSeries, histSeries } = computeMACD(closes, times);
        difRef.current.setData(difSeries); deaRef.current.setData(deaSeries); macdHistRef.current.setData(histSeries);

        setPrice(candle.close);
        const prevClose = candlesRef.current[candlesRef.current.length - 2]?.close ?? candle.open;
        setChange(((candle.close - prevClose) / prevClose) * 100);
        if (priceLineRef.current) { try { priceLineRef.current.applyOptions({ price: candle.close }); } catch { } }
      };
    } catch (e) { console.error("kline ws failed", e); }

    try {
      wsTickerSelected = new WebSocket(getTickerWs(selectedCoin));
      wsTickerSelected.onmessage = (ev) => {
        const d = JSON.parse(ev.data);
        if (d.h) setTodayHigh(parseFloat(d.h));
        if (d.l) setTodayLow(parseFloat(d.l));
        const last = parseFloat(d.c ?? d.a ?? d.b ?? NaN);
        if (!isNaN(last)) { setPrice(last); if (priceLineRef.current) { try { priceLineRef.current.applyOptions({ price: last }); } catch { } } }
      };
    } catch (e) { console.error("ticker ws (selected) failed", e); }

    return () => { isMounted = false; try { if (wsKline) wsKline.close(); } catch { } try { if (wsTickerSelected) wsTickerSelected.close(); } catch { } };
  }, [selectedCoin, interval]);

  /* ---------------- Combined ticker for dropdown (real-time for all coins) ---------------- */
  useEffect(() => {
    // build combined stream for all coins in the coins array
    const symbols = coins.map(c => c.symbol);
    if (symbols.length === 0) return;
    const combinedUrl = getCombinedTickerWs(symbols);
    let ws = null;
    try {
      ws = new WebSocket(combinedUrl);
      ws.onmessage = (ev) => {
        // combined stream messages are of the shape { stream: "...", data: {...} }
        try {
          const msg = JSON.parse(ev.data);
          const d = msg.data ?? msg; // safety
          const sym = (d.s ?? "").toUpperCase(); // e.g., "BTCUSDT"
          const last = parseFloat(d.c ?? d.a ?? d.b ?? NaN);
          if (!sym) return;
          setCoinPrices(prev => {
            // only update if price changed to reduce re-renders
            if (isNaN(last)) return prev;
            const prevVal = prev[sym];
            if (prevVal === last) return prev;
            return { ...prev, [sym]: last };
          });
        } catch (err) { /* ignore parse errors */ }
      };
      ws.onopen = () => { /* console.log("combined ticker open"); */ };
      ws.onclose = () => { /* console.log("combined ticker closed"); */ };
    } catch (e) {
      console.error("combined ticker ws failed", e);
    }

    return () => { try { if (ws) ws.close(); } catch { } };
  }, [/* run once on mount since coins array is static here */]);

  useEffect(() => { if (priceLineRef.current && price) { priceLineRef.current.applyOptions({ price }); } }, [price]);
  /* ---------------- UI ---------------- */
  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#0b1220] min-h-screen w-full text-white flex flex-col px-0">
      <div className="w-full border-b border-blue-900 mb-4">
        <div className="flex items-center justify-center -mt-6 py-3">
          <h1 className="text-base font-medium">Option Transactions</h1>
        </div>
      </div>



      {/* header */}
      <div className="flex items-start justify-between pb-2 border-b border-gray-800 relative">
        <div className="flex flex-col relative">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowDropdown(s => !s)} className="flex items-center gap-2 px-2 py-1 bg-[#1e293b] rounded-md text-sm font-semibold hover:bg-[#2d3b50] transition">
              <span className="text-sm font-bold">{selectedCoin.replace("USDT", "")}/USDT</span>
              {showDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          <div className={`text-[20px] mt-2 ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
            {price ? price.toFixed(3) : "--"} <span className="text-sm">{change >= 0 ? "↑" : "↓"}</span>
          </div>

          {/* Dropdown list (professional with icon, status, and real-time price) */}
          {showDropdown && (
            <div className="absolute top-16 left-0 w-[330px] max-h-72 overflow-y-auto bg-[#0b1220] border border-gray-700 rounded-lg shadow-xl z-50">
              {coins.map(c => {
                const lastPrice = coinPrices[c.symbol];
                const isSelected = selectedCoin === c.symbol;
                return (
                  <div
                    key={c.symbol}
                    onClick={() => { setSelectedCoin(c.symbol); setShowDropdown(false); }}
                    className={`flex items-center justify-between gap-4 px-3 py-3 cursor-pointer transition-colors duration-150 ${isSelected ? "bg-[#0f172a]" : "hover:bg-[#111827]"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-gray-800 to-gray-900 text-lg">
                        <img src={c.icon} alt={c.name} className="w-6 h-6 rounded-full" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{c.name}</span>
                        <span className="text-[11px] text-gray-400">in transaction</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-400 mr-2">Status</div>
                      <div className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-md">
                        {lastPrice ? lastPrice.toFixed(3) : "--"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className={`text-xl font-bold ${change >= 0 ? "text-green-400" : "text-red-400"}`}>{price ? price.toFixed(3) : "--"}</div>
          <div className="text-xs"><span className={`${change >= 0 ? "text-green-400" : "text-red-400"} text-xs font-medium`}>{change !== null ? `${(change * 100).toFixed(2)}%` : "--"}</span></div>
          <div className="text-[10px] text-gray-400 mt-1">
            <span>High</span> <span className="ml-1 font-medium">{todayHigh ? todayHigh.toFixed(2) : "--"}</span>
            <span className="mx-1">|</span>
            <span>Low</span> <span className="ml-1 font-medium">{todayLow ? todayLow.toFixed(2) : "--"}</span>
          </div>
        </div>
      </div>

      {/* timeframe + MA */}
      <div className="flex flex-col px-0 py-1 border-b border-gray-800">
        <div className="flex gap-1 mb-1">
          {["1m", "5m", "15m", "30m", "1h", "1d"].map(t => (
            <button
              key={t}
              onClick={() => setIntervalState(t)}
              className={`px-1 py-0.5 text-[10px] ${interval === t ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-2 text-[10px] text-gray-300">
          <div>MA5: <span className="text-orange-400 font-medium">{maVals.ma5 ? maVals.ma5.toFixed(3) : "--"}</span></div>
          <div>MA10: <span className="text-purple-300 font-medium">{maVals.ma10 ? maVals.ma10.toFixed(3) : "--"}</span></div>
          <div>MA30: <span className="text-blue-400 font-medium">{maVals.ma30 ? maVals.ma30.toFixed(3) : "--"}</span></div>
        </div>
      </div>

      {/* chart stack */}
      <div className="px-0 pt-2">
        <div className="rounded-lg border border-gray-700 bg-[#0f172a]" style={{ padding: 8 }}>
          <div ref={mainRef} className="w-full" style={{ height: 220 }} />
          <div ref={volRef} className="w-full mt-1" style={{ height: 60 }} />
          <div ref={macdRef} className="w-full mt-1" style={{ height: 70 }} />
        </div>
      </div>

      {/* bottom buttons (slim red/green) */}
      <div className="mt-2 px-0 pb-3 flex gap-2">
        <button
          onClick={() => { setModalDirection("Buy"); setShowModal(true); }}
          className="flex-1 flex flex-col items-center justify-center py-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-md shadow transition-all duration-200 transform hover:-translate-y-0.5">
          <span className="text-[8px] text-red-200">{price ? `$${price.toFixed(3)}` : "--"}</span>
          <span className="text-[10px] font-bold mt-0.25">Buy more</span>
        </button>

        <button
          onClick={() => { setModalDirection("Sell"); setShowModal(true); }}
          className="flex-1 flex flex-col items-center justify-center py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-md shadow transition-all duration-200 transform hover:-translate-y-0.5">
          <span className="text-[8px] text-green-200">{price ? `$${price.toFixed(3)}` : "--"}</span>
          <span className="text-[10px] font-bold mt-0.25">Buy less</span>
        </button>
      </div>

      {/* Order Modal (calls onClose with orderData) */}
      <OrderModal
        show={showModal}
        onClose={(orderData) => {
          // close the order modal; if orderData provided then open countdown modal
          setShowModal(false);
          if (orderData) {
            setCountdownOrder(orderData);
          }
        }}
        price={price}
        direction={modalDirection}
        pair={selectedCoin}
      />

      {/* Countdown modal (shows when countdownOrder is not null) */}
      <TradeCountdownModal
        show={!!countdownOrder}
        onClose={() => setCountdownOrder(null)}
        order={countdownOrder}
      />
    </div>
  );

};

export default TradingExactRealtime;