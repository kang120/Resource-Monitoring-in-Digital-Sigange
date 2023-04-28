import { useEffect, useState } from 'react'
import BarChart from '../components/Charts/BarChart'
import PieChart from '../components/Charts/PieChart'
import DoughnutChart from '../components/Charts/DoughnutChart'
import ScatterChart from '../components/Charts/ScatterChart'
import useSettingStore from '../stores/SettingsStore'
import Header from '../components/Header'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Alerts from '../components/Alerts'

const ReportView = () => {
    const { settings } = useSettingStore();
    const { id } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const [pageNotFound, setPageNotFound] = useState(false)

    const colorMaps = ['red', 'green', 'blue', 'yellow', 'orange'];

    const [reportName, setReportName] = useState('')
    const [clusterPeriod, setClusterPeriod] = useState({ month: [], year: [] })
    const [userGroup, setUserGroup] = useState(0)
    const [clusters, setClusters] = useState([])
    const [clusterPoints, setClusterPoints] = useState([])
    const [clusterDiagramData, setClusterDiagramData] = useState({ data: [], cmaps: [] });
    const [visitedPagesFrequency, setVisitedPagesFrequency] = useState([])
    const [sessionCount, setSessionCount] = useState([])
    const [layoutSpentTimes, setLayoutSpentTimes] = useState([])
    const [modifyLayoutCount, setModifyLayoutCount] = useState([])

    const [saveReportName, setSaveReportName] = useState('')
    const [saveReportNameError, setSaveReportNameError] = useState('')

    useEffect(() => {
        const fetchReport = async () => {
            const url = settings['api']['base_url'] + settings['api']['getClusterReport']

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            })

            const data = await res.json();

            if (id === 2 || data.data === 'Data not found') {
                setPageNotFound(true)

                return
            } else if (id === 1 && location.state === undefined) {
                setPageNotFound(true)

                return
            }

            setReportName(data.data['name'])
            setClusterPeriod(JSON.parse(data.data['cluster_period']))
            setUserGroup(data.data['user_group'])
            setClusters(JSON.parse(data.data['clusters']))

            const temp = JSON.parse(data.data['cluster_diagram'])
            setClusterPoints([...temp])

            const dataPoints = []
            const cmaps = []

            temp.forEach(cp => {
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
        }

        fetchReport();
    }, [])

    useEffect(() => {
        const pages = []
        const sessions = []
        const layoutTimes = []
        const modifyLayout = []

        clusters.forEach(cluster => {
            const temp = []

            temp.push(cluster['average_layout_page_frequency']);
            temp.push(cluster['average_user_page_frequency']);
            temp.push(cluster['average_publish_page_frequency']);
            temp.push(cluster['average_device_page_frequency']);
            temp.push(cluster['average_group_device_page_frequency']);
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
    }, [clusters])

    const submitForm = () => {
        if (saveReportName == '') {
            setSaveReportNameError('Please provide a report name')
        } else {
            navigate(0)
            saveReport()
        }
    }

    const saveReport = async () => {
        const url = settings['api']['base_url'] + settings['api']['saveReport']
        window.localStorage.setItem('visited', false)
        window.localStorage.setItem('alert_message_type', 'success')
        window.localStorage.setItem('alert_message', 'Successfully save report ' + saveReportName)

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
                cluster_diagram: JSON.stringify(clusterPoints),
                cluster_period: JSON.stringify(clusterPeriod),
                date_time: today
            })
        })
    }

    return (
        <div>
            <Header />

            <div className="page-body">
                <Alerts />
                {
                    pageNotFound ?
                        <div className='position-fixed top-50 start-50 translate-middle'>
                            <h1>Page Not Found</h1>
                        </div> :
                        <div>
                            <div className="d-flex align-items-start">
                                <div>
                                    {
                                        id == 1 ?
                                            null :
                                            <h1 style={{ fontSize: '3.6em' }}>{reportName}</h1>
                                    }
                                    <div className="alert alert-warning mt-5" role="alert">
                                        Clustering Months:&nbsp;&nbsp;
                                        {
                                            clusterPeriod['month'].map((month, index) => {
                                                if (index != clusterPeriod['month'].length - 1) {
                                                    return <span key={index}>{month + ', '}</span>
                                                } else {
                                                    return <span key={index}>{month}</span>
                                                }
                                            })
                                        }
                                    </div>
                                    <div className="alert alert-warning" role="alert">
                                        Clustering Years:&nbsp;&nbsp;
                                        {
                                            clusterPeriod['year'].map((year, index) => {
                                                if (index != clusterPeriod['year'].length - 1) {
                                                    return <span key={index}>{year + ', '}</span>
                                                } else {
                                                    return <span key={index}>{year}</span>
                                                }
                                            })
                                        }
                                    </div>
                                    {
                                        id == 1 ?
                                            <button className='btn btn-primary mt-4 px-4' data-bs-toggle="modal" data-bs-target="#save-result-modal">
                                                Save this result
                                            </button> :
                                            null
                                    }
                                </div>

                                <div className="ms-auto border border-dark border-1 rounded-circle p-5 text-center" style={{ background: 'rgba(53, 148, 69, 0.5)' }}>
                                    <div className="text-light">
                                        <h1 style={{ fontSize: '5em' }}>{userGroup}</h1>
                                        <h4>User Groups</h4>
                                    </div>
                                </div>
                            </div>

                            <div>
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

                            <div className="mt-5">
                                <h2>User Cluster</h2>
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
                                                                <strong>Average Device Pages Frequency: </strong><strong>{c['average_device_page_frequency']}</strong><br />
                                                                <strong>Average Group Device Pages Frequency: </strong><strong>{c['average_group_device_page_frequency']}</strong><br />
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
                                            <DoughnutChart data={sessionCount} xlabels={clusters.map((c, index) => `Cluster ${index + 1}`)} />
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
                                            <PieChart data={modifyLayoutCount} xlabels={clusters.map((c, index) => `Cluster ${index + 1}`)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                }
            </div>

            <div id='save-result-modal' className="modal" tabindex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Save result</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure to save this result</p>
                            <div className='mt-4'>
                                <label for="name" className="form-label">Report Name</label>
                                <input class={`form-control ${saveReportNameError != '' ? 'is-invalid' : ''}`} id="name"
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

export default ReportView;
