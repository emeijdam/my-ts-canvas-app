import React from 'react';
import './App.css';
import NodeCanvas from './nodeCanvas/NodeCanvas';

function App() {

  return (
    <div className="App">
        <div style={{backgroundColor: "red", display: 'flex',  justifyContent: 'center', gap: '12px'}}>
          <button style={{}}>CLICK ME1</button>
          <button style={{}}>CLICK ME2</button>
        </div>
        <NodeCanvas width={window.innerWidth} height={window.innerHeight}/>
    </div>
  );
}

export default App;
