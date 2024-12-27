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
  console.log('chartData', chartData);
  const options = useMemo(() => {
    return {
      chart: {
        height: '500px',
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
          data: [
            {
              id: '862',
              parent: '',
              name: 'Xinfin Apothem edited',
              value: 1,
            },
            {
              id: '866',
              parent: '862',
              name: 'Product Distribution ',
              value: 1,
            },
            {
              id: '867',
              parent: '862',
              name: 'Product Distribution',
              value: 2,
            },
            {
              id: '868',
              parent: '862',
              name: 'Research and Development',
              value: 3,
            },
            {
              id: '1163',
              parent: '862',
              name: 'childof strategic cap 23aug',
              value: 4,
            },
            {
              id: '1',
              parent: '868',
              name: 'Product Distribution ',
              value: 1,
            },
            {
              id: '2',
              parent: '868',
              name: 'Product Distribution',
              value: 2,
            },
            {
              id: '3',
              parent: '868',
              name: 'Research and Development',
              value: 3,
            },
            {
              id: '4',
              parent: '868',
              name: 'childof strategic cap 23aug',
              value: 4,
            },
          ],
          allowDrillToNode: true,
          cursor: 'pointer',
          name: 'Root',
          borderRadius: 3,
          dataLabels: {
            format: '{point.name}',
            // Optionally filter out small arcs
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
  }, [props.title, props.description]);

  return (
    <Container {...props}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Container>
  );
}
