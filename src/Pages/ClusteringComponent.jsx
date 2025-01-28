import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import _ from "lodash"
import Loader from "../Components/Loader"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowBigDownDash, Command } from "lucide-react"
import ClusterHistorySection from "../Components/ClusterHistorySection"
import ClusterDropdown from "../Components/ClusterDropdown"
import WorkbenchModal from "../Components/WorkbenchModal"
import { featureRanking } from "../utils/apiUtils"
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux"
import { setClusterHistory, setSelectedIndex } from "../redux/clusterSlice"

const ClusteringComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const baseUrl = import.meta.env.VITE_BASE_URL
  const { project_id } = useParams()
  const { activeKPI, kpiList, task_id, importantColumnNames } = location.state
  const [newkpi, setNewkpi] = useState(activeKPI)
  const [allClusters, setAllClusters] = useState([])
  const [extractedClusters, setExtractedClusters] = useState([])
  const [currentPath, setCurrentPath] = useState([])
  const [error, setError] = useState(null)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedCell, setSelectedCell] = useState(null)
  const [categoricalColumns, setCategoricalColumns] = useState([])
  const MAX_LEVEL = 4
  const [showModal, setShowModal] = useState(false)
  const [actionIt, setActionIt] = useState(false)
  const workbenchRef = useRef(null);
  const dispatch = useDispatch()
  const { clusterHistory, selectedIndex } = useSelector((state) => state.cluster)


  const toggleDropdown = (e, feature, clusterIndex) => {
    e.stopPropagation()
    setOpenDropdowns((prev) => ({
      ...prev,
      [`${feature}-${clusterIndex}`]: !prev[`${feature}-${clusterIndex}`],
    }))
  }

  const handleDownload = async (clusterIndex) => {
    try {
      const response = await axios.post(
        `${baseUrl}/projects/${project_id}/clusters/download`,
        {
          project_id,
          level: currentLevel,
          path: currentPath,
          cluster_index: clusterIndex,
        },
        {
          responseType: "blob",
        },
      )
      const blob = new Blob([response.data], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `cluster_${clusterIndex + 1}_level_${currentLevel}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading cluster:", err)
      setError("Failed to download cluster data")
    }
  }

  const fetchClusters = async (level, path, kpi) => {
    try {
      setLoading(true)
      setError(null)
      if (!baseUrl || !project_id) {
        throw new Error("Missing base URL or project ID")
      }
      const subclusterResponse = await axios.post(`${baseUrl}/projects/${project_id}/clusters/subcluster`, {
        project_id,
        kpi: kpi || activeKPI,
        level,
        path,
      })
      const task_id2 = subclusterResponse.data.task_id

      const checkSubclusterStatus = () => {
        return new Promise((resolve, reject) => {
          const intervalId = setInterval(async () => {
            try {
              const subclusterStatus = await axios.get(`${baseUrl}/projects/tasks/${task_id2}/status`)
              if (subclusterStatus.data.status === "SUCCESS") {
                clearInterval(intervalId)
                resolve()
              } else if (subclusterStatus.data.status === "FAILURE") {
                reject(new Error("Subcluster task failed"))
                clearInterval(intervalId)
                throw new Error("Processing subcluster failed")
              }
            } catch (err) {
              clearInterval(intervalId)
              reject(err)
            }
          }, 1000)
        })
      }
      await checkSubclusterStatus()

      const summaryResponse = await axios.post(`${baseUrl}/projects/${project_id}/clusters/summarize`, {
        project_id,
        level,
        path,
      })

      const clusters = summaryResponse.data
        .map((cluster) => {
          const [key] = Object.keys(cluster)
          const index = Number.parseInt(key.split("_")[1], 10)
          return { index, value: cluster[key] }
        })
        .sort((a, b) => a.index - b.index)
        .map((cluster) => cluster.value)

      setExtractedClusters(clusters)

      const processedClusters = clusters.flatMap((clusterArray, clusterIndex) =>
        clusterArray.map((clusterData) => ({
          id: clusterIndex,
          level,
          path,
          original: clusterData,
        })),
      )
      setAllClusters((prev) => [...prev, ...processedClusters])
      setLoading(false)
    } catch (err) {
      console.error("Error Details:", err)
      setError(err.response?.data?.message || err.message || "Failed to fetch clusters")
      setLoading(false)
    }
  }

  const filterImportantFeatures = (features) => {
    return features.filter((feature) => importantColumnNames.includes(feature))
  }

  const groupClustersByStatistic = (statistic) => {
    return _.groupBy(
      allClusters.filter((cluster) => cluster.original.Statistic === statistic),
      "original.Feature",
    )
  }

  const groupedClusters = {
    top1: groupClustersByStatistic("Top 1 Value"),
    top2: groupClustersByStatistic("Top 2 Value"),
    top3: groupClustersByStatistic("Top 3 Value"),
    lowest: groupClustersByStatistic("Lowest Value"),
    mean: groupClustersByStatistic("Mean"),
    percentage: groupClustersByStatistic("Percentage"),
  }

  const handleKpiClick = async (kpi) => {
    location.state.activeKPI = kpi;
    setAllClusters([]);
    setCurrentLevel(0);
    setCurrentPath([]);
    setNewkpi(kpi); // Update the newkpi state
    setSelectedCell(null);

    // Update the active KPI in the local state

    const task_id = await featureRanking(project_id, kpi, importantColumnNames, kpiList);
    await fetchClusters(currentLevel, currentPath, kpi);
  };


  const handleCellClick = (feature, clusterIndex) => {
    setSelectedCell({ feature, clusterIndex, currentLevel })
    setOpenDropdowns({})
  }

  const handleAnalyze = () => {
    if (selectedCell && currentLevel < MAX_LEVEL) {
      const newPath = [...currentPath, selectedCell.clusterIndex]
      const newHistoryItem = {
        cluster: selectedCell.clusterIndex + 1,
        feature: selectedCell.feature,
        level: currentLevel,
        extractedClusters: extractedClusters,
        path: currentPath,
      }
      const newClusterHistory = [...clusterHistory, newHistoryItem]
      console.log("newclustor", newClusterHistory)
      dispatch(setClusterHistory(newClusterHistory))
      dispatch(setSelectedIndex(newClusterHistory.length - 1))
      setCurrentPath(newPath)
      setCurrentLevel(currentLevel + 1)
      setAllClusters([])
      fetchClusters(currentLevel + 1, newPath)
      setSelectedCell(null)
    }
  }

  const handleHistoryClick = (historyItem, index) => {
    setCurrentLevel(historyItem.level)
    setCurrentPath(historyItem.path)
    setAllClusters([])
    dispatch(setSelectedIndex(index))
    setExtractedClusters(historyItem.extractedClusters)
    fetchClusters(historyItem.level, historyItem.path)
  }

  const handleWorkbench = async () => {
    setShowModal(true)
    try {
      const categCols = await axios.post(`${baseUrl}/projects/${project_id}/time-series/categorical-columns`, {
        project_id,
        level: currentLevel,
        path: currentPath,
      })
      setCategoricalColumns(categCols.data.categorical_columns)
    } catch (error) {
      console.error("Error fetching categorical columns:", error)
    }
  }

  useEffect(() => {
    if (baseUrl && project_id) {
      let intervalId

      const checkStatus = async () => {
        try {
          if (task_id) {
            const rankingStatus = await axios.get(`${baseUrl}/projects/tasks/${task_id}/status`)
            if (rankingStatus.data.status === "SUCCESS") {
              clearInterval(intervalId)
              fetchClusters(currentLevel, currentPath)
            }
          } else {
            fetchClusters(currentLevel, currentPath)
          }
        } catch (err) {
          console.error("Error checking status:", err)
        }
      }

      if (task_id && loading) {
        intervalId = setInterval(checkStatus, 1000)
      }

      return () => {
        if (intervalId) {
          clearInterval(intervalId)
        }
      }
    }
  }, [baseUrl, project_id])

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden overflow-y-auto ">
      <div className="w-64 bg-gray-100 border-r border-gray-200 overflow-y-auto">
        <ClusterHistorySection
          selectedCell={selectedCell}
          currentLevel={currentLevel}
          selectedIndex={selectedIndex}
          clusterHistory={clusterHistory}
          handleHistoryClick={handleHistoryClick}
        />
      </div>
      <div className="w-[calc(100%-16rem)] overflow-hidden overflow-y-auto p-6">
        <h1 className="text-xl font-semibold text-gray-700 pb-4">Select the target KPI for analysis</h1>
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
        <div className="flex  flex-row justify-start items-start gap-0 w-min mx-auto ">
          <div className="flex flex-col justify-start mx-auto items-start p-1  w-fit ">
            <div className="w-full overflow-x-auto">
              <div className="w-[calc(100vw-18rem)] overflow-x-auto border-b border-gray-200 shadow sm:rounded-lg">
                {loading && <Loader />}
                {error && <p className="text-red-500 p-4">Error: {error}</p>}
                {!loading && !error && extractedClusters.length > 0 && (
                  <table className="w-[calc(100vw-20rem)] divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10"
                        >
                          Segments/Parameters
                        </th>
                        {extractedClusters.map((_, index) => (
                          <th
                            key={index}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            <div className="flex items-center justify-start min-w-[120px] max-w-[120px]">
                              <span>Segment {index + 1}</span>
                              <button
                                className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleDownload(index)
                                }}
                              >
                                <ArrowBigDownDash className="w-4 h-4" />
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filterImportantFeatures(Object.keys(groupedClusters.top1)).map((feature) => (
                        <tr key={feature} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                            {feature}
                          </td>
                          {extractedClusters.map((_, clusterIndex) => (
                            <td
                              key={clusterIndex}
                              className={`px-6 py-4 whitespace-nowrap text-sm ${selectedCell?.feature === feature && selectedCell?.clusterIndex === clusterIndex
                                ? "bg-indigo-100"
                                : ""
                                }`}
                              onClick={() => handleCellClick(feature, clusterIndex)}
                            >
                              <div
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleDropdown(e, feature, clusterIndex)
                                }}
                                className="cursor-pointer hover:bg-indigo-50 p-2 rounded transition-colors"
                              >
                                {groupedClusters.top1?.[feature]?.[clusterIndex]?.original?.Value ??
                                  groupedClusters.mean?.[feature]?.[clusterIndex]?.original?.Mean ??
                                  0}
                                <span className="ml-2 text-sm text-gray-500">
                                  ({groupedClusters.top1[feature][clusterIndex]?.original.Count || 0}) ▼
                                </span>
                              </div>
                              {openDropdowns[`${feature}-${clusterIndex}`] && (
                                <ClusterDropdown
                                  groupedClusters={groupedClusters}
                                  feature={feature}
                                  toggleDropdown={toggleDropdown}
                                  clusterIndex={clusterIndex}
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="flex flex-wrap justify-start items-center gap-4 mt-4">
              <button
                onClick={handleAnalyze}
                disabled={!selectedCell || currentLevel >= MAX_LEVEL}
                className={`p-2 rounded-lg border px-4 flex items-center gap-2 transition-colors ${!selectedCell || currentLevel >= MAX_LEVEL
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
              >
                Analyze <Command className="w-4 h-4" />
              </button>
              {/* <button
                onClick={handleWorkbench}
                className="p-2 rounded-lg font-semibold border px-4 bg-white text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Workbench
              </button> */}
              <button
                onClick={() => {
                  setActionIt(!actionIt)
                  if (workbenchRef.current) {
                    workbenchRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="p-2 rounded-lg font-semibold border px-4 bg-white text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Workbench
              </button>
            </div>
          </div>
        </div>
        {actionIt && (<motion.div
          ref={workbenchRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: actionIt ? 1 : 0, y: actionIt ? 0 : 20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="p-4 my-4 bg-white rounded-md ring-[1px] ring-gray-200"
        >
          {/* Define Action Section */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">Define action</h3>
            <textarea
              className="w-full h-32 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your action here..."
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-end mb-6">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-md">
              Action it
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Bottom Navigation */}
          <div className="flex gap-4">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Under the hood
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </motion.div>
        )}
      </div>
      {showModal && (
        <WorkbenchModal
          categorical_columns={categoricalColumns}
          currentLevel={currentLevel}
          currentPath={currentPath}
          activeKPI={newkpi}
          showModal={showModal}
          setShowModal={setShowModal}
          project_id={project_id}
        />
      )}
    </div>
  )
}

export default ClusteringComponent

