import React from "react";
import ReactDOM from "react-dom";
import ToDoList from "./ToDoList.jsx"; // Corrected import path
import "./index.css";

// Register the service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = `${process.env.PUBLIC_URL}/serviceworker.js`;

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log(
          "Service Worker registered with scope: ",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("Service Worker registration failed: ", error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ToDoList /> {/* Render the ToDoList component */}
  </React.StrictMode>
);
