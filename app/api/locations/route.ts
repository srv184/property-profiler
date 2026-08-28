import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) return NextResponse.json([]);
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=6&q=${encodeURIComponent(query)}`, {
      headers: { "User-Agent": "BuyerDNA-PropertyProfiler/1.0 (location autocomplete)" },
    });
    if (!response.ok) return NextResponse.json([]);
    const places: { display_name?: string }[] = await response.json();
    return NextResponse.json(places.map((place) => ({ label: place.display_name })).filter((place) => place.label));
  } catch {
    return NextResponse.json([]);
  }
}
