import {useState, useEffect, useRef} from 'react';
import Button from './Button';

// Import helper functions
import EditObject from './EditObject'

import './MapTools.css'

const MapTools = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="MapTools">
      <Button onClick={() => setIsFormVisible(! isFormVisible)}>
        ➕
      </Button>

      {isFormVisible && <div
        className="InfoBox"
      >
        <EditObject />
      </div>}

    </div>
  )
}

export default MapTools;
