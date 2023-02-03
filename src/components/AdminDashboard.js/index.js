import axios from "axios";
import DataTables from "datatables.net-dt";
import { useEffect, useMemo, useState } from "react";
import { getFrequencyPercentage, getNumberFrequencyPercentage, sortByClusterOrder, sortUserByCluser } from "../../helpers/ClusterHelper";
import { getLastWeekMonth } from "../../helpers/DateHelper";
import Table from './Table'
import './index.css'
import CustomCell from "./CustomCell";

const AdminDashboard = () => {
    const { lastWeek, lastMonth, lastYear } = getLastWeekMonth();

    const [reportType, setReportType] = useState('week')
    const [availableYear, setAvailableYear] = useState([])

    const [week, setWeek] = useState(51)
    const [month, setMonth] = useState(11)
    const [year, setYear] = useState(2022)

    const [tableData, setTableData] = useState([]);

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
            setTableData([])
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
            setTableData([])
        } else {
            sortData(data.data);
        }
    }

    const sortData = (data) => {
        //const table = document.getElementById('cluster-table');

        const sorted_clusters = sortUserByCluser(data);
        console.log(sorted_clusters);

        const table_data = [];

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

            const login_periods_percentages = getFrequencyPercentage(login_periods);
            const most_used_components_percentages = getFrequencyPercentage(most_used_components);
            const login_times_percentages = getNumberFrequencyPercentage(login_times, 'login');
            const manage_times_percentages = getNumberFrequencyPercentage(manage_times, 'manage');
            const schedule_times_percentages = getNumberFrequencyPercentage(schedule_times, 'schedule');

            console.log(login_periods_percentages)

            table_data.push({
                cluster: cluster,
                login_periods: login_periods_percentages,
                most_used_components: most_used_components_percentages,
                login_times: login_times_percentages,
                manage_times: manage_times_percentages,
                schedule_times: schedule_times_percentages
            })
        })

        table_data.sort(sortByClusterOrder);
        console.log('table_data', table_data)

        setTableData([...table_data]);
        /*
        table.innerHTML += '<tbody>'

        table_data.forEach(td => {
            table.innerHTML += '<tr>'
            table.innerHTML += '<td>' + td['cluster'] + '</td>'
            table.innerHTML += '<td>' + td['login_periods'] + '</td>'
            table.innerHTML += '<td>' + td['most_used_components'] + '</td>'
            table.innerHTML += '<td>' + td['login_times'] + '</td>'
            table.innerHTML += '<td>' + td['manage_times'] + '</td>'
            table.innerHTML += '<td>' + td['schedule_times'] + '</td>'
            table.innerHTML += '</tr>'
        })

        table.innerHTML += '</tbody>'
        */
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

                for(let i = min_year; i <= max_year; i++){
                    years.push(i);
                }

                setAvailableYear([...years]);
            }
        }

        fetchAvailablePeriod();
        fetchWeekReport();
    }, [])

    useEffect(() => {
        if(reportType == 'week'){
            fetchWeekReport();
        }else{
            fetchMonthReport();
        }
    }, [week, month, year, reportType])

    const columns = useMemo(() => [
        {
            Header: 'Cluster',
            accessor: 'cluster'
        },
        {
            Header: 'Login Periods',
            accessor: 'login_periods',
            Cell: ({ cell: { value } }) => <CustomCell value={value} />
        },
        {
            Header: 'Most Used Components',
            accessor: 'most_used_components',
            Cell: ({ cell: { value } }) => <CustomCell value={value} />
        },
        {
            Header: 'Login Times',
            accessor: 'login_times',
            Cell: ({ cell: { value } }) => <CustomCell value={value} />
        },
        {
            Header: 'Manage Times',
            accessor: 'manage_times',
            Cell: ({ cell: { value } }) => <CustomCell value={value} />
        },
        {
            Header: 'Schedule Times',
            accessor: 'schedule_times',
            Cell: ({ cell: { value } }) => <CustomCell value={value} />
        }
    ], [])

    const onTypeChange = (e) => {
        setReportType(e.target.value);
    }

    const onWeekMonthChange = (e) => {
        if(reportType == 'week'){
            setWeek(e.target.value)
        }else{
            setMonth(e.target.value)
        }
    }

    const onYearChange = (e) => {
        setYear(e.target.value)
    }

    return (
        <div>
            <div className="mb-5 d-flex align-items-center">
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="report-type" id="weekly" value='week' checked={reportType == 'week'} onChange={onTypeChange} />
                    <label className="form-check-label" htmlFor="weekly">
                        Weekly
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="report-type" id="monthly" value='month' checked={reportType == 'month'} onChange={onTypeChange} />
                    <label className="form-check-label" htmlFor="monthly">
                        Monthly
                    </label>
                </div>

                <div className='ms-4 d-flex align-items-center'>
                    <label className="text-uppercase fw-bolder me-3 ms-4">{reportType}</label>
                    <select className="form-select" onChange={onWeekMonthChange}>
                        {
                            reportType == 'week' ?
                            <>
                                {
                                    Array.from({length: 52}, (_, i) => i + 1).map((w, index) => {
                                        return <option key={index} value={w} selected={w == week}>{w}</option>
                                    })
                                }
                            </> :
                            <>
                                {
                                    Array.from({length: 12}, (_, i) => i + 1).map((m, index) => {
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
            {
                <Table columns={columns} data={tableData} />
            }
        </div>
    )
}

export default AdminDashboard;
