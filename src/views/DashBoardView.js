import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Alerts from "../components/Alerts";
import useSettingStore from "../stores/SettingsStore";
import ScatterChart from "../components/Charts/ScatterChart";
import BarChart from "../components/Charts/BarChart";
import DoughnutChart from "../components/Charts/DoughnutChart";
import PieChart from "../components/Charts/PieChart";

const DashBoardView = () => {
    const [isLoading, setLoading] = useState(true)
    const { settings } = useSettingStore();
    const navigate = useNavigate();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const today = new Date();
    const day = dayNames[today.getDay()];
    const dd = today.getDate();
    const mm = monthNames[today.getMonth()];
    const yyyy = today.getFullYear()

    const colorMaps = ['#ff9f40', '#4bc0c0', '#36a2eb', '#9966ff', '#e6e47a', '#f0968d', '#9A208C', '#F7D060', '#98D8AA', '#FC4F00'];

    const [userGroup, setUserGroup] = useState(0)
    const [clusters, setClusters] = useState([])
    const [clusterDiagram, setClusterDiagram] = useState([])
    const [clusterDiagramData, setClusterDiagramData] = useState({ data: [], cmaps: [] });
    const [visitedPagesFrequency, setVisitedPagesFrequency] = useState([])
    const [sessionCount, setSessionCount] = useState([])
    const [layoutSpentTimes, setLayoutSpentTimes] = useState([])
    const [modifyLayoutCount, setModifyLayoutCount] = useState([])

    const [saveReportName, setSaveReportName] = useState('')
    const [saveReportNameError, setSaveReportNameError] = useState('')

    useEffect(() => {
        const fetchReport = async () => {
            const url = settings['api'][`${process.env.NODE_ENV}_base_url`] + settings['api']['getMonthCluster']
            console.log(url)

            const res = await fetch(url)

            const data = await res.json();

            const clusters = JSON.parse(data.data['clusters'])

            setUserGroup(data.data['user_group'])
            setClusters([...clusters])

            const clusterPoints = JSON.parse(data.data['cluster_diagram'])
            setClusterDiagram([...clusterPoints]);

            const dataPoints = []
            const cmaps = []

            clusterPoints.forEach(cp => {
                dataPoints.push({
                    x: cp[0],
                    y: cp[1]
                })

                cmaps.push(colorMaps[cp['cluster']])
            })

            setClusterDiagramData({
                data: [...dataPoints],
                cmaps: [...cmaps]
            })

            const pages = []
            const sessions = []
            const layoutTimes = []
            const modifyLayout = []

            clusters.forEach(cluster => {
                const temp = []

                temp.push(cluster['average_layout_page_frequency']);
                temp.push(cluster['average_user_page_frequency']);
                temp.push(cluster['average_publish_page_frequency']);
                temp.push(cluster['average_devices_page_frequency']);
                temp.push(cluster['average_group_devices_page_frequency']);
                temp.push(cluster['average_idle_frequency']);

                pages.push(temp);

                sessions.push(cluster['average_login_session'])
                layoutTimes.push(cluster['average_layout_spent_time'])
                modifyLayout.push(cluster['average_modify_layout_time'])
            })

            setVisitedPagesFrequency([...pages]);
            setSessionCount([...sessions])
            setLayoutSpentTimes([...layoutTimes])
            setModifyLayoutCount([...modifyLayout])

            setLoading(false)
        }

        fetchReport();
    }, [])

    useEffect(() => {
        const user = JSON.parse(window.sessionStorage.getItem('auth'));

        if (user == null) {
            navigate('/login')
        }
    }, [])

    const submitForm = () => {
        if (saveReportName == '') {
            setSaveReportNameError('Please provide a report name')
        } else {
            saveReport()
        }
    }

    const saveReport = async () => {
        const url = settings['api'][`${process.env.NODE_ENV}_base_url`] + settings['api']['saveReport']
        console.log(url)

        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Type': 'application/json'
            },
            body: JSON.stringify({
                name: saveReportName,
                user_group: userGroup,
                clusters: JSON.stringify(clusters),
                cluster_diagram: JSON.stringify(clusterDiagram),
                cluster_period: 'All',
                date_time: today
            })
        })

        const data = await res.json();

        console.log(data)

        window.localStorage.setItem('visited', false)
        window.localStorage.setItem('alert_message_type', 'success')
        window.localStorage.setItem('alert_message', 'Successfully save report ' + saveReportName)
        navigate(0)
    }

    const gotoAnalysis = () => {
        navigate('/analysis', {
            state: {
                clusters: clusters
            }
        })
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
                    <div>
                        <Alerts />
                        <div className="d-flex align-items-start">
                            <div>
                                <div className="d-flex align-items-end">
                                    <h1 style={{ fontSize: '3em' }}>{dd + ' ' + mm + ' ' + yyyy}</h1>
                                    <h3 className="ms-4 text-secondary">{day}</h3>
                                </div>
                            </div>

                            <div className="group-number-box ms-auto border border-dark border-1 rounded-circle px-3 text-center">
                                <div className="text-light">
                                    <h1 style={{ fontSize: '5em' }}><strong>{userGroup}</strong></h1>
                                    <h6>User Groups</h6>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='text-danger font-monospace d-flex'>
                                * This clustering result is started from 17 September 2019
                            </div>

                            <div className='text-danger font-monospace d-flex mt-4'>
                                * User ID
                                <div className='position-relative custom-tooltip'>
                                    &nbsp;<span className="badge rounded-pill text-bg-primary cursor-pointer">22</span>
                                    <div className='tooltip-text'>
                                        <div className='text-center'>Super Admin</div>
                                    </div>
                                </div>
                                &nbsp;and&nbsp;
                                <div className='position-relative custom-tooltip'>
                                    <span className="badge rounded-pill text-bg-danger cursor-pointer">0</span>&nbsp;
                                    <div className='tooltip-text'>
                                        <div className='text-center'>Fail Login User</div>
                                    </div>
                                </div>
                                are excluded in clustering
                            </div>


                            <div className='tooltip-text'>
                                <div className='d-flex justify-content-center'>
                                    <div className='text-info'>22&nbsp;&nbsp;</div>
                                    <div>Super Admin</div>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <div className='text-danger'>0&nbsp;&nbsp;</div>
                                    <div>Fail Login User</div>
                                </div>
                            </div>
                        </div>
                        <button className='btn btn-primary mt-4 px-4' data-bs-toggle="modal" data-bs-target="#save-result-modal">
                            Save this result
                        </button>

                        <div className="mt-5">
                            <div className='d-flex align-items-center'>
                                <h2>User Cluster</h2>
                                <button className='btn btn-primary ms-auto' onClick={gotoAnalysis}>View Analysis</button>
                            </div>
                            <div className="mt-4 border border-secondary border-2 border-opacity-25 rounded d-flex cluster-container">
                                <div className='p-4' style={{ width: '45%' }}>
                                    <ScatterChart data={clusterDiagramData['data']} cmaps={clusterDiagramData['cmaps']} />
                                </div>

                                <div className="accordion accordion-flush border-start" id="clusterAccordion" style={{ width: '55%' }}>
                                    {
                                        clusters.map((c, index) => (
                                            <div key={index} className="accordion-item">
                                                <h2 className="accordion-header">
                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`}
                                                        aria-expanded="true" aria-controls={`collapse-${index}`}>
                                                        Cluster {index + 1}
                                                        <span className="badge rounded-pill ms-3" style={{ background: colorMaps[index] }}><div style={{ opacity: 0 }}>-</div></span>
                                                    </button>
                                                </h2>
                                                <div id={`collapse-${index}`} className={`accordion-collapse collapse ${index == 0 ? 'show' : ''}`}>
                                                    <div className="accordion-body d-flex bg-light p-4">
                                                        <div className='col-6'>
                                                            <strong>Average Layout Pages Frequency: </strong><strong>{c['average_layout_page_frequency']}</strong><br />
                                                            <strong>Average User Pages Frequency: </strong><strong>{c['average_user_page_frequency']}</strong><br />
                                                            <strong>Average Publish Pages Frequency: </strong><strong>{c['average_publish_page_frequency']}</strong><br />
                                                            <strong>Average Device Pages Frequency: </strong><strong>{c['average_devices_page_frequency']}</strong><br />
                                                            <strong>Average Group Device Pages Frequency: </strong><strong>{c['average_group_devices_page_frequency']}</strong><br />
                                                            <strong>Average IDLE Frequency: </strong><strong>{c['average_idle_frequency']}</strong>
                                                        </div>
                                                        <div className='col-6'>
                                                            <strong>Average Session: </strong><strong>{c['average_login_session']}</strong><br />
                                                            <strong>Average Layout Spent Times: </strong><strong>{c['average_layout_spent_time']} minutes</strong><br />
                                                            <strong>Average Modify Layout Frequency: </strong><strong>{c['average_modify_layout_time']}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2>Average Visited Pages Frequency</h2>
                            <div className="mt-4">
                                <div className='d-flex align-items-center justify-content-center flex-wrap'>
                                    {
                                        visitedPagesFrequency.map((vpf, index) => (
                                            <div key={index} className='ms-5 mt-5'>
                                                <BarChart key={index} data={vpf} xlabels={['Layout', 'User', 'Publish', 'Device', 'Group Device', 'IDLE',]}
                                                    label={'frequency'} />
                                                <div className='text-center mt-4'><strong>Cluster {index + 1}</strong></div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className='d-flex align-items-start justify-content-center text-center flex-wrap'>
                                <div className='p-5'>
                                    <h4>Average Session Count</h4>
                                    <div className='mt-5'>
                                        <DoughnutChart data={modifyLayoutCount} xlabels={clusters.map((c, index) => `Cluster ${index + 1}`)} />
                                    </div>
                                </div>
                                <div className='p-5'>
                                    <h4>Average Layout Spent Time</h4>
                                    <div className='mt-5'>
                                        <BarChart data={layoutSpentTimes} xlabels={clusters.map((c, index) => `Cluster ${index + 1}`)} label={'minutes'} />
                                    </div>
                                </div>
                                <div className='p-5'>
                                    <h4>Average Modify Layout Count</h4>
                                    <div className='mt-5'>
                                        <PieChart data={sessionCount} xlabels={clusters.map((c, index) => `Cluster ${index + 1}`)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div id='save-result-modal' className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Save result</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure to save this result</p>
                            <div className='mt-4'>
                                <label htmlFor="name" className="form-label">Report Name</label>
                                <input className={`form-control ${saveReportNameError != '' ? 'is-invalid' : ''}`} id="name"
                                    onChange={(e) => setSaveReportName(e.target.value)} value={saveReportName}
                                    placeholder="report name" required />
                                <div className="invalid-feedback">
                                    {saveReportNameError}
                                </div>
                            </div>
                            <button id='submit-btn' className="btn btn-primary d-none" type="submit">Submit form</button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={submitForm}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashBoardView;
