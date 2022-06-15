import React, {useEffect, useState} from 'react';

// Import helper functions
import {getKern} from './api/imbor'

// Import components
import Map from './components/Map';

import './App.css';

interface ImborResponse {
  head: object,
  results: {
    bindings: Array<string>
  }
}

function App() {

  // Define state variables
  const [infoBoxHtml, setInfoBoxHtml] = useState('')

  const getImborData = async () => {
    let html = '';
    const query = `
      SELECT ?s ?p ?o WHERE { ?s ?p ?o . } LIMIT 250
    `
    const response: {[index: string]: any} = await getKern(encodeURI(query));
    Object.keys(response.results.bindings).forEach((key) => {
      const obj = response.results.bindings[key].o;
      html += `${obj.type} ${obj.value}<br /><br />`;
    })
    setInfoBoxHtml(html)
  }

  // Function that runs if component loads
  useEffect(() => {
    getImborData()
  }, [])

  return (
    <div className="App">
      
      <Map />
      
      <div
        className="InfoBox"
        dangerouslySetInnerHTML={{ __html: infoBoxHtml}}
      />

    </div>
  );
}

export default App;
