import {useState, useEffect, useRef} from 'react';

// Import components
import Button from '../Button/Button';
import Modal from '../Modal/Modal';

// Import helpers
import {generateExport} from '../../helpers/export';

const ExportToRdf = () => {
  const [exportRdf, setExportRdf] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  // Load export string once, on component load
  useEffect(() => {
    const response = generateExport();
    setExportRdf(response)
  }, []);
  
  return (<>
    <h2 className="heading-2">
      Export naar IMBOR RDF
    </h2><br />

    <Button onClick={() => setShowExportModal(! showExportModal)}>
      Export
    </Button>

    {showExportModal && <>
      <Modal
        primaryButtonText="Sluiten"
        primaryButtonHandler={() => setShowExportModal(false)}
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
  </>)
}

export default ExportToRdf;
