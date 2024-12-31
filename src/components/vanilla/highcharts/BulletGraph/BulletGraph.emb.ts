import { loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import Component from './index';

export const meta = {
  name: 'BulletGraph',
  label: 'BulletGraph Chart (Highcharts)',
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
      name: 'actual',
      type: 'dimension',
      label: 'Actual Value',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'total',
      type: 'dimension',
      label: 'Total Value',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'name',
      type: 'dimension',
      label: 'Record Title',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'measure',
      type: 'dimension',
      label: 'Record Measure',
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
    const results = loadData({
      from: inputs.ds,
      dimensions: [inputs.actual, inputs.total, inputs.name, inputs.measure],
    });

    return {
      ...inputs,
      results,
    };
  },
});
