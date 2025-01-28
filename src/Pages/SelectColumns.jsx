import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Loader from "../Components/Loader";


const CustomOption = (props) => {
  const { data, innerRef, innerProps, isSelected } = props;

  const handleCheckboxChange = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    if (isSelected) {
      props.deselectOption(data); // Unselect the option
    } else {
      props.selectOption(data); // Select the option
    }
  };

  return (
    <div ref={innerRef} {...innerProps} className="flex items-center gap-2 px-3 cursor-pointer">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
        className="h-4 w-4"
        onClick={(e) => e.stopPropagation()} 
      />
      <span>{data.label}</span>
    </div>
  );
};

const SelectColumns = () => {
  const location = useLocation();
  const { project_id } = useParams();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [droppedColumns, setDroppedColumns] = useState([]);
  const [selectedKpi, setSelectedKpi] = useState([]);
  const [selectedImportant, setSelectedImportant] = useState([]);
  const [errors, setErrors] = useState({});
  const [clicked, setClicked] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  let navigate = useNavigate();

  // Fetch columns from API
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
      sessionStorage.setItem("columns", JSON.stringify(response.data.columns));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching columns:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColumns();
  }, [baseUrl, project_id]);

  // Map columns to options
  const options = columns.map((col, id) => ({
    value: col,
    label: col,
  }));

  // Drop cols
  const handleDrop = async (e) => {
    e.preventDefault();
    setClicked(true);
    const newErrors = {};
    if (droppedColumns.length >= 0) {
      try {
        // Extract column names from dropped columns
        const droppedColumnNames = droppedColumns.map((col) => col.value);
        console.log(droppedColumnNames);
        const response = await axios.post(
          `${baseUrl}/projects/${project_id}/dataset/columns/drop`,
          {
            project_id,
            column: droppedColumnNames,
          }
        );
        fetchColumns();
        console.log("Response:", response.data);
        sessionStorage.setItem(
          "droppedColumns",
          JSON.stringify(droppedColumnNames)
        );
      } catch (error) {
        console.error("Error submitting data:", error.response?.data?.message);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract column names from dropped columns
    const importantColumnNames = selectedImportant.map((col) => col.value);
    const kpiList = selectedKpi.map((kpi) => kpi.value);
    console.log(kpiList);
    console.log(importantColumnNames);
    sessionStorage.setItem("importantColumnNames", importantColumnNames);
    navigate(`/projects/${project_id}/select-kpi`, {
      state: { project_id, importantColumnNames, kpiList },
    });
  };

  const handleDroppedColumnsChange = (selected) => {
    // Ensure no duplicates
    const uniqueSelected = selected.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.value === item.value)
    );
    setDroppedColumns(uniqueSelected);
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div
        className="w-6/12 md:w-3/5 h-3/5 border-2 rounded-xl border-black/40 shadow-black/60
              shadow-sm mx-auto my-auto p-6 mt-10 text-wrap"
      >
        <div
          className="flex flex-col items-center p-4 w-full h-fit border-2 border-gray-300 
              rounded-lg cursor-pointer bg-gray-300/30  dark:border-gray-600/30 dark:hover:border-gray-500/30"
        >
          <h1 className="text-xl font-semibold text-center text-gray-700 ">Settings</h1>
          <div className="flex flex-row flex-wrap justify-center items-center gap-3 mt-3">
            <div className="w-full flex md:flex-row flex-col justify-center items-center gap-3">
              {/* Select Columns to Drop */}
              <div className="w-full">
                <Select
                  value={droppedColumns}
                  onChange={handleDroppedColumnsChange}
                  options={options}
                  closeMenuOnSelect={false}
                  isMulti={true}
                  placeholder="Select Columns to Drop"
                  components={{ Option: CustomOption }}
                />
                {errors.droppedColumns && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.droppedColumns}
                  </p>
                )}
              </div>
              <div>
                <button
                  className={`px-6 p-2 ${
                    clicked ? "bg-gray-400" : "bg-indigo-400 "
                  } text-white rounded-lg flex flex-row justify-center items-center gap-2 `}
                  onClick={handleDrop}
                >
                  Drop <Trash2 />
                </button>
              </div>
            </div>
            {/* Select KPI Columns */}
            <div className="w-full">
              <Select
                value={selectedKpi}
                onChange={setSelectedKpi}
                options={options}
                closeMenuOnSelect={false}
                isMulti={true}
                placeholder="Select KPI Columns List"
                components={{ Option: CustomOption }}
              />
              {errors.selectedKpi && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.selectedKpi}
                </p>
              )}
            </div>
            {/* Select Important Columns */}
            <div className="w-full">
              <Select
                value={selectedImportant}
                onChange={setSelectedImportant}
                options={options}
                isMulti={true}
                closeMenuOnSelect={false}
                placeholder="Select Important Columns"
                components={{ Option: CustomOption }}
              />
              {errors.selectedImportant && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.selectedImportant}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="p-2 bg-indigo-400 text-white font-semibold  rounded-md px-6 my-5"
            type="button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectColumns;
