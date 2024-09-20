"use client"

import { Provider } from 'react-redux';
import { store } from './store';

// Import components
import Map from './components/Map/Map';
import Sidebar from './components/Sidebar/Sidebar';

import './page.css';

export default function Home() {
  return (
    <Provider store={store}>
      <div className="App">
        
        <Sidebar />

        <Map />
        
      </div>
    </Provider>
  );
}
