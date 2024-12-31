import React from 'react';
import Highcharts, { Options } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// The following modules need to be initialized for the gauge-speedometer to work:
// import highchartsMoreModule from 'highcharts/highcharts-more.js';
import exportingModule from 'highcharts/modules/exporting.js';
import accessibilityModule from 'highcharts/modules/accessibility.js';
import HC_more from 'highcharts/highcharts-more.js';
import Container from '../../Container';
import { DataResponse, Measure } from '@embeddable.com/core';
import { COLORS } from '../../../constants';

try {
  if (typeof Highcharts === 'object') {
    HC_more(Highcharts);
    exportingModule(Highcharts);
    accessibilityModule(Highcharts);
  }
} catch (error) {
  console.log('error', error);
}

interface Props {
  results: DataResponse;
  title?: string;
  description?: string;
  valueDimension?: any;
  format?: string;
  actual: Measure;
  total: Measure;
}

const getResultData = (props: Props) => {
  const { results, actual, total } = props;

  if (!results?.data?.length) {
    return [100, 0] as const;
  }

  const data: number[] = results.data.map((row) => {
    return [row[actual.name] as number, row[total.name] as number];
  })[0];

  return data;
};

const plotBands = (actual: number, total: number) => {
  const defaultPlotPoints = Array.from({ length: 5 }, (_, i) => ({
    from: Math.floor(total / 5) * i,
    to: i + 1 === 5 ? total : Math.floor(total / 5) * (i + 1) - 1,
    color: COLORS[i],
    thickness: 20,
    borderRadius: '50%',
  }));

  return defaultPlotPoints;
};

export default function Speedometer(props: Props) {
  const [actual, total] = getResultData(props);

  const options = {
    chart: {
      type: 'gauge',
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: '80%',
    },

    title: {
      text: props.title,
    },

    subtitle: {
      text: props.description || '',
    },

    pane: {
      startAngle: -90,
      endAngle: 89.9,
      background: null,
      center: ['50%', '75%'],
      size: '110%',
    },

    // the value axis
    yAxis: {
      min: 0,
      max: total,
      tickPixelInterval: 72,
      tickPosition: 'inside',
      tickColor: '#FFFFFF',
      tickLength: 20,
      tickWidth: 2,
      minorTickInterval: null,
      labels: {
        distance: 20,
        style: {
          fontSize: '14px',
        },
      },
      lineWidth: 0,
      plotBands: plotBands(actual, total),
    },

    series: [
      {
        name: 'Speed',
        data: [actual],
        tooltip: {
          valueSuffix: ` ${props.format}`,
        },
        dataLabels: {
          format: `{y} ${props.format}`,
          borderWidth: 0,
          color:
            (Highcharts.defaultOptions.title &&
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color) ||
            '#333333',
          style: {
            fontSize: '16px',
          },
        },
        dial: {
          radius: '80%',
          backgroundColor: 'gray',
          baseWidth: 12,
          baseLength: '0%',
          rearLength: '0%',
        },
        pivot: {
          backgroundColor: 'gray',
          radius: 6,
        },
      },
    ],
  };

  return (
    <Container {...props} className="overflow-y-hidden">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Container>
  );
}
