import {useState, useEffect, useRef} from 'react';
import Modal from '../Modal/Modal';

// Import helper functions
import {
  getDataStore,
  getObject,
  deleteObject,
  getAttributeValue
} from '../../helpers/dataStore';

// Import models
import type {
  Object
} from '../../models/Object';

import './ObjectList.css'

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
  const [showModal, setShowModal] = useState(false);

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
  const deleteObjectHandler = () => {
    // Delete object from localStorage
    deleteObject(data.uuid);

    // Reload data
    const myEvent = new CustomEvent("fysicalObjectsUpdated");
    window.dispatchEvent(myEvent);

    // Hide modal
    setShowModal(false);
  }

  // Get object from store
  const object = getObject(null, data.uuid);
  // Get 'identificatie' value
  const identificatie = getAttributeValue(object, 'identificatie');

  return (
    <div className="ObjectRow">

      <a onClick={openObjectDetails} className="ObjectRow-title">
        {identificatie}
      </a>
      <a onClick={() => {
        setShowModal(true);
      }} className="ObjectRow-delete">
        X
      </a>

      {showModal && <Modal
        primaryButtonHandler={deleteObjectHandler}
        secundaryButtonHandler={() => setShowModal(false)}
      >
        Weet je zeker dat je object <b>{data.label}</b> wilt verwijderen?
      </Modal>}

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

      <h2 className="heading-2">
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
