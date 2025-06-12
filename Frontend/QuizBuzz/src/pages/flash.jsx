import { useEffect } from "react";
import "../Styles/flash.css";

const Flash = ({ message, type, show, setShow }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return <div className={`flash-message ${type}`}>{message}</div>;
};

export default Flash;
