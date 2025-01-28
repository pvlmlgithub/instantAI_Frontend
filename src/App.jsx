import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import UploadFile from "./Pages/UploadFile";
import SelectColumns from "./Pages/SelectColumns";
import SelectKPI from "./Pages/SelectKPI";
import ClusteringComponent from "./Pages/ClusteringComponent";
import Home from "./Pages/Home";
import NoPage from "./Pages/NoPage";
import Projection from "./Pages/Projection";
import Workbench from "./Pages/Workbench";
import { Outlet } from "react-router-dom";
import AppBar from "./Components/AppBar";
import Configuration from "./Pages/Configuration";
import AnalysisDashboard from "./Pages/AnalysisDashboard";
import AnalysisDashboard1 from "./Pages/AnalysisDashboard1";

function Layout() {
  return (
    <>
      <AppBar />
      <div className="bg-gray-100 min-h-[calc(100vh-64px)] h-[calc(100vh-64px)] overflow-hidden overflow-y-auto">
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/analysis-1" element={<AnalysisDashboard />} />
            <Route path="/projects/:project_id">
              <Route path="upload" element={<UploadFile />} />
              <Route path="configuration" element={<Configuration />} />
              <Route path="analysis" element={<AnalysisDashboard />} />
              <Route path="select-columns" element={<SelectColumns />} />
              <Route path="select-kpi" element={<SelectKPI />} />
              <Route path="clustered-data" element={<ClusteringComponent />} />
              <Route path="workbench" element={<Workbench />} />
              <Route path="projection" element={<Projection />} />
            </Route>
          </Route>
          <Route path="*" element={<NoPage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
