import { Outlet } from "react-router-dom";
import Sidebar from "./pages/sideBar";
import "./App.css";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}