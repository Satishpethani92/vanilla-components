import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsBullet from "highcharts/modules/bullet";

// Initialize the Bullet module
HighchartsBullet(Highcharts);

const BulletChart = () => {
  const options = {
    chart: {
      type: "bullet",
      inverted: false, // Optional: Set to true for horizontal orientation
    },
    title: {
      text: "Performance Comparison",
    },
    xAxis: {
      categories: ["Target vs Actual"],
    },
    yAxis: {
      title: null,
      gridLineWidth: 0,
    },
    tooltip: {
      pointFormat: "<b>{point.y}</b> (target: {point.target})",
    },
    series: [
      {
        data: [
          {
            y: 80, // Actual value
            target: 100, // Target value
          },
        ],
        targetOptions: {
          width: "200%", // Adjust target marker width
        },
      },
    ],
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointPadding: 0.25, // Adjust padding between bars
        borderWidth: 0,
      },
    },
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BulletChart;
