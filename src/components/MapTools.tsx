import {useState, useEffect, useRef} from 'react';
import Button from './Button';

// Import helper functions
import EditObject from './EditObject/EditObject'
import ObjectList from './ObjectList/ObjectList'

import './MapTools.css'

const MapTools = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    // Listen to markerClicked events
    window.addEventListener("markerClicked", (e: any) => {
      setIsFormVisible(true);
    });
  }, []);

  return (
    <div className="MapTools">

      <Button
        classes="w-full"
        onClick={() => setIsFormVisible(! isFormVisible)}
        >
        {isFormVisible ? 'Annuleer' : 'Object toevoegen'}
      </Button>

      <div
        className="InfoBox"
        style={{display: isFormVisible ? 'block' : 'none'}}
      >
        <EditObject />
      </div>

      <div className="my-4">
        <ObjectList />
      </div>

    </div>
  )
}

export default MapTools;
