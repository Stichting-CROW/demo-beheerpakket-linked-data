import React, {useEffect} from 'react';

// Import helper functions
import {getVocabulaire} from './api/imbor'

// Import components
import Map from './components/Map';

import './App.css';

function App() {

  // Function that runs if component loads
  useEffect(() => {
    // getVocabulaire('SELECT%20?s%20?p%20?o%20WHERE%20%7B%20?s%20?p%20?o%20.%20%7D%20LIMIT%2010');
  }, [])

  return (
    <div className="App">
      <Map />
    </div>
  );
}

export default App;
