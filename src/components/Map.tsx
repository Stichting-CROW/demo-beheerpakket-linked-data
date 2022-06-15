import {useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';

import './Map.css';

const Map = () => {
  const mapContainer = useRef(null);
  let map: any;

  // Function that runs on component load
  useEffect(() => {
    // If mapContainer is not available yet: return
    if(! mapContainer.current) return;
    // If map is already initialized: return
    if(map) return;

    // Init map
    map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
      center: [5.108336,52.092857], // starting position [lng, lat]
      zoom: 18 // starting zoom
    });

  }, [map])

  return (
    <div key="mapContainer" ref={mapContainer} className="map" />
  )
}

export default Map;
