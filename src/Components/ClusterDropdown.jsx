import React from "react";

const ClusterDropdown = ({ groupedClusters, feature, clusterIndex }) => {
  return (
    <div>
      <div className="z-10 mx-auto mt-1  bg-white border shadow-lg p-2 ">
        <p>
          <strong>Top 2 Value:</strong>{" "}
          {groupedClusters.top2[feature]?.[clusterIndex]?.original.Value ||
            "N/A"}
        </p>
        <p>
          <strong>Top 3 Value:</strong>{" "}
          {groupedClusters.top3[feature]?.[clusterIndex]?.original.Value ||
            "N/A"}
        </p>
        <p>
          <strong>Least Value:</strong>{" "}
          {groupedClusters.lowest[feature]?.[clusterIndex]?.original.Value ||
            "N/A"}
        </p>
        <p>
          <strong>Mean Value:</strong>{" "}
          {groupedClusters.Mean[feature]?.[clusterIndex]?.original.Value ||
            "N/A"}
        </p>
        <p>
          <strong>Mean Value:</strong>{" "}
          {groupedClusters.Mean[feature]?.[clusterIndex]?.original.Value ||
            "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ClusterDropdown;
