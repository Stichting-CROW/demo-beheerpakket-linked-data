import {useState, useEffect, useRef} from 'react';
// import Button from './Button';

// Import helper functions
import {
  getDataStore,
  getObject,
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

  return (
    <a onClick={openObjectDetails} className="ObjectRow">
      {data.label}
    </a>
  )
}

const ObjectList = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="ObjectList">

      <h2>
        Objectenlijst
      </h2>

      <div>
        {getObjects().map(x => {
          return <ObjectRow key={x.uuid} data={x} />
        })}
      </div>

    </div>
  )
}

export default ObjectList;
