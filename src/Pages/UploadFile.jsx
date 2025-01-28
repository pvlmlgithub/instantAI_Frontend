import React, { useState } from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [validateMessage, setValidateMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
const { project_id } = useParams();
  let navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Handle file change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
    setStatusMessage("");
  };

  //upload status
  const checkUploadStatus = async (task_id) => {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const uploadStatus = await axios.get(
            `${baseUrl}/projects/tasks/${task_id}/status`
          );
          console.log(uploadStatus.data);
          if (uploadStatus.data.status === "SUCCESS") {
            clearInterval(intervalId);
            resolve();
          } else if (uploadStatus.data.status === "FAILURE") {
            clearInterval(intervalId);
            reject(new Error("Upload task failed"));
          }
        } catch (err) {
          clearInterval(intervalId);
          reject(err);
        }
      }, 1000);
    });
  };
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setStatusMessage("Please select a file to upload.");
      return;
    }
    if (!project_id) {
      setStatusMessage("Project ID not found. Please try again.");
      return;
    }

   
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("project_id", project_id);

      const response = await axios.post(
        `${baseUrl}/projects/${project_id}/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File uploaded successfully", response.data);
      const task_id = response.data.task_id;
      sessionStorage.setItem("task_id", task_id);
      setStatusMessage("File uploaded successfully!");

      try {
        await checkUploadStatus(task_id);
        setStatusMessage("File processed successfully. Validating dataset...");

        const validateResponse = await axios.post(
          `${baseUrl}/projects/${project_id}/dataset/validate`,
          { project_id }
        );
        setStatusMessage("File Validated successfully.");

        setValidateMessage(validateResponse.data.message["Constant Columns"]);
        console.log(
          "Dataset validation response:",
          validateResponse.data.message["Constant Columns"]
        );
        setTimeout(() => {
          navigate(`/projects/${project_id}/select-columns`, { state: { project_id, task_id } });
        }, validateResponse.data.message ? 7000 : 0);
      } catch (error) {
        console.error(
          "Error validating dataset:",
          error.response?.data || error
        );
        setStatusMessage("Error validating dataset. Please try again.");
      }
      
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error);
      setStatusMessage("Error uploading file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="w-6/12  h-3/5 border-2 border-dashed rounded-xl border-black mx-auto my-auto p-6 mt-6 bg-gray-300/20 text-wrap">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center"
        >
          {/* File Upload */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-s text-gray-500 dark:text-gray-400">.CSV</p>
              </div>

              <input
                id="dropzone-file"
                accept=".csv"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          {fileName && (
            <p className="mt-4 text-sm text-gray-600 text-wrap">
              Selected File: {fileName}
            </p>
          )}

          {/* Submit Button */}
          <button
            className={`p-2 ${
              isLoading ? "bg-gray-400" : "bg-indigo-400 px-6"
            } text-white rounded-lg my-6`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload CSV"}
          </button>

          {statusMessage && (
            <p className="text-sm text-gray-700 mt-4">{statusMessage}</p>
          )}
          <br />
        </form>
      </div>

      {validateMessage && (
        <div className="w-6/12  h-3/5 border-2 border-dashed rounded-xl border-black mx-auto my-auto p-6 mt-3 bg-gray-300/20 text-wrap">
          <p className="mt-4 text-wrap text-justify">
           
            <span className="text-green-900 text-base">
              Validation Response: {validateMessage}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
