import { Chart } from "primereact/chart";

const PieChart = ({ data, xlabels }) => {

    const chartData = {
        labels: xlabels,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    'rgb(153, 102, 255)',
                    'rgb(212, 210, 93)',
                    'rgb(237, 99, 85)'
                ],
                hoverBackgroundColor: [
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(230, 228, 122, 0.2)',
                    'rgba(240, 150, 141, 0.2)'
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
            <Chart type="pie" data={chartData} options={chartOptions} width='400px' />
        </div>
    )
}

export default PieChart;
