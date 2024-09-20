"use client"

import {useState, useEffect, useRef} from 'react';
import {InfoButton, InfoContent} from '../InfoButton/InfoButton';
// import Button from './Button';

// Import helper functions
// import EditObject from './EditObject/EditObject'
import MapTools from '../MapTools/MapTools';

import './Sidebar.css'

const Sidebar = () => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  return (
    <div className="Sidebar" id="js-Sidebar">

      <div className="flex justify-between">
        <h1>

          <span>
            IMBOR
          </span>
          &nbsp;
          <small>
            demo app
          </small>

          <small style={{alignSelf: 'flex-end'}}>
            <InfoButton isActive={isContentVisible} onClick={() => {
              setIsContentVisible(! isContentVisible)
            }} />
          </small>

        </h1>
      </div>

      <InfoContent isVisible={isContentVisible}>
        In deze tool is het mogelijk om objecten te plaatsen op de kaart. De objecten worden opgehaald uit een Linked Data database.
        <br />
        <a href="https://github.com/Stichting-CROW/demo-beheerpakket-linked-data#demo-beheerpakket-linked-data" target="_blank" style={{marginTop: '5px', display: 'inline-block'}}>
          Lees meer...
        </a>
      </InfoContent>

      <MapTools />

    </div>
  )
}

export default Sidebar;
