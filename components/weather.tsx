"use client";

import { useEffect, useState, ReactNode } from "react";

type WeatherCondition =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Snow"
  | "Thunderstorm"
  | "Drizzle"
  | "Mist"
  | string;

interface WeatherBackgroundProps {
  children?: ReactNode;
  weatherManual?: WeatherCondition;
}

const getTextColor = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "snow":
      return "#1a1a1a"; // dark gray / near-black for bright backgrounds
    case "thunderstorm":
      return "#f9f9f9"; // very light for dark storm backgrounds
    case "clouds":
    case "rain":
      return "#f0e68c"; // warm pale yellow to contrast with gray-blue
    case "clear":
      return "#ffffff"; // default white for sunny sky gradient
    default:
      return "#ffffff"; // safe fallback
  }
};

export default function WeatherBackground({
  children,
  weatherManual,
}: WeatherBackgroundProps) {
  const [weather, setWeather] = useState<WeatherCondition>("Clear");

  useEffect(() => {
    if (weatherManual) {
      setWeather(weatherManual);
      return;
    }
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `/api/weather?lat=${latitude}&lon=${longitude}` // if using your secure proxy route
        );
        const data = await res.json();
        setWeather(data.weather?.[0]?.main || "Clear");
      },
      () => console.warn("Location permission denied.")
    );
  }, [weatherManual]);

  // Map weather → background video path
  const getVideoSrc = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "/videos/clear.mp4";
      case "clouds":
        return "/videos/clouds.mp4";
      case "rain":
      case "drizzle":
        return "/videos/rain.mp4";
      case "snow":
        return "/videos/snow.mp4";
      case "thunderstorm":
        return "/videos/thunderstorm.mp4";
      case "mist":
      case "fog":
        return "/videos/mist.mp4";
      default:
        return "/videos/clear.mp4";
    }
  };

  const videoSrc = getVideoSrc(weather);
  const textColor = getTextColor(weather);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background video */}
      <video
        key={videoSrc} // forces reload when weather changes
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Glass window overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-10" />

      {/* Content */}
      <div
        className="relative z-20 flex flex-col items-center justify-center min-h-screen"
        style={{ color: textColor }}
      >
        {children ?? (
          <div className="text-3xl font-semibold drop-shadow-lg">
            Current weather: {weather}
          </div>
        )}
      </div>
    </div>
  );
}
