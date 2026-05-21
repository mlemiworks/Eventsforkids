'use client';
// Leaflet accesses `window` on import, which breaks during server rendering.
// dynamic with ssr:false must be called from a client component — calling it
// directly from a server component (like the event detail page) causes a build error.
// This wrapper is the client boundary that hosts the dynamic import.
import dynamic from 'next/dynamic';

const EventMap = dynamic(() => import('./EventMap'), { ssr: false });

export default function EventMapClient(props: {
  lat: number;
  lng: number;
  locationName: string;
}) {
  return <EventMap {...props} />;
}
