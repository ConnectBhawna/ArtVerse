import './App.css';
import { BrowserRouter as Router, Routes, Route   } from "react-router-dom";
import Landing from './Components/Landing';
import Home from './Components/Home/Home';
import Pitch from './Components/Pitch.jsx/Pitch';
import Post from './Components/Post/Post';
function App() {
  return (
   <Router>
    <Routes>
      <Route exact path = "/" element = {<Landing/>}/>
      <Route exact path = "/home" element = {<Home/>}/>
      <Route exact path = "/pitch" element = {<Pitch/>}/>
      <Route exact path="/post/:hash" element = {<Post/>}/>
    </Routes>
   </Router>
  );
}
export default App;
