import { useSelector } from "react-redux";
import React, { useState } from "react";
import axios from 'axios';
import { useLocation, useParams } from "react-router-dom";

const Workbench = () => {
  const { clusterHistory, selectedIndex } = useSelector((state) => state.cluster);
  const currentLevel = clusterHistory[selectedIndex]?.level;
  const location = useLocation()
  const { activeKPI, kpiList, task_id, importantColumnNames } = location.state
  const { project_id } = useParams()
  const [adjustments, setAdjustments] = useState({})
  const [noOfMonths, setNoOfMonths] = useState(6)
  const [dateColumn, setDateColumn] = useState("")
  const columns = JSON.parse(sessionStorage.getItem("columns"));
  console.log(clusterHistory)


  const handleActionClick = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8009/projects/${project_id}/time-series/analysis`, {
        path: [0, 1],
        kpi: activeKPI,
        no_of_months: noOfMonths,
        date_column: dateColumn,
        adjustments: adjustments
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error making the request', error);
    }
  };
  const [checkedState, setCheckedState] = React.useState(
    new Array(clusterHistory.length).fill(false)
  );

  const handleCheckboxChange = (index) => {
    const updatedCheckedState = checkedState.map((item, idx) =>
      idx === index ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const handleInputChange = (index, value) => {
    const feature = clusterHistory[index].feature;
    setAdjustments((prevAdjustments) => ({
      ...prevAdjustments,
      [feature]: value,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Work bench</h1>
      <div className="overflow-x-auto">
        <div className="flex items-center space-x-1">
          {clusterHistory.map((cluster, index) => (
            <React.Fragment key={index}>
              <div className="flex-shrink-0 w-64 rounded-lg shadow-md">
                <div className="relative  rounded-lg overflow-hidden bg-cover bg-center mb-4" style={{ backgroundImage: `url('https://www.elegantthemes.com/blog/wp-content/uploads/2013/09/bg-10-full.jpg')` }}></div>
                <div className=" p-4 bg-gradient-to-t from-black/50 to-transparent ">
                  <p className="text-white font-bold text-lg truuncate">Level {(cluster.level || 0) + 1}</p>
                  <p className="text-white truuncate text-nowrap ">Value:{typeof cluster.value === "number" ? cluster.value.toFixed(4) : cluster.value}</p>
                  <p className="text-white truuncate text-nowrap">Parameter:{cluster.feature || "Parameter"}</p>
                  <p className="text-white truuncate text-nowrap">Segment: {cluster.cluster}</p>
                </div>
              </div>
              {index < clusterHistory.length - 1 && (
                <div className="flex-shrink-0 w- text-center">
                  <span className="text-gray-700 text-2xl">{">"}</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Definition</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider"></th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider">Parameter</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider">Current Value</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider">Modify To</th>
            </tr>
          </thead>
          <tbody>
            {clusterHistory.map((cluster, index) => (
              <React.Fragment key={index}>
                <tr className="bg-white border-b border-gray-200">
                  <td className="py-2 px-4 border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={checkedState[index]}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td className="py-2 px-4 border-r border-gray-200">{cluster.feature || "Parameter"}</td>
                  <td className="py-2 px-4 border-r border-gray-200">{typeof cluster.value === "number" ? cluster.value.toFixed(4) : cluster.value}</td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`border rounded px-2 py-1 ${!checkedState[index] ? "bg-gray-200" : ""}`}
                      disabled={!checkedState[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4">
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Number of Months</label>
            <input
              type="number"
              min="1"
              step="1"
              onChange={(e) => setNoOfMonths(e.target.value)}
              className="mt-1 block h-8 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Date Column</label>
            <select
              onChange={(e) => setDateColumn(e.target.value)}
              className="mt-1 block h-8 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {columns.map((kpi, index) => (
                <option key={index} value={kpi}>
                  {kpi}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 w-full flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => handleActionClick()}>
            Action it
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workbench;