import { useEffect, useState } from "react";
import Header from "../components/Header";
import useSettingStore from "../stores/SettingsStore";
import ScatterChart from "../components/Charts/ScatterChart";
import { useNavigate } from "react-router-dom";
import Alerts from "../components/Alerts";

const ReportListView = () => {
    const [isLoading, setLoading] = useState(true)
    const { settings } = useSettingStore();
    const base_url = settings[`${process.env.NODE_ENV}_base_url`]

    const navigate = useNavigate();

    const [clusterReports, setClusterReports] = useState([]);
    const [clusterDiagramData, setClusterDiagramData] = useState([]);

    const colorMaps = ['#ff9f40', '#4bc0c0', '#36a2eb', '#9966ff', '#e6e47a', '#f0968d', '#9A208C', '#F7D060', '#98D8AA', '#FC4F00'];

    const [actionReport, setActionReport] = useState({});

    useEffect(() => {
        const user = JSON.parse(window.sessionStorage.getItem('auth'));

        if (user == null) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        const fetchReports = async () => {
            const url = settings['api'][`${process.env.NODE_ENV}_base_url`] + settings['api']['getClusterReports']
            console.log(url)

            const res = await fetch(url)

            const data = await res.json();

            const reports = data.data;

            const cr = []
            const cdd = []

            reports.forEach(report => {
                if (report['id'] == 1 || report['id'] == 2) {
                    return
                }

                var cluster_period = 'All';

                try{
                    cluster_period = JSON.parse(report['cluster_period'])
                }catch{
                    console.log('This is monthly report')
                }

                cr.push({
                    id: report['id'],
                    name: report['name'],
                    userGroup: report['user_group'],
                    clusterPeriods: cluster_period,
                    date: report['date_time']
                })

                const clusterDiagram = JSON.parse(report['cluster_diagram'])

                const dataPoints = []
                const cmaps = []

                console.log(clusterDiagram);

                clusterDiagram.forEach(cp => {
                    dataPoints.push({
                        x: cp[0],
                        y: cp[1]
                    })

                    cmaps.push(colorMaps[cp['cluster']])
                })

                cdd.push({
                    data: [...dataPoints],
                    cmaps: [...cmaps]
                })
            })

            setClusterReports([...cr])
            setClusterDiagramData([...cdd])

            setLoading(false)
        }

        fetchReports();
    }, [])

    const deleteReport = async () => {
        const url = settings['api'][`${process.env.NODE_ENV}_base_url`] + settings['api']['deleteReport']
        console.log(url)

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Type': 'application/json'
            },
            body: JSON.stringify({
                id: actionReport['id'],
            })
        })

        const data = res.json();

        console.log(data)

        window.localStorage.setItem('visited', false)
        window.localStorage.setItem('alert_message_type', 'success')
        window.localStorage.setItem('alert_message', 'Successfully delete report ' + actionReport['name'])
        navigate(0);
    }

    return (
        <div>
            <Header />

            <div className="page-body">

                {isLoading ?
                    <div className="loading-text d-flex align-items-center">
                        <div className="spinner-border text-dark me-3" role="status">
                            <span className="visually-hidden">Loading Data...</span>
                        </div>
                        Loading Data
                    </div>
                    :
                    <>
                        <Alerts />

                        {
                            clusterReports.length == 0 ?
                                <div>
                                    No report saved
                                </div>
                                :
                                null
                        }

                        <div className="row d-flex mt-5">
                            {
                                clusterReports.map((report, index) => (
                                    <div key={index} className="p-4 col-4">
                                        <div className="card">
                                            <div style={{ height: '250px' }}>
                                                <ScatterChart data={clusterDiagramData[index]['data']} cmaps={clusterDiagramData[index]['cmaps']} />
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title text-primary">{report['name']}</h5>
                                                <p className="card-text">User Group: <strong className="text-success">{report['userGroup']}</strong></p>
                                                <p className="card-text">Cluster Months: &nbsp;&nbsp;
                                                    {
                                                        report['clusterPeriods'] == 'All' ?
                                                            <span className="text-info"><strong>All</strong></span>
                                                            :
                                                            report['clusterPeriods']['month'].map((month, index) => {
                                                                if (index != report['clusterPeriods']['month'].length - 1) {
                                                                    return <span key={index} className="text-info"><strong>{month + ', '}</strong></span>
                                                                } else {
                                                                    return <span key={index} className="text-info"><strong>{month}</strong></span>
                                                                }
                                                            })
                                                    }
                                                </p>
                                                <p className="card-text">Cluster Years: &nbsp;&nbsp;
                                                    {
                                                        report['clusterPeriods'] == 'All' ?
                                                            <span className="text-info"><strong>All</strong></span>
                                                            :
                                                            report['clusterPeriods']['year'].map((year, index) => {
                                                                if (index != report['clusterPeriods']['year'].length - 1) {
                                                                    return <span key={index} className="text-danger"><strong>{year + ', '}</strong></span>
                                                                } else {
                                                                    return <span key={index} className="text-danger"><strong>{year}</strong></span>
                                                                }
                                                            })
                                                    }
                                                </p>
                                                <div className="d-flex align-items-center">
                                                    <a href={`${base_url}/report/${report['id']}`} className="btn btn-primary ms-auto">View Report</a>
                                                    <button className="btn btn-danger ms-3 px-4" onClick={() => setActionReport(report)}
                                                        data-bs-toggle="modal" data-bs-target="#delete-modal">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                }
            </div>

            <div id='delete-modal' className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete report</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure to delete report <strong>{actionReport['name']}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteReport}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportListView;
