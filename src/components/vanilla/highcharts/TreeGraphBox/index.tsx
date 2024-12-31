import React, { useMemo } from 'react';
import Highcharts, { Options } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// The following modules need to be initialized for the treegraph to work:
import treemapModule from 'highcharts/modules/treemap.js';
import treegraphModule from 'highcharts/modules/treegraph.js';
import exportingModule from 'highcharts/modules/exporting.js';
import accessibilityModule from 'highcharts/modules/accessibility.js';

import Container from '../../Container';

try {
  if (typeof Highcharts === 'object') {
    treemapModule(Highcharts);
    treegraphModule(Highcharts);
    exportingModule(Highcharts);
    accessibilityModule(Highcharts);
  }
} catch (error) {
  console.log('error', error);
}

interface TreeGraphPoint {
  id: string;
  parent: string;
  name: string;
}

interface Props {
  results: any;
  title?: string;
  description?: string;
  idDimension?: any;
  parentDimension?: any;
  nameDimension?: any;
}

function transformResultsToTreeGraphData(props: Props): TreeGraphPoint[] {
  const { results, idDimension, parentDimension, nameDimension } = props;
  if (!results?.data?.length) {
    return [];
  }

  const data: TreeGraphPoint[] = results.data.map((row: any) => ({
    id: String(row[idDimension?.name] ?? ''),
    parent: String(row[parentDimension?.name] ?? ''),
    name: String(row[nameDimension?.name] ?? ''),
  }));

  return data;
}

export default function TreeGraphBoxChart(props: Props) {
  const chartData = useMemo(() => transformResultsToTreeGraphData(props), [props.results]);

  const options = useMemo(() => {
    return {
      chart: {
        type: 'treegraph',
        height: '100%',
      },
      title: {
        text: props.title || 'Treegraph with box layout',
      },
      subtitle: {
        text: props.description || '',
      },
      series: [
        {
          type: 'treegraph',
          data: chartData,
          tooltip: {
            pointFormat: '{point.name}',
          },
          marker: {
            symbol: 'rect',
            width: '25%',
          },
          borderRadius: 10,
          dataLabels: {
            pointFormat: '{point.name}',
            style: {
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
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

      exporting: {
        enabled: true,
      },
      accessibility: {
        enabled: true,
      },
    };
  }, [chartData, props.title, props.description]);

  return (
    <Container {...props}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Container>
  );
}
