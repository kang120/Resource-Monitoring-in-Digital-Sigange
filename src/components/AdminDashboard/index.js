import cluster_img from './clusters.png'
import cluster1 from './cluster1.png'
import cluster2 from './cluster2.png'
import cluster3 from './cluster3.png'
import average_session from './average_session.png'
import average_spent_layout from './average_spent_layout.png'
import average_modify_layout from './average_modify_layout.png'
import './index.css'

const AdminDashboard = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const today = new Date();
    const day = dayNames[today.getDay()];
    const dd = today.getDate();
    const mm = monthNames[today.getMonth()];
    const yyyy = today.getFullYear()

    return (
        <div>
            <div className="d-flex align-items-start">
                <div>
                    <div className="d-flex align-items-end">
                        <h1 style={{ fontSize: '3em' }}>{dd + ' ' + mm + ' ' + yyyy}</h1>
                        <h3 className="ms-4 text-secondary">{day}</h3>
                    </div>
                </div>

                <div className="ms-auto border border-dark border-2 rounded-circle p-5 text-center bg-success">
                    <div className="text-light">
                        <h1 style={{ fontSize: '5em' }}>3</h1>
                        <h4>User Groups</h4>
                    </div>
                </div>
            </div>

            <div>
                <div className='text-danger font-monospace d-flex'>
                    User ID
                    <div className='position-relative custom-tooltip'>
                        &nbsp;22
                        <div className='tooltip-text'>
                            <div className='text-center'>Super Admin</div>
                        </div>
                    </div>
                    &nbsp;and&nbsp;
                    <div className='position-relative custom-tooltip'>
                        0&nbsp;
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
                    <img src={cluster_img} width="45%" />

                    <div className="accordion accordion-flush border-start" id="clusterAccordion" style={{ width: '55%' }}>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne"
                                    aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                    Cluster 1
                                    <span class="badge rounded-pill bg-success ms-3"><div style={{opacity: 0}}>-</div></span>
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                                <div className="accordion-body d-flex bg-light p-4">
                                    <div className='col-6'>
                                        <strong>Average Layout Pages Frequency: </strong><strong>92</strong><br />
                                        <strong>Average User Pages Frequency: </strong><strong>3</strong><br />
                                        <strong>Average Publish Pages Frequency: </strong><strong>84</strong><br />
                                        <strong>Average Device Pages Frequency: </strong><strong>26</strong><br />
                                        <strong>Average Group Device Pages Frequency: </strong><strong>0</strong><br />
                                        <strong>Average IDLE Frequency: </strong><strong>54</strong>
                                    </div>
                                    <div className='col-6'>
                                        <strong>Average Session: </strong><strong>165</strong><br />
                                        <strong>Average Layout Spent Times: </strong><strong>1919 minutes</strong><br />
                                        <strong>Average Modify Layout Frequency: </strong><strong>4</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo"
                                    aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                    Cluster 2
                                    <span class="badge rounded-pill bg-danger ms-3"><div style={{opacity: 0}}>-</div></span>
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                                <div className="accordion-body d-flex bg-light p-4">
                                    <div className='col-6'>
                                        <strong>Average Layout Pages Frequency: </strong><strong>4</strong><br />
                                        <strong>Average User Pages Frequency: </strong><strong>0</strong><br />
                                        <strong>Average Publish Pages Frequency: </strong><strong>3</strong><br />
                                        <strong>Average Device Pages Frequency: </strong><strong>2</strong><br />
                                        <strong>Average Group Device Pages Frequency: </strong><strong>0</strong><br />
                                        <strong>Average IDLE Frequency: </strong><strong>6</strong>
                                    </div>
                                    <div className='col-6'>
                                        <strong>Average Session: </strong><strong>12</strong><br />
                                        <strong>Average Layout Spent Times: </strong><strong>313 minutes</strong><br />
                                        <strong>Average Modify Layout Frequency: </strong><strong>7</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree"
                                    aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                                    Cluster 3
                                    <span class="badge rounded-pill bg-info ms-3"><div style={{opacity: 0}}>-</div></span>
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse">
                                <div className="accordion-body d-flex bg-light p-4">
                                    <div className='col-6'>
                                        <strong>Average Layout Pages Frequency: </strong><strong>22</strong><br />
                                        <strong>Average User Pages Frequency: </strong><strong>0</strong><br />
                                        <strong>Average Publish Pages Frequency: </strong><strong>40</strong><br />
                                        <strong>Average Device Pages Frequency: </strong><strong>55</strong><br />
                                        <strong>Average Group Device Pages Frequency: </strong><strong>2</strong><br />
                                        <strong>Average IDLE Frequency: </strong><strong>6</strong>
                                    </div>
                                    <div className='col-6'>
                                        <strong>Average Session: </strong><strong>77</strong><br />
                                        <strong>Average Layout Spent Times: </strong><strong>1685 minutes</strong><br />
                                        <strong>Average Modify Layout Frequency: </strong><strong>50</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h2>Average Visited Pages Frequency</h2>
                <div className="mt-4 p-5">
                    <div className='d-flex align-items-center justify-content-center flex-wrap'>
                        <img src={cluster1} />
                        <img src={cluster2} />
                        <img src={cluster3} />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className='d-flex align-items-center justify-content-center text-center flex-wrap'>
                    <div>
                        <h4>Average Session Count</h4>
                        <img src={average_session} />
                    </div>
                    <div>
                        <h4>Average Layout Spent Time</h4>
                        <img src={average_spent_layout} />
                    </div>
                    <div>
                        <h4>Average Modify Layout Count</h4>
                        <img src={average_modify_layout} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;
