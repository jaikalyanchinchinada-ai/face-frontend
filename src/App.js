import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Camera from "./components/Camera";
import Result from "./components/Result";

export default function App() {
  const [page, setPage] = useState("login");
  const [result, setResult] = useState(null);

  function handleResult(data) {
    setResult(data);
  }

  return (
    <>
      {page === "login" && <Login onSwitch={setPage} />}
      {page === "signup" && <Register onSwitch={setPage} />}
      {page === "camera" && (
        <Camera onSwitch={setPage} onResult={handleResult} />
      )}
      {page === "result" && (
        <Result onSwitch={setPage} result={result} />
      )}
    </>
  );
}