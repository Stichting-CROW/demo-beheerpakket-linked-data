// import {useState, useEffect, useRef} from 'react';

import EditObject from '../EditObject/EditObject';
import ObjectList from '../ObjectList/ObjectList';
import ExportToRdf from '../ExportToRdf/ExportToRdf';

import './MapTools.css'

const MapTools = () => {
  return (
    <div className="MapTools">

      {/* Edit object form */}
      <EditObject />

      {/* Object list */}
      <div className="my-4">
        <ObjectList />
      </div>

      {/* Export RDF button + output */}
      <div className="my-4">
        <ExportToRdf />
      </div>

    </div>
  )
}

export default MapTools;
