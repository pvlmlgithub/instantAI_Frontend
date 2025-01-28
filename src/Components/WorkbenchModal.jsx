import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WorkbenchModal = ({
  categorical_columns,
  currentLevel,
  currentPath,
  activeKPI,
  showModal,
  setShowModal,
  project_id,
}) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [selectedColumns, setSelectedColumns] = useState([]);

  const handleChecks = (e) => {
    const { checked, value } = e.target;
    setSelectedColumns((prev) =>
      checked ? [...prev, value] : prev.filter((col) => col !== value)
    );
  };

  const handleSubmit = async () => {
    setShowModal(false);
    try {
      const encodingPromises = selectedColumns.map((column) =>
        axios.post(
          `${baseUrl}/projects/${project_id}/time-series/encoded-columns`,
          {
            project_id,
            column_name: column,
            level: currentLevel,
            path: currentPath,
          }
        )
      );
      const responses = await Promise.all(encodingPromises);
      const newEncodedCols = {};

      responses.forEach((response, index) => {
        const column = selectedColumns[index];
        newEncodedCols[column] = response.data.categorical_column;
      });
      console.log(newEncodedCols);
      navigate(`/projects/${project_id}/workbench`, {
        state: {
          currentLevel,
          currentPath,
          activeKPI,
          encodedCols: newEncodedCols,
          categorical_columns,
        },
      });
    } catch (error) {
      console.error("Error submitting data:", error.response?.data?.message);
    }
  };

  return (
    <div className="">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="font-semibold text-lg text-gray-500">
            Select Categorical Columns:
          </h2>
          <div className="max-h-[40vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-indigo-400 [&::-webkit-scrollbar-thumb]:rounded-lg hover:[&::-webkit-scrollbar-thumb]:bg-indigo-400 ">
          <div className="space-y-3">
          {categorical_columns.map((column, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id={column}
                name={column}
                value={column}
                onChange={handleChecks}
              />
              <label htmlFor={column}>{column}</label>
            </div>
          ))}
          </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkbenchModal;
