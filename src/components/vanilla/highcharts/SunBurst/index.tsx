import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// Sunburst module import
import sunburstModule from 'highcharts/modules/sunburst.js';
// Exporting & Accessibility modules
import exportingModule from 'highcharts/modules/exporting.js';
import accessibilityModule from 'highcharts/modules/accessibility.js';

import Container from '../../Container';

// Initialize the required Highcharts modules
try {
  if (typeof Highcharts === 'object') {
    sunburstModule(Highcharts);
    exportingModule(Highcharts);
    accessibilityModule(Highcharts);
  }
} catch (error) {
  console.log('Error initializing Highcharts modules:', error);
}

// Define shape of each data point
interface SunburstPoint {
  id: string;
  parent: string;
  name: string;
  value?: number | null;
}

interface Props {
  results: any;
  title?: string;
  description?: string;
  idDimension?: any;
  parentDimension?: any;
  nameDimension?: any;
  valueDimension?: any;
}

/**
 * Transform the query results into the format required by the Highcharts Sunburst chart.
 *
 * - `id` is the unique identifier for each node
 * - `parent` references the parent's `id` (blank/empty for the root node)
 * - `name` is displayed in the Sunburst segments
 * - `value` is optional but commonly used for numeric data
 */
function transformResultsToSunburstData(props: Props): SunburstPoint[] {
  const { results, idDimension, parentDimension, nameDimension, valueDimension } = props;
  if (!results?.data?.length) {
    return [];
  }

  return results.data.map((row: any) => ({
    id: String(row[idDimension?.name] ?? ''),
    parent: String(row[parentDimension?.name] ?? ''),
    name: String(row[nameDimension?.name] ?? ''),
    value: valueDimension?.name ? Number(row[valueDimension?.name] ?? 0) : null,
  }));
}

export default function SunburstChart(props: Props) {
  const chartData = useMemo(() => transformResultsToSunburstData(props), [props.results]);

  const options = useMemo(() => {
    return {
      chart: {
        height: '100%',
        width: '100%',
      },
      title: {
        text: props.title || 'Sunburst Chart Example',
      },
      subtitle: {
        text: props.description || '',
      },
      series: [
        {
          type: 'sunburst',
          data: chartData,
          allowDrillToNode: true,
          cursor: 'pointer',
          name: 'Root',
          borderRadius: 3,
          dataLabels: {
            format: '{point.name}',
            filter: {
              property: 'innerArcLength',
              operator: '>',
              value: 4,
            },
          },
          levels: [
            {
              level: 1,
              levelIsConstant: false,
              dataLabels: {
                filter: {
                  property: 'outerArcLength',
                  operator: '>',
                  value: 4,
                },
              },
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
      tooltip: {
        headerFormat: '',
        // Example: "The population of <b>{point.name}</b> is <b>{point.value}</b>"
        pointFormat: 'The value of <b>{point.name}</b> is <b>{point.value}</b>',
      },
      exporting: {
        enabled: true,
      },
      accessibility: {
        enabled: true,
      },
    };
  }, [chartData, props.title, props.description]);

  return (
    <Container {...props} className="overflow-y-hidden">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Container>
  );
}
