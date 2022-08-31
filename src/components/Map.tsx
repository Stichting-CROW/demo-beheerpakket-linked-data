import {useState, useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';

import {
  getDataStore,
  getObject,
  getAttributeValue
} from '../helpers/dataStore';

// Import models
import type {
  Object
} from '../models/Object';

import './Map.css';

const Map = () => {
  const mapContainer = useRef(null);
  let map: any;

  const [activeMarker, setActiveMarker] = useState(null);
  const [allMarkers, setAllMarkers] = useState([]);// Keep track of all markers

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

    window['IMBOR_DEMO_APP_map'] = map;

    // Add markers to the map
    addMarkersToMap(map);
  }, [])

  // On component load: listen to fysicalObjectsUpdated events
  useEffect(() => {
    const handler = (e: any) => addMarkersToMap();
    window.addEventListener("fysicalObjectsUpdated", handler);

    return () => {
      window.removeEventListener("fysicalObjectsUpdated", handler);
    }
  }, [allMarkers]);

  // Function for adding and removing markers
  useEffect(() => {
    // Add marker
    const addDraggableMarker = (theMap) => {
      if(! theMap) return;
      if(activeMarker) return;

      const onDragEnd = async () => {
        // Get lng/lat of this marker
        const lngLat = marker.getLngLat();

        // Trigger custom event that can be listened to
        const myEvent = new CustomEvent("markerUpdated", {
          detail: {
            lng: lngLat.lng,
            lat: lngLat.lat
          }
        });
        window.dispatchEvent(myEvent);
      }

      // Create a DOM element for the marker (custom image)
      var el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url('/components/Map/marker-new.png')`
      el.style.backgroundRepeat = 'no-repeat'
      el.style.backgroundSize = 'contain'
      el.style.width = '50px';
      el.style.height = '50px';

      // Get center of map
      const {lng, lat} = theMap.getCenter();
      const marker = new maplibregl.Marker(el, {
        draggable: true
      })
      .setLngLat([lng, lat])
      .addTo(theMap);

      // Make this marker the active marker
      setActiveMarker(marker);

      // Add this marker to the allMarkers variable
      setAllMarkers([...allMarkers, marker]);
    
      marker.on('dragend', onDragEnd);
      marker.on('ondblclick', () => {marker.remove()});
    }

    // Remove marker
    const removeMarker = (theMap) => {
      if(! activeMarker) return;
      // Remove it
      activeMarker.remove();
      // Update state
      setActiveMarker(null);
    }

    const callbackAdd = addDraggableMarker.bind(this, window['IMBOR_DEMO_APP_map']);
    const callbackRemove = removeMarker.bind(this, window['IMBOR_DEMO_APP_map']);
    window.addEventListener('addDraggableMarker', callbackAdd);
    window.addEventListener('removeMarker', callbackRemove);
    return () => {
      window.removeEventListener('addDraggableMarker', callbackAdd);
      window.removeEventListener('removeMarker', callbackRemove);
    }
  }, [
    activeMarker
  ])

  const preparePopup = (uuid) => {
    // Get object from store
    const object = getObject(null, uuid);
    // Get 'identificatie' value
    const identificatie = getAttributeValue(object, 'identificatie');
    let popup;
    if(identificatie) {
      // Create popup
      popup = new maplibregl.Popup({ offset: 38 }).setText(
        identificatie
      );
    }
    return popup;
  }

  const addMarker = (map, uuid, lngLat) => {
    if(! uuid) return;
    if(! lngLat || lngLat.length !== 2) return;

    // Create marker
    const marker = new maplibregl.Marker({
      draggable: false
    })
    .setLngLat([lngLat[0], lngLat[1]])

    // Add popup to marker
    const popup = preparePopup(uuid);
    marker.setPopup(popup);

    // Add marker to map
    marker.addTo(map);


    // Save marker in local variable, so we can remove it later
    allMarkers.push(marker)

    map.on('click', (e) => {
      const targetElement = e.originalEvent.target;
      const element = marker._element;
      if (targetElement === element || element.contains((targetElement))) {
        const myEvent = new CustomEvent("markerClicked", {
          detail: {
            uuid: uuid
          }
        });
        window.dispatchEvent(myEvent);
      }
    })
  }

  const removeMarkersFromMap = (map?: any) => {
    if(! map) map = window['IMBOR_DEMO_APP_map'];

    // Remove all markers
    allMarkers.forEach(marker => {
      marker.remove()
    })

    // Set active marker to 'null'
    setActiveMarker(null);

    return true;
  }

  const addMarkersToMap = (map?: any) => {
    if(! map) map = window['IMBOR_DEMO_APP_map'];

    // Remove all existing markers on the map
    removeMarkersFromMap();

    // Load data store
    const dataStore = getDataStore();
    // Loop data store and check for object locations
    const getObjectLngLat = (uuid, object) => {
      return {
        uuid: uuid,
        lngLat: object.geometry
      };
    }
    const objectLocations = Object.keys(dataStore).map(uuid => getObjectLngLat(uuid, dataStore[uuid])).filter(x => x.lngLat !== undefined);
    // Add markers to the map
    objectLocations.forEach(x => {
      addMarker(map, x.uuid, x.lngLat)
    })
  }

  return (
    <div key="mapContainer" ref={mapContainer} className="map" />
  )
}

export default Map;
