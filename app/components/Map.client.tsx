import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
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
    <div className="h-[400px] w-full rounded-md overflow-hidden relative z-0">
      <div className="absolute top-4 left-4 sm:left-auto sm:right-4 z-1000 w-[calc(100%-32px)] sm:w-[320px]">
        <div className="bg-(--canvas-elevated) shadow-md rounded-lg p-2 border border-(--border-subtle) flex items-center space-x-2">
          <svg className="w-5 h-5 text-(--text-muted) ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-sm text-(--text-primary) px-2 py-1 placeholder-(--text-muted)"
            defaultValue="Charleston, SC 29401, United States"
            placeholder="Search location..."
          />
        </div>
      </div>

      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{height: '100%', width: '100%'}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores.flatMap((store) =>
          store.locations.map((location, index) => (
            <Marker key={`${store.name}-${location.address || index}`} position={[location.lat, location.lng]}>
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
