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
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(230, 228, 122, 0.2)',
                    'rgba(240, 150, 141, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 159, 64)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(212, 210, 93)',
                    'rgb(237, 99, 85)'
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
