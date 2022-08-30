
import {useState, useEffect, useRef} from 'react';
// import Button from './Button';

// Import helper functions
import {
  getDataStore,
  getObject,
  deleteObject,
  getAttributeValue
} from '../../helpers/dataStore';

import './ObjectList.css'

import type {Object} from '../../models/Object';

const objects: Object[] = [
  {
    label: '5G-antenne',
    uri: 'https://data.crow.nl/imbor/def/6f4ed3b6-6fcd-4816-b573-29b1d8dd69a7'
  },
  {
    label: 'Afvalbak',
    uri: 'https://data2.crow.nl/imbor/def/6f4ed3b6-6fcd-4816-b573-29b1d8dd69a7'
  },
]

const getObjects = () => {
  // Load data store
  const dataStore = getDataStore();
  if(! dataStore) return;
  const objects = Object.keys(dataStore).map(key => {
    return {
      uuid: key,
      label: getAttributeValue(dataStore[key], 'identificatie'),
    }
  });
  return objects;
}

const ObjectRow = ({data}) => {
  const openObjectDetails = (e) => {
    // Click marker
    const myEvent = new CustomEvent("markerClicked", {
      detail: {
        uuid: data.uuid
      }
    });
    window.dispatchEvent(myEvent);
    // Scroll to top of sidebar
    var sidebar = document.getElementById('js-Sidebar');
    sidebar.scrollTop = 0;
  };
  const deleteObjectHandler = (e) => {
    e.preventDefault();

    // Ask for confirmation
    if(! window.confirm(`Weet je zeker dat je object "${data.label}" wilt verwijderen?`)) {
      return;
    }

    // Delete object from localStorage
    deleteObject(data.uuid);

    // Reload data
    const myEvent = new CustomEvent("fysicalObjectsUpdated");
    window.dispatchEvent(myEvent);
  }

  return (
    <div className="ObjectRow">
      <a onClick={openObjectDetails} className="ObjectRow-title">
        {data.label}
      </a>
      <a onClick={deleteObjectHandler} className="ObjectRow-delete">
        X
      </a>
    </div>
  )
}

const ObjectList = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [objects, setObjects] = useState([]);

  const fetchObjects = () => {
    setObjects(getObjects())
  }

  // On component load: load objects
  useEffect(() => {
    fetchObjects();
  }, []);

  // On component load: listen to fysicalObjectsUpdated events
  useEffect(() => {
    const handler = (e: any) => fetchObjects();
    window.addEventListener("fysicalObjectsUpdated", handler);

    return () => {
      window.removeEventListener("fysicalObjectsUpdated", handler);
    }
  }, []);

  return (
    <div className="ObjectList">

      <h2>
        Objectenlijst
      </h2>

      <div>
        {objects ? objects.map(x => {
          return <ObjectRow key={x.uuid} data={x} />
        }) : <div />}
      </div>

    </div>
  )
}

export default ObjectList;
