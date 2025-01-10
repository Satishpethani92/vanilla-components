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
  highlight: string;
  color: string;
}

interface Props {
  results: any;
  title?: string;
  description?: string;
  idDimension?: any;
  parentDimension?: any;
  nameDimension?: any;
  tooltipDimension?: any;
  highlightDimension?: any;
  color?: string;
}

function transformResultsToTreeGraphData(props: Props): TreeGraphPoint[] {
  const { results, idDimension, parentDimension, nameDimension, tooltipDimension, highlightDimension } = props;
  if (!results?.data?.length) {
    return [];
  }
    
  const data: TreeGraphPoint[] = results.data.map((row: any) => ({
    id: String(row[idDimension?.name] ?? ''),
    parent: String(row[parentDimension?.name] ?? ''),
    name: String(row[nameDimension?.name] ?? ''),
    tooltip: String(row[tooltipDimension?.name] ?? ''),
    highlight: String(row[highlightDimension?.name] ?? ''),
  }));
  
  return data;
}

export default function TreeGraphBoxChart(props: Props) {
  const chartData = useMemo(() => transformResultsToTreeGraphData(props), [props.results, props.tooltipDimension, props.highlightDimension]);
  console.log("treegraphhighlight chartData", chartData)
  
  const options = useMemo(() => {
    chartData.forEach((point) => {
      if (point.highlight != 'True') {
        console.log("point.tooltip====",point.tooltip)
        point.color = 'rgba(112, 122, 123, 0.1)';
      }
    });
    return {
      chart: {
        type: 'treegraph',
        height: '100%',
      },
      title: {
        text: null,
      },
      // colors: COLORS,
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
              color: props.color,
            },
            {
              level: 2,
              color: props.color,
            },
            {
              level: 3,
              color: props.color,
            },
            {
              level: 4,
              color: props.color,
            },
            {
              level: 5,
              color: props.color,
            },
            {
              level: 6,
              color: props.color,
            },
            {
              level: 7,
              color: props.color,
            },
            {
              level: 8,
              color: props.color,
            },
            {
              level: 9,
              color: props.color,
            },
            {
              level: 10,
              color: props.color,
            },
            {
              level: 11,
              color: props.color,
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
  }, [chartData, props.color, props.title, props.description]);

  console.log("options==",options);
  return (
    <Container {...props} className="overflow-y-hidden">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Container>
  );
}
