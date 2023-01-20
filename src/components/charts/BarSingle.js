/* eslint-disable prefer-rest-params */
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

export const defaultOption = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  layout: {
    padding: {
      top: 24,
    },
  },
}

const BarSingle = ({ data, options = defaultOption }) => {
  return <Bar options={options} data={data} />
}

export default BarSingle
