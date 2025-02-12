import axios from "axios";
import { useState, useEffect } from "react"

export default function SelectableClusterPopup({ setIsOpen1, selectedCluster, setSelectedCluster = 0, kpi }) {
  const [clusters, setClusters] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const clustersPerPage = 9
  const baseUrl = 'http://98.130.44.68';
  let clustorLength = 1

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${baseUrl}/projects/f90e7cde-e6fc-40b9-9f07-4d9ecc2dcede/features/weight`, {
          path: [],
          kpi: kpi
        });
        const task_id2 = response.data.task_id;
        const result = await axios.post(`${baseUrl}/projects/f90e7cde-e6fc-40b9-9f07-4d9ecc2dcede/features/weight/result`, {
          path: [],
          kpi: kpi
        });
        result.data.sort((a, b) => b.Impact_Score - a.Impact_Score);
        result.data = result.data.slice(0, 5);
        setClusters([{ id: 1, parameters: result.data }]);
        clustorLength = result.data.length

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLoadMore = () => {
    if (currentPage * clustersPerPage < clustorLength) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handleSelectCluster = (clusterId) => {
    setSelectedCluster(clusterId)
  }

  const displayedClusters = clusters.slice(0, currentPage * clustersPerPage)

  return (
    <div className="min-h-screen bg-gray-50 p-6 ">
      {/* Popup Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen1(false)} />

        {/* Popup Content */}
        <div className="mb-6 flex items-center justify-between absolute top-0 right-0">
          <button onClick={() => setIsOpen1(false)} className="rounded-full p-2 hover:bg-red-500">
            <svg className="h-6 w-6 bg-red-500 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative max-h-[90vh] w-[90vw] max-w-2xl overflow-y-auto rounded-xl  p-6 ">
          {/* Header */}

          <div className={`grid gap-4 ${displayedClusters.length === 1 ? "grid-cols-1 place-items-center " : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
            {displayedClusters.map((cluster, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded-lg border w-full max-w-[400px] border-gray-200 bg-white p-0 shadow-sm transition-all hover:shadow-md
                    ${selectedCluster === cluster.id ? "ring-2 ring-blue-500 " : ""}`}
                onClick={() => handleSelectCluster(cluster.id)}
              >
                <div className="mb-3 flex items-center justify-between w-full">
                  <h3 className="text-sm font-medium bg-blue-700 text-white rounded-t-lg  w-full text-center py-2">
                    Cluster {cluster.id}
                    {selectedCluster === cluster.id && " - Current selection"}
                  </h3>
                </div>

                {/* Parameters Table */}
                <div className="overflow-hidden px-4">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="py-2 text-left text-xs font-medium text-gray-500">Parameters</th>
                        <th className="py-2 text-right text-xs font-medium text-gray-500">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cluster.parameters?.map((param, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="py-2 text-sm text-gray-600">{param.Feature}</td>
                          <td className="py-2 text-right text-sm text-gray-600">{param.Impact_Score.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {currentPage * clustersPerPage < clustorLength && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="group relative flex items-center justify-center rounded-full bg-white p-3 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100" />
                <svg className="relative z-10 h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          )}

          {/* Pagination Info */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {Math.min(currentPage * clustersPerPage, clustorLength)} of {clustorLength} clusters
          </div>
        </div>
      </div>
    </div>
  )
}

