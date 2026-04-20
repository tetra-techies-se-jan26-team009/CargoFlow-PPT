import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Polyline } from 'react-leaflet';

// Standard Leaflet Icon fix for React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function TrackingMap({ pickup, delivery, currentAgent }) {
    // Center on agent if moving, otherwise pickup
    const center =
        pickup && delivery
            ? [
                (pickup.lat + delivery.lat) / 2,
                (pickup.lng + delivery.lng) / 2
            ]
            : pickup
                ? [pickup.lat, pickup.lng]
                : [20.5937, 78.9629];
    return (
        <div style={{
            height: "100%",
            width: "100%",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #E2E8F0",
            position: "relative",
            zIndex: 0
        }}>
            <MapContainer center={center} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {pickup && <Marker position={[pickup.lat, pickup.lng]}><Popup>Pickup Point</Popup></Marker>}
                {delivery && <Marker position={[delivery.lat, delivery.lng]}><Popup>Destination</Popup></Marker>}
                {pickup && delivery && (
                    <Polyline
                        positions={[
                            [pickup.lat, pickup.lng],
                            [delivery.lat, delivery.lng]
                        ]}
                        pathOptions={{ color: "blue", weight: 4 }}
                    />
                )}

                {/* The icon that will move during simulation */}
                {currentAgent && (
                    <Marker position={[currentAgent.lat, currentAgent.lng]}>
                        <Popup>Agent is currently here</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}