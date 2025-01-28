import React, { useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import SelectColumns from "./SelectColumns"
import { AlertCircle, CheckCircle } from "lucide-react"

const UploadCom = () => {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [validateMessage, setValidateMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const { project_id } = useParams()

  const baseUrl = import.meta.env.VITE_BASE_URL

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      setStatusMessage("")
      setUploadSuccess(false)
    }
  }

  const handleUpload = async (event) => {
    event.preventDefault()

    if (!file) {
      setStatusMessage("Please select a file to upload.")
      return
    }
    if (!project_id) {
      setStatusMessage("Project ID not found. Please try again.")
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("project_id", project_id)

      const response = await axios.post(`${baseUrl}/projects/${project_id}/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("File uploaded successfully", response.data)
      const task_id = response.data.task_id
      sessionStorage.setItem("task_id", task_id)
      setStatusMessage("File uploaded successfully!")
      setUploadSuccess(true)
    } catch (error) {
      console.error("Error uploading file:", error)
      setStatusMessage("Error uploading file. Please try again.")
      setUploadSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidate = async () => {
    if (!project_id) {
      setStatusMessage("Project ID not found. Please try again.")
      return
    }

    try {
      setIsValidating(true)
      setStatusMessage("Validating dataset...")

      const validateResponse = await axios.post(`${baseUrl}/projects/${project_id}/dataset/validate`, { project_id })

      setStatusMessage("File validated successfully.")
      setValidateMessage(validateResponse.data.message["Constant Columns"])
      console.log("Dataset validation response:", validateResponse.data.message["Constant Columns"])
      setIsSettingsOpen(true)
    } catch (error) {
      console.error("Error validating dataset:", error)
      setStatusMessage("Error validating dataset. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  return (
    <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="space-y-4 sm:space-y-8">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-[250px]">
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
              />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto px-4 py-2 text-white rounded-md ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? "Uploading..." : "Upload CSV"}
            </motion.button>
          </div>
          <AnimatePresence>
            {fileName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-gray-600"
              >
                Selected File: {fileName}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center">
            <motion.button
              type="button"
              onClick={handleValidate}
              disabled={!uploadSuccess || isValidating}
              className={`w-full sm:w-auto px-4 py-2 text-white rounded-md ${
                !uploadSuccess || isValidating ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isValidating ? "Validating..." : "Validate"}
            </motion.button>
            {statusMessage && (
              <motion.button
                type="button"
                onClick={toggleSettings}
                className="w-full sm:w-auto px-4 py-2 text-white rounded-md bg-blue-500 hover:bg-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSettingsOpen ? "Close Settings" : "Open Settings"}
              </motion.button>
            )}
          </div>
          <AnimatePresence>
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-sm text-gray-700"
              >
                <div
                  className={`border-l-4 p-4 mb-4 ${
                    uploadSuccess
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-red-100 border-red-500 text-red-700"
                  }`}
                  role="alert"
                >
                  <div className="flex items-center">
                    {uploadSuccess ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-2" />
                    )}
                    <p className="font-bold">{uploadSuccess ? "Success" : "Error"}</p>
                  </div>
                  <p>{statusMessage}</p>
                  {validateMessage && <p className="mt-2">{validateMessage}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-100 rounded-lg p-4"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Dataset Settings</h2>
              <div>
                <p className="mt-2 text-sm text-gray-600">{validateMessage}</p>
                <SelectColumns />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default UploadCom

