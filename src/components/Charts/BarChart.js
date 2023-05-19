import { Chart } from 'primereact/chart';
import './index.css'

const BarChart = ({ data, xlabels, label }) => {
    const chartData = {
        labels: xlabels,
        datasets: [
            {
                label: label,
                data: data,
                backgroundColor: [
                    '#ff9f4014',
                    '#4bc0c014',
                    '#36a2eb14',
                    '#9966ff14',
                    '#e6e47a14',
                    '#f0968d14',
                    '#9A208C14',
                    '#F7D06014',
                    '#98D8AA14',
                    '#FC4F0014'
                ],
                borderColor: [
                    '#ff9f40',
                    '#4bc0c0',
                    '#36a2eb',
                    '#9966ff',
                    '#e6e47a',
                    '#f0968d',
                    '#9A208C',
                    '#F7D060',
                    '#98D8AA',
                    '#FC4F00'
                ],
                borderWidth: 1,
                barPercentage: 0.5,
                categoryPercentage: 1,
            }
        ]
    }

    const chartOptions = {
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0
                }
            }
        },
        maintainAspectRatio: false
    }

    return (
        <div className='card'>
            <Chart type='bar' data={chartData} options={chartOptions} width='450px' height='300px' />
        </div>
    )
}

export default BarChart;
