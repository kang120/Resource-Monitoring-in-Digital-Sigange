import { Chart } from 'primereact/chart';
import './index.css'

const ScatterChart = ({ data, xlabels, label, cmaps }) => {
    const chartData = {
        datasets: [
            {
                label: '',
                data: data,
                backgroundColor: cmaps
            }
        ],
        responsive: true
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
        plugins: {
            legend: {
                display: false
            }
        },
        maintainAspectRatio: false,
        responsive: true
    }

    return (
        <div className='card' style={{ height: '100%' }}>
            <Chart type='scatter' data={chartData} options={chartOptions} height='100%' />
        </div>
    )
}

export default ScatterChart;
