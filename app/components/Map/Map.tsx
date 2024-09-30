"use client"

import {useState, useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import {
  getDataStore,
  getObject,
  getAttributeValue
} from '../../helpers/dataStore';

// Import models
import type {
  Object
} from '../../models/Object';

import './Map.css';

const Map = () => {
  const mapContainer = useRef(null);
  let map: any;

  const [activeMarker, setActiveMarker] = useState<any>(null);
  const [allMarkers, setAllMarkers] = useState<any[]>([]);// Keep track of all markers
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [drawedGeometry, setDrawedGeometry] = useState(false);

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

    // Init map draw
    const draw = new MapboxDraw({
      displayControlsDefault: false
    });
    map.addControl(draw);

    // Save global vars
    const windowCopy = window as any;
    windowCopy['IMBOR_DEMO_APP_map'] = map;
    windowCopy['IMBOR_DEMO_APP_mapDraw'] = draw;

    // Add markers to the map
    addShapesToMap(map);
  }, [])

  // On component load: listen to fysicalObjectsUpdated events
  useEffect(() => {
    const handler = (e: any) => addShapesToMap();
    window.addEventListener("fysicalObjectsUpdated", handler);

    return () => {
      window.removeEventListener("fysicalObjectsUpdated", handler);
    }
  }, [allMarkers]);

  // Function for adding and removing markers
  useEffect(() => {
    // Add marker
    const addDraggableMarker = (theMap: any) => {
      if(! theMap) return;
      if(activeMarker) return;
      console.log('process.env', process.env)

      const onDragEnd = async () => {
        // Get lng/lat of this marker
        const lngLat = marker.getLngLat();

        // Trigger custom event that can be listened to
        const event1 = new CustomEvent("markerUpdated", {
          detail: {
            lng: lngLat.lng,
            lat: lngLat.lat
          }
        });
        window.dispatchEvent(event1);

        // Trigger custom event that can be listened to
        const event2 = new CustomEvent("geometryUpdated", {
          detail: {
            geometry: 'point',
            inputs: [lngLat.lng, lngLat.lat]
          }
        });
        window.dispatchEvent(event2);
      }

      // Create a DOM element for the marker (custom image)
      var el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url('${process.env.NEXT_PUBLIC_PUBLIC_URL}/components/Map/icon-marker-green.svg')`
      el.style.backgroundRepeat = 'no-repeat'
      el.style.backgroundSize = 'contain'
      el.style.width = '50px';
      el.style.height = '50px';

      // Get center of map
      const {lng, lat} = theMap.getCenter();
      const marker = new maplibregl.Marker({
        draggable: true
      })
      .setLngLat([lng, lat])
      .addTo(theMap);

      // Make this marker the active marker
      setActiveMarker(marker as any);

      // Add this marker to the allMarkers variable
      setAllMarkers([...allMarkers, marker]);
    
      marker.on('dragend', onDragEnd);
      marker.on('ondblclick', () => {marker.remove()});
    }

    // Remove marker
    const removeMarker = (theMap: any) => {
      console.log('removeMarker')
      if(! activeMarker) return;
      // Remove it
      activeMarker.remove();
      // Update state
      setActiveMarker(null);
    }

    const windowCopy = window as any;
    const callbackAdd = addDraggableMarker.bind(this, windowCopy['IMBOR_DEMO_APP_map']);
    const callbackRemove = removeMarker.bind(this, windowCopy['IMBOR_DEMO_APP_map']);
    window.addEventListener('addDraggableMarker', callbackAdd);
    window.addEventListener('removeMarker', callbackRemove);
    return () => {
      window.removeEventListener('addDraggableMarker', callbackAdd);
      window.removeEventListener('removeMarker', callbackRemove);
    }
  }, [
    activeMarker
  ])

  // Function for drawing shapes on the map
  useEffect(() => {
    const windowCopy = window as any;
    const enableDrawing = () => {
      setIsDrawingEnabled(true);
      windowCopy['IMBOR_DEMO_APP_mapDraw'].changeMode('draw_polygon');
    }
    const disableDrawing = () => {
      setIsDrawingEnabled(true);
      windowCopy['IMBOR_DEMO_APP_mapDraw'].changeMode('simple_select');
    }
    const updatePolygon = (e: any) => {
      if(! e.features) return;
      if(! e.features[0]) return;

      // Get the shape that was drawn
      const shape = e.features[0];

      // Trigger custom event that can be listened to
      const event = new CustomEvent("geometryUpdated", {
        detail: {
          geometry: 'polygon',
          inputs: shape.geometry.coordinates
        }
      });
      window.dispatchEvent(event);
    }
    // Event handlers
    windowCopy['IMBOR_DEMO_APP_map'].on('draw.create', updatePolygon);
    windowCopy['IMBOR_DEMO_APP_map'].on('draw.update', updatePolygon);
    window.addEventListener('enableDrawing', enableDrawing);
    window.addEventListener('disableDrawing', disableDrawing);

    return () => {
      window.removeEventListener('enableDrawing', enableDrawing);
      window.removeEventListener('disableDrawing', disableDrawing);
    }
  }, [
    isDrawingEnabled
  ])

  const preparePopup = (uuid: any) => {
    // Get object from store
    const object: any = getObject(null, uuid);
    // Get 'identificatie' value
    const identificatie: any = getAttributeValue(object, 'identificatie');
    let popup;
    if(identificatie) {
      // Create popup
      popup = new maplibregl.Popup({ offset: 38 }).setText(
        identificatie
      );
    }
    return popup;
  }

  const drawMarker = (map: any, uuid: any, geometry: any) => {
    if(! uuid) return;
    if(! geometry || ! geometry.inputs) return;


    // Create a DOM element for the marker (custom image)
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = `url('${process.env.NEXT_PUBLIC_PUBLIC_URL}/components/Map/icon-marker.svg')`
    el.style.backgroundRepeat = 'no-repeat'
    el.style.backgroundSize = 'contain'
    el.style.width = '50px';
    el.style.height = '50px';

    // Create marker
    const marker = new maplibregl.Marker({
      element: el,
      draggable: false
    })
    .setLngLat([geometry.inputs[0], geometry.inputs[1]])

    // Add popup to marker
    const popup = preparePopup(uuid);
    marker.setPopup(popup);

    // Add marker to map
    marker.addTo(map);

    // Save marker in local variable, so we can remove it later
    allMarkers.push(marker)

    map.on('click', (e: any) => {
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

  const drawPolygon = (map: any, uuid: any, geometry: any) => {
    const windowCopy = window as any;
    var ids = windowCopy['IMBOR_DEMO_APP_mapDraw'].add({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        id: uuid,
        geometry: {
          "type": "Polygon",
          "coordinates": geometry.inputs
        }
      }]
    });
  }

  const removeMarkersFromMap = (map?: any) => {
    const windowCopy = window as any;
    if(! map) map = windowCopy['IMBOR_DEMO_APP_map'];

    // Remove all markers
    allMarkers.forEach(marker => {
      marker.remove()
    })

    // Set active marker to 'null'
    setActiveMarker(null);

    return true;
  }

  const removeShapesFromMap = (map?: any) => {
    const windowCopy = window as any;
    if(! map) map = windowCopy['IMBOR_DEMO_APP_map'];

    // Remove all shapes
    var ids = windowCopy['IMBOR_DEMO_APP_mapDraw'].set({
      type: 'FeatureCollection',
      features: []
    });

    return true;
  }

  const addShapesToMap = (map?: any) => {
    const windowCopy = window as any;
    if(! map) map = windowCopy['IMBOR_DEMO_APP_map'];

    // Remove all existing markers and shapes on the map
    removeMarkersFromMap();
    removeShapesFromMap();

    // Load data store
    const dataStore = getDataStore();
    // Loop data store and check for object locations
    const getObjectLngLat = (uuid: any, object: any) => {
      return {
        uuid: uuid,
        geometry: object.geometry
      };
    }
    const objectLocations = Object.keys(dataStore).map(uuid => getObjectLngLat(uuid, dataStore[uuid])).filter(x => x.geometry !== undefined);

    // Add markers to the map
    objectLocations.forEach(x => {
      if(x.geometry.geometry === 'point') {
        drawMarker(map, x.uuid, x.geometry)
      }
      else if(x.geometry.geometry === 'polygon') {
        drawPolygon(map, x.uuid, x.geometry)
      }
    })

    // If polygon is clicked
    map.on('draw.selectionchange', (e: any) => {
      if(! e.features || ! e.features[0]) return;

      const myEvent = new CustomEvent("geometryClicked", {
        detail: {
          uuid: e.features[0].id
        }
      });
      window.dispatchEvent(myEvent);
    })
  }

  return (
    <div key="mapContainer" ref={mapContainer} className="map" />
  )
}

export default Map;
