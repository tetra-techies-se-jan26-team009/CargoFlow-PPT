import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from "react-leaflet";
import "leaflet-routing-machine";

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

function Routing({ pickup, delivery, shipmentId, setEtaMap, hideInstructions = false }) {
    const map = useMap();

    useEffect(() => {
        if (!pickup || !delivery) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(pickup.lat, pickup.lng),
                L.latLng(delivery.lat, delivery.lng)
            ],
            router: L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1"
            }),

            lineOptions: {
                styles: [
                    { color: "#60a5fa", weight: 8, opacity: 0.6 },
                    { color: "#2563eb", weight: 4 }
                ]
            },

            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            routeWhileDragging: false,

            createMarker: () => null,
            itineraryFormatter: () => null,
        }).addTo(map);

        const container = routingControl.getContainer();

        if (hideInstructions && container) {
            container.style.display = "none";
        }
        routingControl.on("routesfound", function (e) {
            const route = e.routes[0];

            const minutes = Math.ceil(route.summary.totalTime / 60);
            const km = (route.summary.totalDistance / 1000).toFixed(1);

            setEtaMap(prev => ({
                ...prev,
                [shipmentId]: {
                    eta: minutes,
                    distance: km
                }
            }));

            map.fitBounds(L.latLngBounds(route.coordinates));
        });

        return () => {
            if (routingControl) {
                map.removeControl(routingControl);
            }
        };
    }, [map, pickup, delivery, shipmentId, setEtaMap, hideInstructions]);
}

export default function TrackingMap({ pickup, delivery, currentAgent, shipmentId, setEtaMap, hideInstructions }) {

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
                <Routing
                    pickup={pickup}
                    delivery={delivery}
                    shipmentId={shipmentId}
                    setEtaMap={setEtaMap}
                    hideInstructions={hideInstructions}
                />

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