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
      <Route path = "/" element = {<Landing/>}/>
      <Route path = "/home" element = {<Home/>}/>
      <Route path = "/pitch" element = {<Pitch/>}/>
      <Route path="/post/:hash" element = {<Post/>}/>
    </Routes>
   </Router>
  );
}
export default App;
