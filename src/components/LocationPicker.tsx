'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet's default icon uses relative paths that webpack can't resolve.
// Pointing directly at the CDN avoids any build-tool image-handling issues.
const PIN_ICON = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const FINLAND_CENTER: [number, number] = [64.0, 26.0];
const CITY_ZOOM = 13;

// Must live inside <MapContainer> to get access to the map instance.
// Watches `center` and calls map.setView() when it changes — this is how
// react-leaflet re-centers the map after the initial mount, because the
// `center` prop on <MapContainer> is only used for the initial position.
function MapCenterController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, CITY_ZOOM);
  }, [map, center]);
  return null;
}

// Listens for click events on the map and fires the pick callback.
// useMapEvents must also be inside <MapContainer>.
function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({
  city,
  initialLat,
  initialLng,
  onLocationPick,
}: {
  city: string;
  initialLat?: number;
  initialLng?: number;
  onLocationPick: (lat: number, lng: number) => void;
}) {
  // `center` drives the map viewport; `pin` drives the marker position.
  // They start at the same point but diverge if the user scrolls the map
  // without clicking (pin stays, center follows the map).
  const hasInitialPin = initialLat != null && initialLng != null;
  const [center, setCenter] = useState<[number, number] | null>(
    hasInitialPin ? [initialLat!, initialLng!] : null,
  );
  const [pin, setPin] = useState<[number, number] | null>(
    hasInitialPin ? [initialLat!, initialLng!] : null,
  );

  // Geocode the city with Nominatim whenever it changes.
  // Only re-centers the map view — does not move an existing pin.
  useEffect(() => {
    if (!city) return;
    let cancelled = false;

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', Finland')}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'fi' } },
    )
      .then((r) => r.json())
      .then((results: Array<{ lat: string; lon: string }>) => {
        if (cancelled || !results[0]) return;
        setCenter([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
      })
      .catch(() => {
        // Silent failure — the map just won't auto-center on the city
      });

    return () => {
      cancelled = true;
    };
  }, [city]);

  const handlePick = (lat: number, lng: number) => {
    setPin([lat, lng]);
    onLocationPick(lat, lng);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="h-64 rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={center ?? FINLAND_CENTER}
          zoom={center ? CITY_ZOOM : 5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Re-centers the map when geocoding returns a new city position */}
          <MapCenterController center={center} />
          <ClickHandler onPick={handlePick} />
          {pin && <Marker position={pin} icon={PIN_ICON} />}
        </MapContainer>
      </div>
      <p className="text-xs text-ink-soft">
        Klikkaa karttaa merkitäksesi tapahtuman sijainti
      </p>
    </div>
  );
}
