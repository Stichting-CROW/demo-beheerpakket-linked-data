import React, {useEffect, useState} from 'react';

// Import components
import Map from './components/Map';
import MapTools from './components/MapTools';

import './App.css';

function App() {
  return (
    <div className="App">
      
      <Map />
      
      <MapTools />

    </div>
  );
}

export default App;
