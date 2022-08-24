import React, {useEffect, useState} from 'react';

// Import components
import Map from './components/Map';
import Sidebar from './components/Sidebar/Sidebar';

import './App.css';

function App() {
  return (
    <div className="App">
      
      <Sidebar />

      <Map />
      
    </div>
  );
}

export default App;
