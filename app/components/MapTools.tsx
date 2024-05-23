import {useState, useEffect, useRef} from 'react';
import Button from './Button';

// Import helper functions
import EditObject from './EditObject/EditObject'
import ObjectList from './ObjectList/ObjectList'

import './MapTools.css'

const MapTools = () => {
  return (
    <div className="MapTools">

      <EditObject />

      <div className="my-4">
        <ObjectList />
      </div>

    </div>
  )
}

export default MapTools;
