import { OrderBy, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import Component from './index';

export const meta = {
  name: 'TreeGraphHighlight',
  label: 'Tree Graph Highlight (Highcharts)',
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
      label: 'ID (Node)',
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
      description: 'Specify the parent ID for each node. (Empty for root)',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'nameDimension',
      type: 'dimension',
      label: 'Display Name',
      description: 'The display name of the node in the TreeGraph.',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'tooltipDimension',
      type: 'dimension',
      label: 'Tooltip',
      description: 'The tooltip of the node in the Sunburst chart.',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'highlightDimension',
      type: 'dimension',
      label: 'Highlight',
      description: 'The tooltip of the node in the treegraph chart.',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'color',
      type: 'string',
      label: 'Node Colour',
      category: 'Chart settings',
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
      orderProp.push({
        property: inputs.idDimension,
        direction: 'asc',
      });
    }

    const results = loadData({
      from: inputs.ds,
      dimensions: [inputs.idDimension, inputs.parentDimension, inputs.nameDimension,
        inputs.tooltipDimension,inputs.highlightDimension].filter(
        (e) => e,
      ),
      measures: [],
    });

    return {
      ...inputs,
      results,
    };
  },
});
