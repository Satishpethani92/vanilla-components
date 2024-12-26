import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsTreeMap from 'highcharts/modules/treemap.js';
import HighchartsTreeGraph from 'highcharts/modules/treegraph.js';

import { useRef } from 'react';

import { COLORS } from '../../../constants';
import formatValue from '../../../util/format';
import Container from '../../Container';
// Initialize the treegraph module
try {
  HighchartsTreeGraph(Highcharts);
  HighchartsTreeMap(Highcharts);
} catch (e) {
  console.log('error', e);
}

type Record = { [p: string]: string | number };

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

function getChartOptions(
  props: Props,
  onPointClick: (e: Highcharts.PointClickEventObject) => void,
): Highcharts.Options {
  const { title, showLegend } = props;

  // Build the series data
  const { categories, seriesData } = buildAreaData(props);

  const data = [
    {
      id: '0.0',
      parent: '',
      name: 'The World',
    },
    {
      id: '1.3',
      parent: '0.0',
      name: 'Asia',
    },
    {
      id: '1.1',
      parent: '0.0',
      name: 'Africa',
    },
    {
      id: '1.2',
      parent: '0.0',
      name: 'America',
    },
    {
      id: '1.4',
      parent: '0.0',
      name: 'Europe',
    },
    {
      id: '1.5',
      parent: '0.0',
      name: 'Oceanic',
    },

    /* Africa */
    {
      id: '2.1',
      parent: '1.1',
      name: 'Eastern Africa',
    },

    {
      id: '2.5',
      parent: '1.1',
      name: 'Western Africa',
    },

    {
      id: '2.3',
      parent: '1.1',
      name: 'North Africa',
    },

    {
      id: '2.2',
      parent: '1.1',
      name: 'Central Africa',
    },

    {
      id: '2.4',
      parent: '1.1',
      name: 'South America',
    },

    /* America */
    {
      id: '2.9',
      parent: '1.2',
      name: 'South America',
    },

    {
      id: '2.8',
      parent: '1.2',
      name: 'Northern America',
    },

    {
      id: '2.7',
      parent: '1.2',
      name: 'Central America',
    },

    {
      id: '2.6',
      parent: '1.2',
      name: 'Caribbean',
    },

    /* Asia */
    {
      id: '2.13',
      parent: '1.3',
      name: 'Southern Asia',
    },

    {
      id: '2.11',
      parent: '1.3',
      name: 'Eastern Asia',
    },

    {
      id: '2.12',
      parent: '1.3',
      name: 'South-Eastern Asia',
    },

    {
      id: '2.14',
      parent: '1.3',
      name: 'Western Asia',
    },

    {
      id: '2.10',
      parent: '1.3',
      name: 'Central Asia',
    },

    /* Europe */
    {
      id: '2.15',
      parent: '1.4',
      name: 'Eastern Europe',
    },

    {
      id: '2.16',
      parent: '1.4',
      name: 'Northern Europe',
    },

    {
      id: '2.17',
      parent: '1.4',
      name: 'Southern Europe',
    },

    {
      id: '2.18',
      parent: '1.4',
      name: 'Western Europe',
    },
    /* Oceania */
    {
      id: '2.19',
      parent: '1.5',
      name: 'Australia and New Zealand',
    },

    {
      id: '2.20',
      parent: '1.5',
      name: 'Melanesia',
    },

    {
      id: '2.21',
      parent: '1.5',
      name: 'Micronesia',
    },

    {
      id: '2.22',
      parent: '1.5',
      name: 'Polynesia',
    },
  ];

  return {
    title: {
      text: title,
    },
    series: [
      {
        type: 'treegraph',
        data: data,
        tooltip: {
          pointFormat: '{point.name}',
        },
        marker: {
          symbol: 'rect',
          width: 25,
        },
        borderRadius: 10,
        dataLabels: {
          pointFormat: '{point.name}',
          style: {
            whiteSpace: 'nowrap',
          },
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false,
          },
          {
            level: 2,
            colorByPoint: true,
          },
          {
            level: 3,
            colorVariation: {
              key: 'brightness',
              to: -0.5,
            },
          },
          {
            level: 4,
            colorVariation: {
              key: 'brightness',
              to: 0.5,
            },
          },
        ],
      },
    ],
  };
}

export default function TreeGraphBox(props: Props) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const options = getChartOptions(props, handlePointClick);

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
