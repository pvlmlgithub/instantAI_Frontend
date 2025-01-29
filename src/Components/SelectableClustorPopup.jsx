import { useState, useEffect } from "react"

export default function SelectableClusterPopup({ setIsOpen1, selectedCluster, setSelectedCluster, clustorLength }) {
  const [clusters, setClusters] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const clustersPerPage = 9

  useEffect(() => {
    // Initialize clusters based on clustorLength
    setClusters(
      Array.from({ length: clustorLength }, (_, i) => ({
        id: i + 1,
        parameters: [
          { name: "Parameter 1", weight: "2.4" },
          { name: "Parameter 2", weight: "0.9" },
          { name: "Parameter 3", weight: "7.8" },
        ],
      })),
    )
  }, [clustorLength])

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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Popup Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen1(false)} />

        {/* Popup Content */}
        <div className="relative max-h-[90vh] w-[90vw] max-w-7xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">AI Clusters</h2>
            <button onClick={() => setIsOpen1(false)} className="rounded-full p-2 hover:bg-gray-100">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Clusters Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedClusters.map((cluster) => (
              <div
                key={cluster.id}
                className={`cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md
                    ${selectedCluster === cluster.id ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                onClick={() => handleSelectCluster(cluster.id)}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    Cluster {cluster.id}
                    {selectedCluster === cluster.id && " - Current selection"}
                  </h3>
                </div>

                {/* Parameters Table */}
                <div className="overflow-hidden">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="py-2 text-left text-xs font-medium text-gray-500">Parameters</th>
                        <th className="py-2 text-right text-xs font-medium text-gray-500">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cluster.parameters.map((param, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="py-2 text-sm text-gray-600">{param.name}</td>
                          <td className="py-2 text-right text-sm text-gray-600">{param.weight}</td>
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

