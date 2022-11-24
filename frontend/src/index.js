//Here we are importing parent classes/folder as a module and you have written in the
// like App.js file and rendering them to the DOM
import React from 'react';
import ReactDOM from 'react-dom'; // it is used to enhance the React app performance
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';


// this function takes two arguments,HTML code
// and the element where we want to render it
// The purpose of this is to display specified HTML Code 
// in the specified Html element
ReactDOM.render(
  //StrictMode is a tool for highlighting potential problems like warnings/error during development phase in an application.
  // StrictMode is a developer tool,it runs only in development mode,it doesn't affect the production in any way
  // Here strict mode is applicable to child component i.e, on App
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
