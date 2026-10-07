import 'leaflet/dist/leaflet.css';
import {useEffect, useRef} from 'react';
import GSAP from 'gsap';
import {
  map as createMap,
  divIcon,
  latLng,
  latLngBounds,
  marker,
  polyline,
  tileLayer,
  type LatLng,
  type Map as LeafletMap,
  type Marker,
} from 'leaflet';
import GoatPin from '~/assets/images/stores/goat-pin.webp';
import {REDUCED_MOTION_QUERY} from '~/lib/motion/tokens';
import type {StorePostcard} from '~/content/stores';

interface MapProps {
  stops: StorePostcard[];
  /** Index of the shop the visitor is reading; the goat hops there. */
  active: number;
  /** A shop pin was picked on the map. */
  onPick: (index: number) => void;
  /** Phones: a look-only strip, so a swipe over it still scrolls the page. */
  interactive: boolean;
}

const shopIcon = divIcon({
  className: 'store-map-pin',
  html: '<span></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const goatIcon = divIcon({
  className: 'store-map-goat',
  html: `<span class="store-map-goat-hop"><img src="${GoatPin}" alt="" width="56" height="56"></span>`,
  iconSize: [56, 56],
  iconAnchor: [28, 50],
});

/**
 * The stockist map, on real OpenStreetMap tiles (tinted to sit with the
 * postcards). The goat road-trips it: he hops to whichever shop is active and
 * a dashed route trails behind him, so the map keeps a record of his trip.
 *
 * Plain Leaflet, not react-leaflet: react-leaflet 5 needs React 19 and this
 * app runs React 18 ("render2 is not a function").
 */
export function Map({stops, active, onPick, interactive}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const goatRef = useRef<Marker | null>(null);
  const atRef = useRef<LatLng | null>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const leaflet = createMap(container, {
      scrollWheelZoom: false,
      // Quarter steps, so fitBounds can sit close to the pins instead of a whole level out.
      zoomSnap: 0.25,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
      zoomControl: interactive,
    });
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leaflet);
    leaflet.fitBounds(latLngBounds(stops.map((s) => [s.lat, s.lng])), {
      // Town labels sit right of their pins: leave them room on that side.
      paddingTopLeft: [56, 56],
      paddingBottomRight: [120, 56],
    });

    stops.forEach((stop, i) => {
      marker([stop.lat, stop.lng], {icon: shopIcon, title: `${stop.storeName}, ${stop.city}`})
        .bindTooltip(stop.city, {permanent: true, direction: 'right', offset: [12, 0], className: 'store-map-label'})
        .on('click', () => onPickRef.current(i))
        .addTo(leaflet);
    });

    const start = latLng(stops[0].lat, stops[0].lng);
    goatRef.current = marker(start, {icon: goatIcon, interactive: false, keyboard: false, zIndexOffset: 1000}).addTo(
      leaflet,
    );
    atRef.current = start;
    mapRef.current = leaflet;

    return () => {
      leaflet.remove();
      mapRef.current = null;
      goatRef.current = null;
    };
  }, [stops, interactive]);

  useEffect(() => {
    const leaflet = mapRef.current;
    const goat = goatRef.current;
    const from = atRef.current;
    const stop = stops[active];
    if (!leaflet || !goat || !from || !stop) return;
    const to = latLng(stop.lat, stop.lng);
    if (from.equals(to)) return;

    // The route he's driven: one dashed leg per hop, trailing behind him.
    const leg = polyline([from, from], {className: 'store-map-route', interactive: false}).addTo(leaflet);
    atRef.current = to;

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      goat.setLatLng(to);
      leg.setLatLngs([from, to]);
      return;
    }

    const hop = goat.getElement()?.querySelector<HTMLElement>('.store-map-goat-hop');
    const state = {t: 0};
    const tween = GSAP.to(state, {
      t: 1,
      duration: 1,
      ease: 'power1.inOut',
      onUpdate: () => {
        const here = latLng(from.lat + (to.lat - from.lat) * state.t, from.lng + (to.lng - from.lng) * state.t);
        goat.setLatLng(here);
        leg.setLatLngs([from, here]);
        if (hop) {
          const lift = Math.sin(Math.PI * state.t);
          hop.style.transform = `translateY(${-lift * 44}px) rotate(${(to.lng > from.lng ? 1 : -1) * lift * 14}deg)`;
        }
      },
      onComplete: () => {
        // A little landing squash.
        if (hop) {
          GSAP.fromTo(
            hop,
            {scaleY: 0.8, scaleX: 1.15},
            {scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)', clearProps: 'transform'},
          );
        }
      },
    });

    return () => {
      // Interrupted mid-hop: land him where he was headed.
      tween.kill();
      goat.setLatLng(to);
      leg.setLatLngs([from, to]);
      if (hop) hop.style.transform = '';
    };
  }, [active, stops]);

  return <div ref={containerRef} style={{height: '100%', width: '100%'}} />;
}
