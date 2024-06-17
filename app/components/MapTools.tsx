import {useState, useEffect, useRef} from 'react';
import Button from './Button';

import {generateExport} from '../helpers/export';

import EditObject from './EditObject/EditObject'
import ObjectList from './ObjectList/ObjectList'
import Modal from './Modal/Modal';

import './MapTools.css'

const MapTools = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportRdf, setExportRdf] = useState('');

  // Load export string once, on component load
  useEffect(() => {
    const response = generateExport();
    setExportRdf(response)
  }, []);

  return (
    <div className="MapTools">

      <EditObject />

      <div className="my-4">
        <ObjectList />
      </div>

      <div className="my-4">
        <h2 className="heading-2">
          Export naar IMBOR RDF
        </h2>

        <Button onClick={() => setShowExportModal(! showExportModal)}>
          Export
        </Button>
      </div>

      {(showExportModal || true) && <>
        <Modal
          primaryButtonHandler={() => {}}
          secundaryButtonHandler={() => setShowExportModal(false)}
          style={{
            width: 'calc(100% - 360px)',
            left: '350px',/* sidebar 320px + 20px spacing */
            height: 'calc(100% - 124px - 20px)'/* minus top:124px minus 20px spacing */
          }}
        >
          <pre className="text-left text-xs w-full h-full">
            {exportRdf}
          </pre>
        </Modal>
      </>}

    </div>
  )
}

export default MapTools;
