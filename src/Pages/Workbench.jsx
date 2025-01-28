import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Loader from "../Components/Loader";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const Workbench = () => {
  const location = useLocation();
  const { project_id } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const {
    currentLevel,
    currentPath,
    activeKPI,
    encodedCols,
    categorical_columns,
  } = location.state;
  const [user_added_vars_list, setUser_added_vars_list] = useState([]);
  const [noOfMonths, setNoOfMonths] = useState("");
  const [columns, setColumns] = useState([]);
  const [date_column, setDate_column] = useState("");
  const [incFactor, setIncFactor] = useState("");
  const [zeroRep, setZeroRep] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const validateForm = () => {
    const newErrors = {};

    if (!noOfMonths || noOfMonths <= 0) {
      newErrors.noOfMonths =
        "Please enter a valid number of months greater than 0";
    }

    if (!incFactor && incFactor !== 0) {
      newErrors.incFactor = "Please enter an increase factor";
    }

    if (!zeroRep && zeroRep !== 0) {
      newErrors.zeroRep = "Please enter a zero replacement value";
    }

    if (!date_column) {
      newErrors.date_column = "Please select a date column";
    }

    if (user_added_vars_list.length === 0) {
      newErrors.variables = "Please select at least one variable";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchColumns = async () => {
    if (!project_id) {
      console.error("No project_id found");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${baseUrl}/projects/${project_id}/dataset/columns`,
        { project_id }
      );
      setColumns(response.data.columns);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching columns:", error);
      setLoading(false);
    }
  };

  const options = columns.map((col) => ({
    value: col,
    label: col,
  }));

  const handleChecks = (e) => {
    const { checked, value } = e.target;
    setUser_added_vars_list((prev) =>
      checked ? [...prev, value] : prev.filter((col) => col !== value)
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    console.log("Form validation passed, submitting...");
  
    try {
      const analysis = await axios.post(
        `${baseUrl}/projects/${project_id}/time-series/analysis`,
        {
          project_id,
          level: currentLevel,
          path: currentPath,
          user_added_vars_list,
          kpi: activeKPI,
          no_of_months: noOfMonths,
          date_column: date_column.value,
          increase_factor: incFactor,
          zero_value_replacement: zeroRep,
        }
      );
  
      const { task_id } = analysis.data;
      let intervalId;
  
      const checkStatus = async () => {
        try {
          if (task_id) {
            
            const analysisStatus = await axios.get(
              `${baseUrl}/projects/tasks/${task_id}/status`
            );
            console.log("Analysis Status:", analysisStatus.data);
  
            if (analysisStatus.data.status === "SUCCESS") {
              clearInterval(intervalId);
              console.log("Analysis completed successfully");
            }
          }
        } catch (err) {
          console.error("Error checking status:", err);
        }
      };
  
      if (task_id) {
        intervalId = setInterval(checkStatus, 1000);
      } else {
        checkStatus();
      }
  
      // Fetch time series figure
      const timeSeriesFigure = await axios.post(
        `${baseUrl}/projects/${project_id}/time-series/figure`,
        {
          project_id,
          level: currentLevel,
          path: currentPath,
          kpi: activeKPI,
        }
      );
      console.log("Time series figure:", timeSeriesFigure.data);
  
      console.log("Navigating with state:", {
        currentLevel,
        currentPath,
        activeKPI,
        analysis,
        timeSeriesFigure: timeSeriesFigure.data,
      });
  
      // Ensure all required data is available before navigating
      if (currentLevel && currentPath && activeKPI && analysis && timeSeriesFigure) {
        
        navigate(`/projects/${project_id}/projection`, {
          state: {
            currentLevel,
            currentPath,
            activeKPI,
            analysis: analysis.data,
            timeSeriesFigure: timeSeriesFigure.data, 
          },
        });
      } else {
        console.error("Missing data, cannot navigate.");
      }
    } catch (error) {
      console.error("Error submitting data:", error); 
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };
  
  useEffect(() => {
    fetchColumns();
  }, [baseUrl, project_id]);


  
  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-5/6 mx-auto p-4 pt-6">
        <h1 className="text-2xl font-semibold text-center text-gray-700 ">
          Workbench
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="px-8 shadow-md space-y-6 my-8 py-8 mx-8 bg-white rounded-lg"
        >
          {errors.submit && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {errors.submit}
            </div>
          )}
          <div className="form-group">
            <label
              htmlFor="noOfMonths"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Months
            </label>
            <input
              id="noOfMonths"
              type="number"
              name="noOfMonths"
              required
              value={noOfMonths}
              onChange={(e) => setNoOfMonths(Number(e.target.value))}
              placeholder="Enter Number of Months"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.noOfMonths ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.noOfMonths && (
              <p className="text-red-500 text-sm mt-1">{errors.noOfMonths}</p>
            )}
          </div>

          <div className="form-group">
            <label
              htmlFor="incFactor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Increase Factor
            </label>
            <input
              id="incFactor"
              type="number"
              name="incFactor"
              required
              value={incFactor}
              onChange={(e) => setIncFactor(Number(e.target.value))}
              placeholder="Enter Increase Factor"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.incFactor ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.incFactor && (
              <p className="text-red-500 text-sm mt-1">{errors.incFactor}</p>
            )}
          </div>

          <div className="form-group">
            <label
              htmlFor="zeroRep"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Zero Value Replacement
            </label>
            <input
              id="zeroRep"
              type="number"
              name="zeroRep"
              value={zeroRep}
              required
              onChange={(e) => setZeroRep(Number(e.target.value))}
              placeholder="Enter Zero Value Replacement"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.zeroRep ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.zeroRep && (
              <p className="text-red-500 text-sm mt-1">{errors.zeroRep}</p>
            )}
          </div>

          <div className="form-group">
            <label
              htmlFor="Date Column"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date Column
            </label>

            <Select
              value={date_column}
              onChange={setDate_column}
              options={options}
              isMulti={false}
              required
              placeholder="Select Date Column"
              name="Date column"
              className="rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.date_column && (
              <p className="text-red-500 text-sm mt-1">{errors.date_column}</p>
            )}
          </div>

          <div>
            <div className="space-y-4">
              {Object.entries(encodedCols).map(([category, values]) => (
                <fieldset
                  key={category}
                  className="border border-gray-400 rounded p-4 bg-white"
                >
                  <legend className="font-medium text-gray-700 mb-2 mx-2 px-2 ">
                    {category}
                  </legend>
                  <div className="space-y-2 flex flex-row flex-wrap gap-3 items-center ">
                    {values.map((value, index) => (
                      <div
                        key={`${category}-${index}`}
                        className="flex flex-nowrap items-center justify-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={`${category}-${value}`}
                          name={value}
                          value={value}
                          onChange={handleChecks}
                          checked={user_added_vars_list.includes(value)}
                          className=" text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`${category}-${value}`}
                          className="font-normal mr-2"
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-500 px-10 py-2 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Workbench;
