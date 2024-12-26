import { Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

// <-- This should be your custom React component that renders the AreaChart

//
// 1. Define metadata for your AreaChart embeddable component
//
export const meta = {
  name: 'AreaChart',
  label: 'Area chart',
  // You can set a default size or class name here, if you have one
  classNames: ['inside-card'],
  category: 'HighCharts: Area charts',

  //
  // 2. Add the list of inputs (props) this chart requires.
  //
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

  //
  // 3. Define any events that your chart might emit. For instance, a point click.
  //    You can add or remove properties as you see fit.
  //
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

//
// 4. Export the component definition by wiring up the chart component + meta.
//
export default defineComponent(Component, meta, {
  // Map your inputs into props that you want to pass down to the React component.
  // In particular, you can use `loadData()` to fetch the dimension & measure data.
  props: (inputs: Inputs<typeof meta>) => {
    console.log({
      from: inputs.ds,
      dimensions: [inputs.slice],
      measures: [inputs.metric],
    });
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        dimensions: [inputs.slice],
        measures: [inputs.metric],
      }),
    };
  },

  // Map your custom event payload to the event shape you declared above.
  events: {
    onClick: (dataPoint) => {
      // dataPoint may vary depending on how you call the event in your chart
      return {
        dimensionValue: dataPoint?.dimensionValue || Value.noFilter(),
        measureValue: dataPoint?.measureValue || Value.noFilter(),
      };
    },
  },
});
