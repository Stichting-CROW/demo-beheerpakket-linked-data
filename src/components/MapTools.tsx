import {useState, useEffect, useRef} from 'react';
import Button from './Button';

// Import helper functions
import EditObject from './EditObject/EditObject'
import ObjectList from './ObjectList/ObjectList'

import './MapTools.css'

const MapTools = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="MapTools">

      <Button
        classes="w-full"
        onClick={() => setIsFormVisible(! isFormVisible)}
        >
        {isFormVisible ? 'Annuleer' : 'Object toevoegen'}
      </Button>

      {isFormVisible && <div
        className="InfoBox"
      >
        <EditObject />
      </div>}

      <div className="my-4">
        <ObjectList />
      </div>

    </div>
  )
}

export default MapTools;
