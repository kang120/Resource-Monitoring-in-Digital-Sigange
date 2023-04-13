import { useEffect } from 'react';
import { useState } from 'react';
import { getFrequencyPercentage, getNumberFrequencyPercentage, sortByClusterOrder, sortUserByCluser } from '../../helpers/TableHelper';
import { countFrequency, countMode } from '../../helpers/OverviewHelper';
import BarChart from '../Charts/BarChart';
import './index.css'
import { getBarChartFrequencyData, getBarChartPeriodFrequencyData, getPieChartComponentData } from '../../helpers/ChartHelper';
import PieChart from '../Charts/PieChart';
import { useNavigate } from 'react-router-dom';

const AdminOverview = () => {
    const [overviewData, setOverviewData] = useState({})
    const [clusterData, setClusterData] = useState([])

    const [reportType, setReportType] = useState('month')
    const [availableYear, setAvailableYear] = useState([])

    const [week, setWeek] = useState(51)
    const [month, setMonth] = useState(11)
    const [year, setYear] = useState(2022)

    const navigate = useNavigate();

    const fetchWeekReport = async () => {
        const res = await fetch('http://localhost:2020/api/get_week_cluster', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                week: week,
                year: year
            })
        })

        const data = await res.json()
        console.log(data);

        if (data.message == 'Data not found') {
            setOverviewData({})
        } else {
            sortData(data.data);
        }
    }

    const fetchMonthReport = async () => {
        console.log(month);
        console.log(year);
        const res = await fetch('http://localhost:2020/api/get_month_cluster', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                month: month,
                year: year
            })
        })

        const data = await res.json()
        console.log(data);

        if (data.message == 'Data not found') {
            setOverviewData({})
        } else {
            sortData(data.data);
        }
    }

    const sortData = (data) => {
        const total_login_times = countFrequency(data, 'login_times');
        const total_manage_times = countFrequency(data, 'manage_times');
        const total_schedule_times = countFrequency(data, 'schedule_times');
        const frequent_login_period = countMode(data, 'login_period');
        const most_used_components = countMode(data, 'most_used_components');

        setOverviewData({
            login_times: total_login_times,
            manage_times: total_manage_times,
            schedule_times: total_schedule_times,
            frequent_login_period: frequent_login_period,
            most_used_components: most_used_components
        })

        const sorted_clusters = sortUserByCluser(data);

        const cluster_data = [];

        Object.keys(sorted_clusters).forEach(key => {
            const cluster = Number(key.split('_')[1]) + 1;

            const users = sorted_clusters[key];

            const login_periods = [];
            const most_used_components = [];
            const login_times = [];
            const manage_times = [];
            const schedule_times = [];

            users.forEach(user => {
                login_periods.push(user['login_period'])
                most_used_components.push(user['most_used_components'])
                login_times.push(user['login_times'])
                manage_times.push(user['manage_times'])
                schedule_times.push(user['schedule_times'])
            })

            const login_times_chart_data = getBarChartFrequencyData(login_times, 'Login')
            const manage_times_chart_data = getBarChartFrequencyData(manage_times, 'Manage')
            const schedule_times_chart_data = getBarChartFrequencyData(schedule_times, 'Schedule')
            const login_periods_chart_data = getBarChartPeriodFrequencyData(login_periods)
            const most_used_components_chart_data = getPieChartComponentData(most_used_components)

            const login_periods_chart_label = getFrequencyPercentage(login_periods);
            const most_used_components_chart_label = getFrequencyPercentage(most_used_components);
            const login_times_chart_label = getNumberFrequencyPercentage(login_times, 'login');
            const manage_times_chart_label = getNumberFrequencyPercentage(manage_times, 'manage');
            const schedule_times_chart_label = getNumberFrequencyPercentage(schedule_times, 'schedule');

            cluster_data.push({
                cluster: cluster,
                login_times_chart_data: login_times_chart_data,
                manage_times_chart_data: manage_times_chart_data,
                schedule_times_chart_data: schedule_times_chart_data,
                login_periods_chart_data: login_periods_chart_data,
                most_used_components_chart_data: most_used_components_chart_data,
                login_times_chart_label: login_times_chart_label,
                manage_times_chart_label: manage_times_chart_label,
                schedule_times_chart_label: schedule_times_chart_label,
                login_periods_chart_label: login_periods_chart_label,
                most_used_components_chart_label: most_used_components_chart_label
            })
        })

        cluster_data.sort(sortByClusterOrder);
        console.log('cluster_data', cluster_data)

        setClusterData([...cluster_data]);
    }

    useEffect(() => {
        const fetchAvailablePeriod = async () => {
            const res = await fetch('http://localhost:2020/api/get_min_max_date', {
                method: 'GET'
            })

            const data = await res.json()

            if (data.message == 'Data not found') {
                setAvailableYear([])
            } else {
                const min_date = data.data.min_date;
                const max_date = data.data.max_date;

                const min_year = min_date.split(' ')[0].split('/')[2];
                const max_year = max_date.split(' ')[0].split('/')[2];

                const years = []

                for (let i = min_year; i <= max_year; i++) {
                    years.push(i);
                }

                setAvailableYear([...years]);
            }
        }

        fetchAvailablePeriod();
        //fetchWeekReport();
    }, [])

    useEffect(() => {
        if (reportType == 'week') {
            fetchWeekReport();
        } else {
            fetchMonthReport();
        }

        setClusterData([]);
    }, [week, month, year, reportType])

    const onTypeChange = (e) => {
        setReportType(e.target.value);
    }

    const onWeekMonthChange = (e) => {
        if (reportType == 'week') {
            setWeek(e.target.value)
        } else {
            setMonth(e.target.value)
        }
    }

    const onYearChange = (e) => {
        setYear(e.target.value)
    }

    const gotoReportTable = () => {
        navigate('/dashboard/table')
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <div className="mt-5 d-flex align-items-center">
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="report-type" id="monthly" value='month' checked={reportType == 'month'} onChange={onTypeChange} />
                    <label className="form-check-label" htmlFor="monthly">
                        Monthly
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="report-type" id="weekly" value='week' checked={reportType == 'week'} onChange={onTypeChange} />
                    <label className="form-check-label" htmlFor="weekly">
                        Weekly
                    </label>
                </div>

                <div className='ms-4 d-flex align-items-center'>
                    <label className="text-uppercase fw-bolder me-3 ms-4">{reportType}</label>
                    <select className="form-select" onChange={onWeekMonthChange}>
                        {
                            reportType == 'week' ?
                                <>
                                    {
                                        Array.from({ length: 52 }, (_, i) => i + 1).map((w, index) => {
                                            return <option key={index} value={w} selected={w == week}>{w}</option>
                                        })
                                    }
                                </> :
                                <>
                                    {
                                        Array.from({ length: 12 }, (_, i) => i + 1).map((m, index) => {
                                            return <option key={index} value={m} selected={m == month}>{m}</option>
                                        })
                                    }
                                </>
                        }
                    </select>
                </div>

                <div className='ms-4 d-flex align-items-center'>
                    <label className="text-uppercase fw-bolder me-3 ms-4">year</label>
                    <select className="form-select" onChange={onYearChange}>
                        {
                            availableYear.map((y, index) => {
                                return <option key={index} value={y} selected={y == year}>{y}</option>
                            })
                        }
                    </select>
                </div>
            </div>

            <h4 className='mt-5'>Overview</h4>
            <div className='d-flex mt-5'>
                <div className="col card px-5 py-2">
                    <div className="card-body">
                        <h5 className="card-title text-start">Login Times</h5>
                        <h1 className='mt-4 text-end'>{overviewData['login_times'] != undefined ? overviewData['login_times'] : 0}</h1>
                    </div>
                </div>
                <div className="col ms-5 card px-5 py-2">
                    <div className="card-body">
                        <h5 className="card-title text-start">Manage Times</h5>
                        <h1 className='mt-4 text-end'>{overviewData['manage_times'] != undefined ? overviewData['manage_times'] : 0}</h1>
                    </div>
                </div>
                <div className="col ms-5 card px-5 py-2">
                    <div className="card-body">
                        <h5 className="card-title text-start">Schedule Times</h5>
                        <h1 className='mt-4 text-end'>{overviewData['schedule_times'] != undefined ? overviewData['schedule_times'] : 0}</h1>
                    </div>
                </div>
            </div>
            <div className='d-flex mt-5'>
                <div className="col card px-5 py-2">
                    <div className="card-body">
                        <h5 className="card-title text-start">Frequent Login Period</h5>
                        <h1 className='mt-4 text-end'>{overviewData['frequent_login_period'] != undefined ? overviewData['frequent_login_period'] : '-'}</h1>
                    </div>
                </div>
                <div className="col ms-5 card px-5 py-2">
                    <div className="card-body">
                        <h5 className="card-title text-start">Most Used Component</h5>
                        <h1 className='mt-4 text-end'>{overviewData['most_used_components'] != undefined ? overviewData['most_used_components'] : '-'}</h1>
                    </div>
                </div>
            </div>

            <div className='d-flex align-items-center mt-5'>
                <h4>User Cluster</h4>
                <button className='btn btn-primary ms-auto' onClick={gotoReportTable}>View Report Table</button>
            </div>

            {
                clusterData.length == 0 ?
                <div>No Record Found</div> :
                <div className='accordion mt-5'>
                    {
                        clusterData.map((cluster, index) => (
                            <div className='accordion-item'>
                            <h2 className='accordion-header'>
                                <button className='accordion-button p-4' type='button' data-bs-toggle='collapse' data-bs-target={`#cluster-${index+1}`}>
                                    <b>Cluster {index+1}</b>
                                </button>
                            </h2>
                            <div id={`cluster-${index+1}`} class={`accordion-collapse collapse ${index == 0 ? 'show' : 'show'}`}>
                                <div className="accordion-body d-flex flex-wrap justify-content-around">
                                    <BarChart data={clusterData[index]['login_times_chart_data']} title={'Total Login Times'} />
                                    <BarChart data={clusterData[index]['manage_times_chart_data']} title={'Total Manage Times'} />
                                    <BarChart data={clusterData[index]['schedule_times_chart_data']} title={'Total Schedule Times'} />
                                    <BarChart data={clusterData[index]['login_periods_chart_data']} title={'Login Periods'} />
                                    <PieChart data={clusterData[index]['most_used_components_chart_data']} title={'Most Used Components'} />
                                </div>
                            </div>
                        </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default AdminOverview;
