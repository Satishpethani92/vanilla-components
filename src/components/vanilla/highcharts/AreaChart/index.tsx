import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect, useRef } from 'react';

import { COLORS } from '../../../constants';
// same Container used in your Pie chart code
import formatValue from '../../../util/format';
import Container from '../../Container';

// if you want the same color palette

/**
 * Props definition similar to your Pie chart's interface, adapted for an Area chart.
 */
type Props = {
  results: DataResponse;
  title: string;
  dps?: number;
  slice: Dimension;
  metric: Measure;
  showLegend?: boolean;
  maxSegments?: number;
  displayAsPercentage?: boolean;
  enableDownloadAsCSV?: boolean;
  onClick: (args: { slice: string | null; metric: string | null }) => void;
};

/**
 * Reusable type for data records.
 */
type Record = { [p: string]: string | number };

/**
 * The main AreaChart component.
 */
export default function AreaChart(props: Props) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Build chart options (similar to chartOptions in Pie example)
  const options = getChartOptions(props, handlePointClick);

  /**
   * Handle a point click. Highcharts typically passes event data containing
   * the `point` with index, category (x), and y values.
   * We'll parse them & call `props.onClick`.
   */
  function handlePointClick(e: Highcharts.PointClickEventObject) {
    // If the user re-clicks the same "active" point, you might want to reset
    // the filter. But you can tweak that logic as needed.
    const { x, y, index } = e.point || {};
    // For your dimension filter, we look up the actual name if needed.
    // Because we merged or not, you might have "Other" as a category.
    // We'll assume the dimension name is stored in `chartData[index]`
    // or fallback to x if you’re using categories.

    // If user clicks outside or on the same active point, reset:
    // That logic is up to you; shown here just as an example:
    const isOther = props.maxSegments && index + 1 >= props.maxSegments;
    if (isOther) {
      // If you don't want to filter "Other," skip or do your logic:
      return;
    }

    // Convert to string if needed
    const sliceValue = x !== undefined && x !== null ? String(x) : null;
    const metricValue = y !== undefined && y !== null ? String(y) : null;

    // Fire the onClick callback
    props.onClick({ slice: sliceValue, metric: metricValue });
  }

  return (
    <Container {...props} className="overflow-y-hidden">
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </Container>
  );
}

/**
 * Builds the Highcharts configuration object.
 */
function getChartOptions(
  props: Props,
  onPointClick: (e: Highcharts.PointClickEventObject) => void,
): Highcharts.Options {
  const { title, showLegend } = props;

  // Build the series data
  const { categories, seriesData } = buildAreaData(props);

  return {
    chart: {
      type: 'area',
    },
    title: {
      text: title,
    },
    xAxis: {
      categories: categories.filter((e) => e !== null),
      tickmarkPlacement: 'on',
      title: { text: null },
    },
    yAxis: {
      title: { text: props.metric?.title || 'Value' },
    },
    legend: {
      enabled: showLegend,
    },
    plotOptions: {
      area: {
        pointStart: 0,
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: { enabled: true },
          },
        },
        // Attach point click to the area series
        point: {
          events: {
            click: function (e) {
              onPointClick(e);
            },
          },
        },
      },
    },
    tooltip: {
      shared: true,
      valueDecimals: props.dps ?? 0, // decimal places
      pointFormat: '{series.name}: <b>{point.y}</b><br/>',
    },
    series: [
      {
        type: 'area',
        name: props.metric?.title ?? 'Series 1',
        data: seriesData,
        color: COLORS[0] || '#058DC7', // Example color
      },
    ],
    // If you want the built-in exporting menu for CSV/PNG:
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          enabled: true,
        },
      },
    },
  };
}

/**
 * Similar to your 'chartData' function.
 * Merges long tail if necessary, and returns categories + numeric data.
 */
function buildAreaData(props: Props) {
  const { maxSegments, results, metric, slice, displayAsPercentage } = props;
  const data = results?.data || [];

  // If # of records > maxSegments, merge the "long tail"
  let chartRecords = data;
  if (maxSegments && maxSegments < data.length) {
    chartRecords = mergeLongTail(props, data);
  }

  // Build categories array (x-values)
  // For each record, format the dimension value
  const categories = chartRecords.map((d) => formatValue(d[slice.name], { meta: slice.meta }));

  // If displaying percentages, first compute the sum
  let sum = 0;
  if (displayAsPercentage) {
    sum = chartRecords.reduce((acc, d) => acc + parseFloat(d[metric.name] as string), 0);
  }

  // Build numeric data for the area series (y-values)
  const seriesData = chartRecords.map((d) => {
    const rawValue = parseFloat(d[metric.name] as string);
    return displayAsPercentage && sum ? (rawValue * 100) / sum : rawValue;
  });

  return { categories, seriesData };
}

/**
 * Merges the "long tail" beyond `maxSegments - 1` into an 'Other' category.
 * Similar logic to your Pie chart example.
 */
function mergeLongTail(props: Props, data: Record[]) {
  const { maxSegments, metric, slice } = props;
  if (!maxSegments || !metric || !slice) return data;

  // Sort descending by metric
  const sorted = [...data].sort((a, b) => {
    return parseFloat(b[metric.name] as string) - parseFloat(a[metric.name] as string);
  });

  // Take top (maxSegments - 1)
  const topRecords = sorted.slice(0, maxSegments - 1);

  // Sum remainder
  const remainderSum = sorted
    .slice(maxSegments - 1)
    .reduce((acc, r) => acc + parseFloat(r[metric.name] as string), 0);

  // Append single 'Other' row
  topRecords.push({
    [slice.name]: 'Other',
    [metric.name]: remainderSum,
  });

  return topRecords;
}
