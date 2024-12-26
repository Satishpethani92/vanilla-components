import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

// <— The React component from above

// 1. Define the metadata, e.g., name, label, inputs, events
export const meta = {
  name: 'TreeGraphBox',
  label: 'Tree Graph (Box)',
  category: 'HighCharts: Tree Graph (Box)',

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
      label: 'Node ID Dimension',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'parentDimension',
      type: 'dimension',
      label: 'Parent ID Dimension',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'nameDimension',
      type: 'dimension',
      label: 'Node Name Dimension',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'chartTitle',
      type: 'string',
      label: 'Chart Title',
      defaultValue: 'Treegraph with box layout',
      category: 'Chart settings',
    },
  ],

  // If you want to handle node clicks, you can define an event:
  events: [
    {
      name: 'onNodeClick',
      label: 'Node Click',
      properties: [
        { name: 'nodeId', type: 'string' },
        { name: 'nodeName', type: 'string' },
      ],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

// 2. Export the component definition
export default defineComponent(Component, meta, {
  // 2a. props: transform your inputs -> component props
  props: (inputs: Inputs<typeof meta>) => {
    // Load the dataset
    const result = loadData({
      from: inputs.ds,
      dimensions: [inputs.idDimension, inputs.parentDimension, inputs.nameDimension],
      measures: [],
    });

    const data = (result.data || []).map((row) => {
      return {
        id: String(row[inputs.idDimension.name]),
        parent: row[inputs.parentDimension.name] ? String(row[inputs.parentDimension.name]) : '',
        name: String(row[inputs.nameDimension.name]),
      };
    });

    return {
      data,
      chartTitle: inputs.chartTitle,
    };
  },

  // 2b. events: map chart events to embeddable events
  events: {
    onNodeClick: (point) => {
      return {
        nodeId: point.id || '',
        nodeName: point.name || '',
      };
    },
  },
});
