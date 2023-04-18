import { Chart } from "primereact/chart";

const DoughnutChart = ({ data, xlabels }) => {

    const chartData = {
        labels: xlabels,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    'rgb(255, 159, 64)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)'
                ],
                hoverBackgroundColor: [
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)'
                ]
            }
        ]
    }

    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        }
    };

    return (
        <div className="card flex justify-content-center">
            <Chart type="doughnut" data={chartData} options={chartOptions} width='400px' />
        </div>
    )
}

export default DoughnutChart;
