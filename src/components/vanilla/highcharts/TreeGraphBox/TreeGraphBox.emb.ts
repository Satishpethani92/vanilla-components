import { OrderBy, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import Component from './index';

export const meta = {
  name: 'TreeGraphBox',
  label: 'Tree Graph Box (Highcharts)',
  category: 'Charts: essentials',
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
    console.log('inputs', inputs);

    console.log({
      from: inputs.ds,
      dimensions: [inputs.idDimension, inputs.parentDimension, inputs.nameDimension],
      measures: [],
      orderBy: orderProp,
    });
    const results = loadData({
      from: inputs.ds,
      dimensions: [inputs.idDimension, inputs.parentDimension, inputs.nameDimension].filter(
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
