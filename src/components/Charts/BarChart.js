import Chart from "react-google-charts";

const BarChart = ({ data, title }) => {
    const options = {
        title: title,
        legend: {
            position: 'none'
        }
    }

    return (
        <div className="col-4 border border-light-subtle p-4 mx-3 mt-5">
            <h6 className="mb-5">{title}</h6>
            <Chart chartType="Bar" data={data} options={options} />
        </div>
    )
}

export default BarChart;
