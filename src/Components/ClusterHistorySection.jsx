import React from "react"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { setSelectedIndex } from "../redux/clusterSlice"

const ClusterHistorySection = ({ selectedCell, currentLevel, handleHistoryClick }) => {
  const dispatch = useDispatch()
  const { clusterHistory, selectedIndex } = useSelector((state) => state.cluster)

  console.log("clusterHistory", clusterHistory, selectedIndex)

  const handleClick = (item, index) => {
    handleHistoryClick(item, index)
  }

  return (
    <div className="w-full h-full bg-gray-100 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Segment History</h3>

        {selectedCell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-indigo-50 rounded-lg shadow-sm"
          >
            <h4 className="font-medium text-indigo-800 mb-2">Current Selection:</h4>
            <p className="text-sm text-gray-700">Segment: {selectedCell.clusterIndex + 1}</p>
            <p className="text-sm text-gray-700">Parameter: {selectedCell.feature}</p>
            <p className="text-sm text-gray-700">Level: {currentLevel}</p>
          </motion.div>
        )}

        <div className="space-y-2">
          {clusterHistory.map((item, index) => (
            <motion.div
              key={index}
              onClick={() => handleClick(item, index)}
              className={`p-3 rounded-lg cursor-pointer transition-colors shadow-sm ${
                index === selectedIndex ? "bg-indigo-100 border-l-4 border-indigo-500" : "bg-white hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <ChevronRight
                  className={`w-4 h-4 flex-shrink-0 ${
                    item.level === currentLevel ? "text-indigo-700" : "text-indigo-500"
                  }`}
                />
                <div>
                  <p className={`font-medium ${item.level === currentLevel ? "text-indigo-800" : "text-gray-800"}`}>
                    Segment {item.cluster}
                  </p>
                  <p className={`text-sm ${item.level === currentLevel ? "text-indigo-600" : "text-gray-600"}`}>
                    Parameter: {item.feature}
                  </p>
                  <p className={`text-sm ${item.level === currentLevel ? "text-indigo-600" : "text-gray-600"}`}>
                    Level: {item.level}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClusterHistorySection

