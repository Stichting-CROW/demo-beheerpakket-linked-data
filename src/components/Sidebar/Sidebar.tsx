import {useState, useEffect, useRef} from 'react';
// import Button from './Button';

// Import helper functions
// import EditObject from './EditObject/EditObject'
import MapTools from '../MapTools';

import './Sidebar.css'

const Sidebar = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="Sidebar" id="js-Sidebar">

      <div className="flex">
        <h1>
          <span>
            IMBOR
          </span>
          &nbsp;
          <small>
            demo app
          </small>
        </h1>
      </div>

      <div className="Sidebar-introduction">
        In deze tool is het mogelijk om objecten te plaatsen op de kaart. De objecten worden opgehaald uit een Linked Data database.
        <br />
        <a href="https://github.com/Stichting-CROW/demo-beheerpakket-linked-data#demo-beheerpakket-linked-data" target="_blank">Lees meer...</a>
      </div>

      <MapTools />

    </div>
  )
}

export default Sidebar;
