import {useState, useEffect, useRef} from 'react';
// import Button from './Button';

// Import helper functions
// import EditObject from './EditObject/EditObject'
import MapTools from '../MapTools';

import './Sidebar.css'

const Sidebar = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="Sidebar">

      <h1>
        IMBOR demo app
      </h1>

      <p>
        Met deze app is het mogelijk om objecten te plaatsen op de kaart. De objecten worden opgehaald uit een Linked Data database. <a href="https://github.com/Stichting-CROW/demo-beheerpakket-linked-data#demo-beheerpakket-linked-data" target="_blank">Lees meer over dit project</a>.
      </p>

      <MapTools />

    </div>
  )
}

export default Sidebar;
