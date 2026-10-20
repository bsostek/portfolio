"use client";

import { useEffect, useState, ReactNode } from "react";
import { API_BASE } from "../lib/api";

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

// Dark overlay strength per background, measured so white text keeps roughly
// 4.5:1 contrast even on the brightest frames behind the bio text.
const getOverlayOpacity = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "clouds":
    case "mist":
    case "fog":
    case "snow":
      return 0.45;
    case "rain":
    case "drizzle":
      return 0.3;
    case "thunderstorm":
      return 0.1; // already dark
    default:
      return 0.35; // clear
  }
};

export default function WeatherBackground({
  children,
  weatherManual,
}: WeatherBackgroundProps) {
  const [weather, setWeather] = useState<WeatherCondition>("Clear");

  useEffect(() => {
    // ?weather=clouds (etc.) previews a background without changing location.
    const override = weatherManual ?? new URLSearchParams(window.location.search).get("weather");
    if (override) {
      setWeather(override);
      return;
    }
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `${API_BASE}/api/weather?lat=${latitude}&lon=${longitude}` // if using your secure proxy route
        );
        const data = await res.json();
        if (!res.ok || !data.weather?.[0]?.main) {
          console.error("Failed to fetch weather, defaulting to Clear:", data);
          setWeather("Clear");
          return;
        }
        setWeather(data.weather[0].main);
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
        return "/videos/clouds.mp4"; // no dedicated mist.mp4 asset
      default:
        return "/videos/clear.mp4";
    }
  };

  const videoSrc = getVideoSrc(weather);
  const overlayOpacity = getOverlayOpacity(weather);

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

      {/* Frosted overlay: blur softens the video, the tint keeps text readable */}
      <div
        className="absolute inset-0 backdrop-blur-sm z-10 transition-colors duration-700"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      />

      {/* Content */}
      <div
        className="relative z-20 flex flex-col items-center justify-center min-h-screen text-white"
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
