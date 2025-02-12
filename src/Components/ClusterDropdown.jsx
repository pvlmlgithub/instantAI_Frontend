import React from "react";

const ClusterDropdown = ({ groupedClusters, feature, clusterIndex, handleCellClick }) => {
  return (
    <div>
      <div className="z-10 mx-auto mt-1  bg-white border shadow-lg p-2 ">
        <p className="cursor-pointer hover:underline" onClick={() => handleCellClick(feature, clusterIndex, groupedClusters.top2?.[feature]?.[clusterIndex]?.original?.Value ??
          groupedClusters.mean?.[feature]?.[clusterIndex]?.original?.Mean ??
          0)}>
          <strong>Top 2 Value:</strong>{" "}
          {groupedClusters.top2[feature]?.[clusterIndex]?.original.Value ||
            "N/A"} - {groupedClusters.top2[feature]?.[clusterIndex]?.original.Percentage || "N/A"}
        </p>
        <p className="cursor-pointer hover:underline" onClick={() => handleCellClick(feature, clusterIndex, groupedClusters.top3?.[feature]?.[clusterIndex]?.original?.Value ??
          groupedClusters.mean?.[feature]?.[clusterIndex]?.original?.Mean ??
          0)}>
          <strong>Top 3 Value:</strong>{" "}
          {groupedClusters.top3[feature]?.[clusterIndex]?.original.Value ||
            "N/A"}  - {groupedClusters.top2[feature]?.[clusterIndex]?.original.Percentage || "N/A"}
        </p>
        <p className="cursor-pointer hover:underline" onClick={() => handleCellClick(feature, clusterIndex, groupedClusters.lowest[feature]?.[clusterIndex]?.original.Value ??
          groupedClusters.mean?.[feature]?.[clusterIndex]?.original?.Mean ??
          0)}>
          <strong>Least Value:</strong>{" "}
          {groupedClusters.lowest[feature]?.[clusterIndex]?.original.Value ||
            "N/A"}  - {groupedClusters.top2[feature]?.[clusterIndex]?.original.Percentage || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ClusterDropdown;
