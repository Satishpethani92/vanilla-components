import { OrderBy, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import Component from './index';

export const meta = {
  name: 'SunburstChart',
  label: 'Sunburst Chart (Highcharts)',
  category: 'HighCharts',
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      category: 'Chart data',
    },
    {
      name: 'idDimension',
      type: 'dimension',
      label: 'Node ID',
      description: 'Each row should have a unique ID for the node.',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'parentDimension',
      type: 'dimension',
      label: 'Parent ID',
      description: 'Specify the parent ID for each node. (Leave empty for root.)',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'nameDimension',
      type: 'dimension',
      label: 'Node Name',
      description: 'The name of the node in the Sunburst chart.',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'valueDimension',
      type: 'measure',
      label: 'Value',
      description: 'Numeric value for the node (optional).',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Chart Title',
      category: 'Chart settings',
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
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
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    const orderProp: OrderBy[] = [];

    if (inputs.idDimension) {
      // Optionally sort by the ID dimension ascending
      orderProp.push({
        property: inputs.idDimension,
        direction: 'asc',
      });
    }

    // Load the data from the configured dataset, pulling in only the relevant dimensions.
    const results = loadData({
      from: inputs.ds,
      dimensions: [inputs.idDimension, inputs.parentDimension, inputs.nameDimension].filter(
        Boolean,
      ),
      measures: [inputs.valueDimension],
      orderBy: orderProp,
    });

    return {
      ...inputs,
      results,
    };
  },
});
