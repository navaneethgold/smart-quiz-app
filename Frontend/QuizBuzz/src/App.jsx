import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import './App.css'
import Login from './pages/login'
import Home from './pages/home'
import Signup from "./pages/signup";
import Layout from "./Layout";
import Groups from "./pages/groups";
import Pgroup from "./pages/particularGroup";
import GroupChat from "./pages/groupChat";
import CreateExam from "./pages/createExam";
import CreateInterface from "./pages/createExamInterface";
import ExamStart from "./pages/StartExam";
import Analytics from "./pages/Analytics";
function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/signUp" element={<Signup />} />
          <Route path='/login' element={<Login/>}/>
          <Route path="/" element={<Layout/>}>
            <Route path="/home" element={<Home />} />
            <Route path="/groups" element={<Groups/>}/>
            <Route path="/groups/:id" element={<Pgroup/>}/>
            <Route path="/groups/:id/groupChat" element={<GroupChat/>}/>
            <Route path="/create-exam" element={<CreateExam/>}/>
            <Route path="/:un/:exam" element={<CreateInterface/>}/>
            <Route path="/start-exam/:name" element={<ExamStart/>}/>
            <Route path="/:exam/analytics" element={<Analytics/>}/>
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
