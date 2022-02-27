import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home";
import Media from "./media";
import Camera from "./cameraSim";
import "react-vant/lib/index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes path="/" element={<Home />}>
        <Route path="media" element={<Media />}></Route>
        <Route index element={<Camera />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
