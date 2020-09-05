import React from 'react';
import './App.css';
import DatePicker from './component/DatePicker/DatePicker';

function onChange(timestamp) {
  console.log(timestamp);
}


function App() {
  return (
    <div className="App">

      <DatePicker onChange={onChange}/>

     
    </div>
  );
}

export default App;
