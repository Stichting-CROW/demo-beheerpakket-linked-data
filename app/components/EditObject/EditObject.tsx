import {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';

import {config} from '../../config';

// Import models
import {
  URL,
  UUID,
  Object,
  Literal,
  AttributeRelationValue,
  Geometry
} from '../../models/Object';

// Import components
import Button from '../Button/Button';
import Attribute from './Attribute';

// Import helper functions
import {
  getKern,
  getGeoClasses
} from '../../api/imbor'
import {
  getAttributesForClass,
  getPhysicalObjectsForSource
} from '../../api/common'
import {
  makeTriplesObject,
  getUniquePhysicalObjects
} from '../../helpers/triples';
import {
  getDataStore,
  getObject
} from '../../helpers/dataStore';
import {
  selectPhysicalObjects,
  selectGeoClasses,
  setPhysicalObjects,
  setGeoClasses,
} from './editObjectSlice';

import './EditObject.css'
import SourceLabel from '../SourceLabel/SourceLabel';
import { Source } from '@/app/types';

interface ImborResponse {
  head: object,
  results: {
    bindings: Array<string>
  }
}

interface AttributesProps {
  data: any[];
}

const Attributes: React.FC<AttributesProps> = ({ data }) => {
  if (!data || data.length <= 0) return null;

  return (
    <div data-name="attributes">
      {data.map((triple, index) =>
        <Attribute key={index} data={triple} />
      )}
    </div>
  )
}

const selectedObjectTypeLocation = true;

type lngLat = [number, number][];

const EditObject = () => {
  // Define state variables
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [locationOnMap, setLocationOnMap] = useState<lngLat>([]);
  const [activeUuid, setActiveUuid] = useState<any>();
  const [selectedSource, setSelectedSource] = useState<any>();
  const [selectedObjectType, setSelectedObjectType] = useState<any>();
  const [geometry, setGeometry] = useState<Geometry>();
  
  // Get store variables
  const physicalObjects = useSelector(selectPhysicalObjects);
  const geoClasses = useSelector(selectGeoClasses);
  const dispatch = useDispatch();

  // Fetch geo classes
  const fetchGeoClasses = async () => {
    const response = await getGeoClasses();
    if(! response || ! response.results) {
      return;
    }
    // Store geoClasses in local store
    dispatch(setGeoClasses(response.results?.bindings))
  }

  // Fetch attributes for a specific FysicalObject class
  const fetchAttributesForClass = async (source: Source, classUri: URL) => {
    if(! classUri) return;
    const response = await getAttributesForClass(source, classUri);
    const triples = makeTriplesObject(response);
    // Make ID the first attribute
    const sortedTriples = triples.sort((a: any, b: any) => {
      return a?.entry_text?.value === 'identificatie' ? -1 : 1;
    });
    setAttributes(sortedTriples);
    return triples;
  }

  // Function that runs if component loads
  useEffect(() => {
    fetchGeoClasses();
  }, []);

  // Function that runs if component loads
  useEffect(() => {
    const geometryClickedCallback = async (e: any) => {
      // Get clicked object data
      const object: any = getObject(null, e.detail.uuid);
      console.log('object', object)
      // If no object info was found: Stop executing
      if(! object) return;
      // Make edit form visible
      setIsFormVisible(true);
      // Set active source
      const source: any = (object?.uri && object?.uri.indexOf('https://data.crow.nl') > -1)
                      ? config.sources['imbor_kern']
                      : config.sources['gwsw_basis_v161'];
      const div_source: HTMLInputElement | null = document.getElementById('source') as HTMLInputElement | null;
      const input_source: HTMLInputElement | null = div_source?.getElementsByClassName("react-datalist-input__textbox")[0] as HTMLInputElement | null;
      input_source?.setAttribute('placeholder', source.title);
      setSelectedSource({
        id: source.name,
        value: source.title,
        label: source.title,
        uri: source.url
      });
      // Set this UUID as active UUID
      setActiveUuid(e.detail.uuid)
      // Fill in 'object type' input field
      const div_objectType: HTMLInputElement | null = document.getElementById('objectType') as HTMLInputElement | null;
      const input_objectType = div_objectType?.getElementsByClassName("react-datalist-input__textbox")[0];
      input_objectType?.setAttribute('placeholder', object.label);
      // Update 'objectType' state variable
      setSelectedObjectType({
        label: object.uri,
        id: object.label,
        type: object.type,
        uri: object.uri
      });
      // Add geometry (marker or polygon) to state
      // But only if it's unedited
      if(object.geometry) {
        setLocationOnMap(object.geometry.inputs);
        setGeometry(object.geometry);
      }
      // Fetch attributes for object type
      const attributes = await fetchAttributesForClass(source, object.uri);
      // Fill in all attributes after a few milliseconds (so state can update first)
      setTimeout(() => {
        if(! object.attributes) return;
        object.attributes.forEach((x: any) => {
          if(! x.value) return;
          const el: any = document.getElementById(`js-attribute-input-${x.label}`);
          // If it's a select field:
          if(el?.options) { 
            el.value = x.value;
          }
          // If it's an input field:
          else {
            el?.setAttribute('value', x.value);
          }
        });
      }, 1000)
    }

    const markerUpdatedCallback = (e: any) => {
      setLocationOnMap([e.detail.lng, e.detail.lat]);
    }

    const geometryUpdatedCallback = (e: any) => {
      setGeometry(e.detail);
    }

    // Listen to markerClicked events
    window.addEventListener("markerClicked", geometryClickedCallback);

    // Listen to markerUpdated events
    window.addEventListener("markerUpdated", markerUpdatedCallback);

    // Listen to geometryClicked events
    window.addEventListener("geometryClicked", geometryClickedCallback);

    // Listen to geometryUpdated events
    window.addEventListener("geometryUpdated", geometryUpdatedCallback);

    return () => {
      window.removeEventListener("markerClicked", geometryClickedCallback);
      window.removeEventListener("markerUpdated", markerUpdatedCallback);
      window.removeEventListener("geometryUpdated", geometryUpdatedCallback);
      window.removeEventListener("geometryClicked", geometryClickedCallback);
    }
  }, [
    activeUuid
  ])

  // Function that runs if source is selected or changes
  useEffect(() => {
    (async () => {
      if(! selectedSource || ! selectedSource.id) return;

      const source = config.sources[selectedSource.id];
      if(! source) return;
  
      const response = await getPhysicalObjectsForSource(source);
      const uniqueTriples = getUniquePhysicalObjects(response.results?.bindings);
      const sortedTriples = uniqueTriples.sort((a, b) => {
        return a.label.value > b.label.value ? 1 : -1;
      });
      dispatch(setPhysicalObjects(sortedTriples))
    })();
  }, [selectedSource]);

  // Function that runs if selected objectType changes
  useEffect(() => {
    if(! selectedObjectType) return;

    fetchAttributesForClass(config.sources[selectedSource.id], selectedObjectType.label);
  }, [selectedObjectType])

  // Function that prepares data to be used for DatalistInput
  const prepareSourcesForDataList = (sources: any) => {
    let ret: any = [];
    for(let x in sources) {
      ret.push({
        id: sources[x].name,
        value: sources[x].title,
        label: sources[x].title,
        uri: sources[x].url
      });
    }
    return ret;
  }

  // Function that prepares data to be used for DatalistInput
  const prepareObjectsForDataList = (objects: any) => {
    let ret: any = [];
    for(let x in objects) {
      ret.push({
        id: objects[x]['label'].value,
        value: objects[x]['label'].value,
        label: objects[x]['classURI'].value,
        type: objects[x]['subClassOf'] ? objects[x]['subClassOf'].value : '',
        uri: objects[x]['classURI'].value
      });
    }
    return ret;
  }

  // Function that resets form state
  const resetFormState = () => {
    setAttributes([])
    setLocationOnMap([])
    setGeometry(undefined)
    setSelectedSource(null);
    setSelectedObjectType(null);
    setActiveUuid(null)
    // Clear form
    const form = document.getElementById('js-editObjectForm') as HTMLFormElement;
    if (form) {
      form.reset();
    }
    // Reload data
    const myEvent = new CustomEvent("fysicalObjectsUpdated");
    window.dispatchEvent(myEvent);
  }

  // Function that runs if user saves object
  const handleSubmit = () => {
    // Validate that location was set
    if(! geometry || ! geometry.inputs || geometry.inputs.length <= 0) {
      const windowCopy: any = window;
      windowCopy.notify('Verplaats eerst de marker op de kaart of teken een gebied in');
      return;
    }

    // Create an unique UUID or save the data with existing id
    const uuid: UUID = activeUuid || crypto.randomUUID();

    // Populate attributes array
    let attributesArray = [] as AttributeRelationValue<Literal>[];
    attributes.forEach((x: any) => {
      if(! x.entry_text) return;
      // Get input value
      const input_field: any = document.getElementById(`js-attribute-input-${x.entry_text.value}`) as HTMLInputElement | null;
      const isSelectField = input_field?.options;
      const entry_value = input_field?.value;
      // const entry_text = isSelectField ? input_field.options[input_field.selectedIndex]?.text : '';
      // Check if field has a value
      if(! entry_value) return;

      attributesArray.push({
        uri: x.entry_iri,// type URL
        type: x.group_iri ? x.group_iri.value : null,// group URL
        value: entry_value,
        label: x.entry_text.value
      });
    })

    const object: Object = {
      uri: selectedObjectType.label,
      label: selectedObjectType.id,

      uuid: uuid,
      type: '',
      geometry: geometry,
      attributes: attributesArray
    }

    // Store attributesArray with all values into localStorage
    const dataStore = getDataStore();
    dataStore[uuid] = object;
    if(typeof window !== 'undefined') {
      localStorage.setItem('IMBOR_DEMO_APP_physicalObjects', JSON.stringify(dataStore));
    }

    // Close EditForm
    resetFormState();
    setIsFormVisible(false);

    // Disable drawing
    const event = new Event("disableDrawing");
    window.dispatchEvent(event);

    // Return
    console.info('Saved into localStorage');
    return true;
  }

  // Get geo type (point/polygon) of objects parent classUri
  const getGeoClass = (objectType: URL): boolean | string => {
    // Filter geoClasses on objectType
    const foundGeoClass = geoClasses.filter((x: any) => {
      return x.classURI.value === objectType;
    })
    if(objectType === 'Wegvak' || objectType === 'Halteplaats') {
      return 'polygon';
    }
    else if(foundGeoClass.length === 0) {
      return 'point';
    }
    // Return geoClass if found
    else if(foundGeoClass[0].geoKlasseLabel.value === 'GM_Point') {
      return 'point';
    }
    else if(foundGeoClass[0].geoKlasseLabel.value === 'GM_Surface') {
      return 'polygon';
    } else {
      return 'point';
    }
  }

  const showAttributes = selectedObjectType && geometry && geometry.inputs;

  // If physical objects did not load: Show loading text
  if(selectedSource && (! physicalObjects || physicalObjects.length <= 0)) {
    return (
      <div className="EditObject">
        Bezig met laden van objecttypen...
      </div>
    )
  }

  return (
    <div className="EditObject">
      <div className="EditObject-buttons">
        {showAttributes && (
          <Button onClick={(e: Event) => {
            e.preventDefault();
            handleSubmit();
          }}
          >
            Opslaan
          </Button>
        )}

        <Button
          classes={`${isFormVisible ? 'Button-white' : ''} ${(isFormVisible && locationOnMap && locationOnMap.length >= 1) ? 'margin-left' : ''}`}
          onClick={() => {
            setIsFormVisible(! isFormVisible);
            resetFormState();
          }}
          >
          {isFormVisible ? 'Annuleer' : 'Object toevoegen'}
        </Button>
      </div>

      <div
        className="InfoBox"
        style={{display: isFormVisible ? 'block' : 'none'}}
      >

        <form className="EditObject" id="js-editObjectForm" onSubmit={(e) => {e.preventDefault()}}>

          <DatalistInput
            placeholder="Bron"
            label="1. Selecteer een bron"
            id="source"
            onSelect={(item) => {
              setSelectedSource(item);
            }}
            items={prepareSourcesForDataList(config.sources)}
          />

          <div style={{visibility: selectedSource ? 'visible' : 'hidden'}}>
            <SourceLabel>
              {selectedSource?.uri}
            </SourceLabel>
            <DatalistInput
              placeholder="Objecttype"
              label="2. Selecteer een objecttype"
              id="objectType"
              onSelect={(item) => {
                setSelectedObjectType(item)

                // Get geoClass (point/polygon)
                const geoClass = getGeoClass(item.value);

                if(! geometry || ! geometry.inputs) {
                  let event = (
                    geoClass === 'point'
                      ? new Event("addDraggableMarker")
                      : new Event("enableDrawing")
                  )
                  window.dispatchEvent(event);
                }
              }}
              items={prepareObjectsForDataList(physicalObjects)}
            />
          </div>
          {selectedObjectType ? <SourceLabel>
            {selectedObjectType.uri}
          </SourceLabel>
          : <></>}

          {selectedObjectType && (! locationOnMap || locationOnMap.length < 1) && ! activeUuid && <p className="EditObject-note">
            Verplaats de marker op de kaart om een object toe te voegen.
          </p>}

          {showAttributes && <div style={{margin: '15px 0'}}>
            <Attributes data={attributes} />
          </div>}
        </form>

      </div>
    </div>
  )
}

export default EditObject;
