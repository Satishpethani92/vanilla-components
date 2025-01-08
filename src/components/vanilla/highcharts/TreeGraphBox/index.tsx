import React, { useMemo } from 'react';
import Highcharts, { Options } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// The following modules need to be initialized for the treegraph to work:
import treemapModule from 'highcharts/modules/treemap.js';
import treegraphModule from 'highcharts/modules/treegraph.js';
import exportingModule from 'highcharts/modules/exporting.js';
import accessibilityModule from 'highcharts/modules/accessibility.js';

import Container from '../../Container';
import { COLORS } from '../../../constants';

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
  tooltip: string;
}

interface Props {
  results: any;
  title?: string;
  description?: string;
  idDimension?: any;
  parentDimension?: any;
  nameDimension?: any;
  tooltipDimension?: any;
}

function transformResultsToTreeGraphData(props: Props): TreeGraphPoint[] {
  const { results, idDimension, parentDimension, nameDimension, tooltipDimension } = props;
  if (!results?.data?.length) {
    return [];
  }
    
  const data: TreeGraphPoint[] = results.data.map((row: any) => ({
    id: String(row[idDimension?.name] ?? ''),
    parent: String(row[parentDimension?.name] ?? ''),
    name: String(row[nameDimension?.name] ?? ''),
    tooltip: String(row[tooltipDimension?.name] ?? ''),
  }));
  
  return data;
}

export default function TreeGraphBoxChart(props: Props) {
  const chartData = useMemo(() => transformResultsToTreeGraphData(props), [props.results, props.tooltipDimension]);
  console.log("treegraph chartData", chartData)
  const options = useMemo(() => {
    return {
      chart: {
        type: 'treegraph',
        height: '100%',
      },
      title: {
        text: null,
      },
      colors: COLORS,
      series: [
        {
          type: 'treegraph',
          data: chartData,
          marker: {
            symbol: 'rect',
            width: '15%',
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
              colorByPoint: true,
            },
            // {
            //   level: 2,
            //   // colorByPoint: true,
            // },
            {
              level: 2,
              colorVariation: {
                key: 'brightness',
                to: 0.15,
              },
            },
            {
              level: 3,
              colorVariation: {
                key: 'brightness',
                to: 0.25,
              },
            },
            {
              level: 4,
              colorVariation: {
                key: 'brightness',
                to: 0.25,
              },
            },
            {
              level: 5,
              colorVariation: {
                key: 'brightness',
                to: 0.25,
              },
            },
            {
              level: 6,
              colorVariation: {
                key: 'brightness',
                to: 0.25,
              },
            },
            {
              level: 7,
              colorVariation: {
                key: 'brightness',
                to: 0.25,
              },
            },
            {
              level: 8,
              colorVariation: {
                key: 'brightness',
                to: 0.25,
              },
            },
            {
              level: 9,
              colorVariation: {
                key: 'brightness',
                to: 0.25,
              },
            },
            {
              level: 10,
              colorVariation: {
                key: 'brightness',
                to: 0.25,
              },
            },
            {
              level: 11,
              colorVariation: {
                key: 'brightness',
                to: 0.25,
              },
            },
          ],
        },
      ],
      tooltip: {
        headerFormat: '',
        pointFormat: '{point.tooltip}',
      },
      exporting: {
        enabled: false,
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
