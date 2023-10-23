import React from 'react';
import './App.css';
import Reacttable from './Components/Reacttable';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
        <Route path="/" element={<Reacttable />} />
          <Route path="/Reacttable" element={<Reacttable />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
