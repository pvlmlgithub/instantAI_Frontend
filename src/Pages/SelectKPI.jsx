import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { featureRanking } from "../utils/apiUtils";
import Loader from "../Components/Loader";

const SelectKPI = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { project_id } = useParams();
  const { importantColumnNames, kpiList } = location.state;
  const [activeKPI, setActiveKPI] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(kpiList);
  console.log(importantColumnNames);

  const handleKpiClick = (kpi) => {
    setActiveKPI(kpi);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const task_id = await featureRanking(
        project_id,
        activeKPI,
        importantColumnNames,
        kpiList,

      );
      navigate(`/projects/${project_id}/clustered-data`, {
        state: {
          task_id,
          activeKPI,
          kpiList,
          importantColumnNames,
        },
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 bg-gray-100 border-r border-gray-200 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Segment History</h2>
        <p className=" text-gray-600 flex items-center w-full">No history</p>
      </div>
      <div className="w-[calc(100%-16rem)] p-4  ">
        <div className="">
          <div>
            <h1 className="text-xl font-semibold text-gray-700 pb-4">
              Select the target KPI for analysis
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {kpiList.map((kpi, index) => (
              <button
                key={index}
                onClick={() => handleKpiClick(kpi)}
                className={`px-4 py-2 text-sm font-medium rounded-md min-w-[100px] ${activeKPI === kpi ? "text-white bg-purple-400" : "text-gray-600 bg-white hover:bg-gray-50"
                  }`}
              >
                {kpi}
              </button>
            ))}
          </div>
          <div>
            <button
              className="bg-black rounded-md px-8 text-white p-2 dark:hover:bg-gray-800"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectKPI;
