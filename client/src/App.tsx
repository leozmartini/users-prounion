import React from "react";
import Header from "./components/Header/Header";
import UserTable from "./components/UserTable/UserTable";
import "./index.css";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <UserTable />
    </>
  );
};

export default App;
