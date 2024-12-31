import { Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'AreaChart',
  label: 'Area chart',
  classNames: ['inside-card'],
  category: 'HighCharts',

  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      category: 'Chart data',
    },
    {
      name: 'slice',
      type: 'dimension',
      label: 'Dimension (X-axis)',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Measure (Y-axis)',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Chart Title',
      defaultValue: 'My Area Chart',
      category: 'Chart settings',
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
      defaultValue: 'Demonstrating a basic Highcharts Area Chart.',
      category: 'Chart settings',
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Show Legend',
      defaultValue: true,
      category: 'Chart settings',
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      category: 'Export options',
      defaultValue: true,
    },
    {
      name: 'enableDownloadAsPNG',
      type: 'boolean',
      label: 'Show download as PNG',
      category: 'Export options',
      defaultValue: true,
    },
  ],

  events: [
    {
      name: 'onClick',
      label: 'Click',
      properties: [
        {
          name: 'dimensionValue',
          type: 'string',
        },
        {
          name: 'measureValue',
          type: 'number',
        },
      ],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        dimensions: [inputs.slice],
        measures: [inputs.metric],
      }),
    };
  },

  events: {
    onClick: (dataPoint) => {
      return {
        dimensionValue: dataPoint?.dimensionValue || Value.noFilter(),
        measureValue: dataPoint?.measureValue || Value.noFilter(),
      };
    },
  },
});
