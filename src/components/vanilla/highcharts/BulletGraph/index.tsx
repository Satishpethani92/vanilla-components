import React from 'react';
import Highcharts, { Options } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// The following modules need to be initialized for the gauge-speedometer to work:
// import highchartsMoreModule from 'highcharts/highcharts-more.js';
import HighchartsBullet from 'highcharts/modules/bullet.js';

import Container from '../../Container';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

try {
  if (typeof Highcharts === 'object') {
    HighchartsBullet(Highcharts);
  }
} catch (error) {
  console.log('error', error);
}

interface Props {
  results: DataResponse;
  title?: string;
  description?: string;
  format?: string;
  actual: Dimension;
  total: Dimension;
  name: Dimension;
  measure: Dimension;
}

// Common chart options
const commonOptions = {
  chart: {
    inverted: true,
    marginLeft: 135,
    type: 'bullet',
  },
  title: {
    text: null,
  },
  legend: {
    enabled: false,
  },
  yAxis: {
    gridLineWidth: 0,
  },
  plotOptions: {
    series: {
      pointPadding: 0.25,
      borderWidth: 0,
      color: '#000',
      targetOptions: {
        width: '200%',
      },
    },
  },
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
};

const getResultData = (props: Props) => {
  const { results, actual, total, name, measure } = props;

  const finalData = results.data?.map((e, index) => ({
    ...commonOptions,
    chart: {
      ...commonOptions.chart,
      marginTop: 40,
      height: 115,
    },
    ...(index === 0
      ? {
          title: {
            text: props.title,
          },
        }
      : {}),
    xAxis: {
      categories: [`<span class="hc-cat-title">${e[name.name]} : ${e[measure.name]}</span><br/>`],
    },
    yAxis: {
      ...commonOptions.yAxis,
      plotBands: [
        {
          from: 0,
          to: 150,
          color: '#666',
        },
        {
          from: 150,
          to: 225,
          color: '#999',
        },
        {
          from: 225,
          to: 9e9,
          color: '#bbb',
        },
      ],
      title: null,
    },
    series: [
      {
        data: [
          {
            y: Number(e[total.name] ?? 0),
            target: Number(e[actual.name] || 100),
          },
        ],
      },
    ],
    tooltip: {
      pointFormat: `<b>${e[actual.name]}</b> (with target at ${e[total.name]})`,
    },
  }));

  const slicedData = finalData?.slice(0, 3);
  return slicedData || [];
};

export default function BulletGraph(props: Props) {
  const data = getResultData(props);

  return (
    <Container {...props} className="overflow-y-hidden">
      {data.map((option, index) => {
        console.log('options', option);
        return <HighchartsReact key={index} highcharts={Highcharts} options={option} />;
      })}
    </Container>
  );
}
