
// Basically for importing the CSS file
import './App.css';
//it is downloaded through npm ,it is used in react routing to navigate between different pages/views from different components in react
import { BrowserRouter as Router, Routes, Route   } from "react-router-dom";
import Landing from './Components/Landing';
import Home from './Components/Home/Home';
import Pitch from './Components/Pitch.jsx/Pitch';
import Post from './Components/Post/Post';
function App() {
  return (
    // react router is a standard library for routing in react
    // it is used to navigate between different pages/views from different components in react

    // Router is a parent component of Routes and Route
    // Routes is a parent component of Route
    // Path species a pathname as assign to our component
    //element refers to the component which will render on matching the path
   <Router>
    <Routes>
      <Route path = "/" element = {<Landing/>}/>
      <Route path = "/home" element = {<Home/>}/>
      <Route path = "/pitch" element = {<Pitch/>}/>
      <Route path="/post/:hash" element = {<Post/>}/>
    </Routes>
   </Router>
  );
}

export default App;
