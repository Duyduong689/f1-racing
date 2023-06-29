import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Column } from "@ant-design/plots";
interface CustomAntDColumnChartProps {
  chartData: any[];
}
const CustomAntDColumnChart: React.FC<CustomAntDColumnChartProps> = ({
  chartData,
}) => {
  const data = [...chartData].reverse();
  const brandColor = '#d52828';
  const config = {
    data,
    xField: "year",
    yField: "pos",
    color: () => {
      return brandColor;
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
  };
  return (
    <div className="chart-wrap">
      <Column {...config} />;
      <div className="chart-title">
        <span>Ranking In The Past 5-years</span>
      </div>
    </div>
  );
};
export default CustomAntDColumnChart;
