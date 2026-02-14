import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import type {RetailStore} from '~/content/stores';

// Fix for default Leaflet markers not showing up
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  stores: RetailStore[];
}

export function Map({stores}: MapProps) {
  // Center roughly between the locations (Charleston area)
  const center: [number, number] = [32.95, -79.95];
  const zoom = 10;

  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden z-0">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{height: '100%', width: '100%'}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores.flatMap((store) =>
          store.locations.map((location, index) => (
            <Marker key={`${store.name}-${index}`} position={[location.lat, location.lng]}>
              <Popup>
                <div className="text-sm">
                  <strong className="block mb-1">{store.name}</strong>
                  <div className="text-gray-600">
                    {location.address} <br />
                    {location.city}, {location.state}
                  </div>
                </div>
              </Popup>
            </Marker>
          )),
        )}
      </MapContainer>
    </div>
  );
}
