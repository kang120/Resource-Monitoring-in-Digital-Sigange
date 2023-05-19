import { Chart } from "primereact/chart";

const DoughnutChart = ({ data, xlabels }) => {

    const chartData = {
        labels: xlabels,
        datasets: [
            {
                data: data,
                backgroundColor: [
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
                hoverBackgroundColor: [
                    '#ff9f4032',
                    '#4bc0c032',
                    '#36a2eb32',
                    '#9966ff32',
                    '#e6e47a32',
                    '#f0968d32',
                    '#9A208C32',
                    '#F7D06032',
                    '#98D8AA32',
                    '#FC4F0032'
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
