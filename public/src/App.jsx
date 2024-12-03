import {BrowserRouter,Routes,Route} from "react-router-dom";
import Register from "./Pages/Register";
import Chat from "./Pages/Chat";
import Login from "./Pages/Login";
import SetAvatar from "./Pages/SetAvatar";
function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/setAvatar" element={<SetAvatar/>}></Route>
        <Route path="/" element={<Chat/>}></Route>
      </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
