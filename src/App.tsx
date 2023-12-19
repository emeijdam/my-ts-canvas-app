import React from 'react';
import './App.css';
import NodeCanvas from './nodeCanvas/NodeCanvas';

function App() {

  return (
    <div className="App">
        <NodeCanvas width={window.innerWidth} height={window.innerHeight}/>
    </div>
  );
}

export default App;
