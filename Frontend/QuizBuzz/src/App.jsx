import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/login'
import Home from './pages/home'
import Signup from "./pages/signup";
import Layout from "./Layout";
import Groups from "./pages/groups";
import Pgroup from "./pages/particularGroup";
function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/signUp" element={<Signup />} />
          <Route path='/login' element={<Login/>}/>
          <Route path="/" element={<Layout/>}>
            <Route path="/home" element={<Home />} />
            <Route path="/groups" element={<Groups/>}/>
            <Route path="/groups/:groupId" element={<Pgroup/>}/>
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
