import React, { useEffect, useState } from "react";

const coinImages = [
  "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
  "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
  "https://assets.coingecko.com/coins/images/975/large/cardano.png",
  "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
];

const CryptoBackground = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    // Generate random floating coins
    const newCoins = Array.from({ length: 20 }).map(() => ({
      id: Math.random(),
      image: coinImages[Math.floor(Math.random() * coinImages.length)],
      left: Math.random() * 100,
      size: 30 + Math.random() * 50,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
    }));
    setCoins(newCoins);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {coins.map((coin) => (
        <img
          key={coin.id}
          src={coin.image}
          alt="crypto"
          className="absolute opacity-60 animate-float"
          style={{
            left: `${coin.left}%`,
            bottom: `-${coin.size}px`,
            width: `${coin.size}px`,
            height: `${coin.size}px`,
            animationDelay: `${coin.delay}s`,
            animationDuration: `${coin.duration}s`,
          }}
        />
      ))}
      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
    </div>
  );
};

export default CryptoBackground;
