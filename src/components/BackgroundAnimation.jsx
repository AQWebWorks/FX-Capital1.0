import React from "react";

const coinImages = [
  "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
  "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
  "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
];

export default function BackgroundAnimation() {
  const coins = Array.from({ length: 20 }).map((_, i) => {
    const img = coinImages[i % coinImages.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = 18 + Math.random() * 12;
    const size = 35 + Math.random() * 15; // slightly bigger

    return (
      <img
        key={i}
        src={img}
        alt="coin"
        className="absolute opacity-80 rounded-full filter drop-shadow-[0_0_6px_rgba(0,0,0,0.6)] animate-float"
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          transformOrigin: "center",
        }}
      />
    );
  });

  return <div className="absolute inset-0 overflow-hidden z-0 perspective-[800px]">{coins}</div>;
}
