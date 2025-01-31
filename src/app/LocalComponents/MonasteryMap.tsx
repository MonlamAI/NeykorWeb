"use client";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface MonasteryMapProps {
  geoLocation: string;
  monasteryName: string;
  locale: string;
}

const MonasteryMap: React.FC<MonasteryMapProps> = ({
  geoLocation,
  monasteryName,
  locale,
}) => {
  const [lat, lng] = geoLocation
    .split(",")
    .map((coord) => parseFloat(coord.trim()));
  const position: LatLngExpression = [lat, lng];

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`${locale === "bod" && "font-monlamuchen"}`}>
          {locale === "bod" ? "ས་བབ་གནས་ས།" : "Location"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <MapContainer
            center={position}
            zoom={13}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>{monasteryName}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonasteryMap;
