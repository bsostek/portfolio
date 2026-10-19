import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const apiKey = process.env.WEATHER_API_KEY; // no NEXT_PUBLIC_ prefix needed here
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("OpenWeatherMap request failed:", data);
    return NextResponse.json(data, { status: res.status });
  }

  return NextResponse.json(data);
}
