import Chart from "react-google-charts";

const PieChart = ({ data, title }) => {
    const options = {
        pieStartAngle: 100,
        chartArea: {
            width: 400,
            height: 300
        }
    }

    return (
        <div className="col-6 border border-light-subtle p-4 mx-3 mt-5">
            <h6 className="mb-5">{title}</h6>
            <Chart chartType="PieChart" data={data} options={options} />
        </div>
    )
}

export default PieChart;
