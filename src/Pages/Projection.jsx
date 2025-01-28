import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useLocation, useParams } from "react-router-dom";

const Projection = () => {
  const location = useLocation();
  const { project_id } = useParams();

  const [plotData, setPlotData] = useState([]);
  const [plotLayout, setPlotLayout] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state && location.state.timeSeriesFigure) {
      try {
        const parsedData = JSON.parse(location.state.timeSeriesFigure.plotly_figure);
        setPlotData(parsedData.data || []);
        setPlotLayout(parsedData.layout || {});
      } catch (err) {
        console.error("Error parsing time series figure:", err);
        setError("Failed to load chart data.");
      }
    } else {
      setError("No chart data found in location state.");
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">
        Projection for Project ID: {project_id}
      </h1>
      {error ? (
        <div className="text-red-500 font-medium">{error}</div>
      ) : (
        <Plot
          data={plotData}
          layout={plotLayout}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

export default Projection;