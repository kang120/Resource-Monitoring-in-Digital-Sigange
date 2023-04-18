import cluster_img from './clusters.png'
import cluster1 from './cluster1.png'
import cluster2 from './cluster2.png'
import cluster3 from './cluster3.png'
import average_session from './average_session.png'
import average_spent_layout from './average_spent_layout.png'
import average_modify_layout from './average_modify_layout.png'
import './index.css'
import { useEffect, useState } from 'react'
import BarChart from '../Charts/BarChart'
import PieChart from '../Charts/PieChart'
import DoughnutChart from '../Charts/DoughnutChart'
import useSettingStore from '../../stores/SettingsStore'
import ScatterChart from '../Charts/ScatterChart'

const AdminDashboard = () => {
    const { settings } = useSettingStore();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const today = new Date();
    const day = dayNames[today.getDay()];
    const dd = today.getDate();
    const mm = monthNames[today.getMonth()];
    const yyyy = today.getFullYear()


    const colorMaps = ['red', 'green', 'blue', 'yellow', 'orange'];

    const [userGroup, setUserGroup] = useState(0)
    const [clusters, setClusters] = useState([])
    const [clusterDiagramData, setClusterDiagramData] = useState({ data: [], cmaps: [] });
    const [visitedPagesFrequency, setVisitedPagesFrequency] = useState([])
    const [sessionCount, setSessionCount] = useState([])
    const [layoutSpentTimes, setLayoutSpentTimes] = useState([])
    const [modifyLayoutCount, setModifyLayoutCount] = useState([])

    useEffect(() => {
        const fetchReport = async () => {
            const url = settings['api']['base_url'] + settings['api']['getMonthCluster']

            const res = await fetch(url)

            const data = await res.json();

            setUserGroup(data.data['user_group'])
            setClusters(JSON.parse(data.data['clusters']))

            const clusterPoints = JSON.parse(data.data['cluster_diagram'])

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

    return (
        <div>
            <div className="d-flex align-items-start">
                <div>
                    <div className="d-flex align-items-end">
                        <h1 style={{ fontSize: '3em' }}>{dd + ' ' + mm + ' ' + yyyy}</h1>
                        <h3 className="ms-4 text-secondary">{day}</h3>
                    </div>
                </div>

                <div className="ms-auto border border-dark border-1 rounded-circle p-5 text-center" style={{ background: 'rgba(53, 148, 69, 0.5)' }}>
                    <div className="text-light">
                        <h1 style={{ fontSize: '5em' }}>{userGroup}</h1>
                        <h4>User Groups</h4>
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
                        &nbsp;<span class="badge rounded-pill text-bg-primary cursor-pointer">22</span>
                        <div className='tooltip-text'>
                            <div className='text-center'>Super Admin</div>
                        </div>
                    </div>
                    &nbsp;and&nbsp;
                    <div className='position-relative custom-tooltip'>
                        <span class="badge rounded-pill text-bg-danger cursor-pointer">0</span>&nbsp;
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
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`}
                                            aria-expanded="true" aria-controls={`collapse-${index}`}>
                                            Cluster {index + 1}
                                            <span class="badge rounded-pill ms-3" style={{ background: colorMaps[index] }}><div style={{ opacity: 0 }}>-</div></span>
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
                <div className="mt-4 p-5">
                    <div className='d-flex align-items-center justify-content-center flex-wrap'>
                        {
                            visitedPagesFrequency.map((vpf, index) => (
                                <div className='ms-5 mt-5'>
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
    )
}

export default AdminDashboard;
