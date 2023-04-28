import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import useSettingStore from "../stores/SettingsStore";
import ActivitiesTable from "../components/ActivitiesTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Alerts from "../components/Alerts";

const ActivitiesView = () => {
    const [isLoading, setLoading] = useState(true)
    const [isClustering, setClustering] = useState(false)
    const { settings } = useSettingStore()

    const [activities, setActivities] = useState([])
    const [filterActivities, setFilterActivities] = useState([])

    const [showMonthDropdown, setMonthDropdown] = useState(false);
    const [showYearDropdown, setYearDropdown] = useState(false);

    const [monthRange, ] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    const [yearRange, setYearRange] = useState([]);

    const [selectedMonths, setSelectedMonths] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    const [selectedYears, setSelectedYears] = useState([]);

    const monthRef = useRef(null);
    const yearRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(window.sessionStorage.getItem('auth'));
        console.log('first')

        if (user == null) {
            console.log('testtttt')
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        const fetchUserActivities = async () => {
            const url = settings['api']['base_url'] + settings['api']['getUserActivities']

            const res = await fetch(url)

            const data = await res.json()

            setActivities(data.data)
            setFilterActivities(data.data)

            setLoading(false)
        }

        fetchUserActivities()
    }, [])

    useEffect(() => {
        const fetchMinMaxDate = async () => {
            const url = settings['api']['base_url'] + settings['api']['getMinMaxDate']

            const res = await fetch(url);
            const data = await res.json();

            const min_year = parseInt(data.data.min_date.split(' ')[0].split('/')[2])   // 1/1/2022 11:57
            const max_year = parseInt(data.data.max_date.split(' ')[0].split('/')[2])

            const recordedYears = []

            for (let i = min_year; i <= max_year; i++) {
                recordedYears.push(i.toString());
            }

            setYearRange([...recordedYears])
            setSelectedYears([...recordedYears])
        }

        fetchMinMaxDate();

        document.addEventListener('click', (e) => {
            if (monthRef.current && !monthRef.current.contains(e.target)) {
                setMonthDropdown(false);
            }

            if (yearRef.current && !yearRef.current.contains(e.target)) {
                setYearDropdown(false);
            }
        })
    }, [])

    useEffect(() => {
        const temp = [];

        activities.forEach(act => {
            const date = act['date_time'].split(' ')[0]   //  1/27/2022 17:14
            const month = date.split('/')[0]
            const year = date.split('/')[2]

            const map = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

            if (selectedMonths.includes(map[month - 1]) && selectedYears.includes(year.toString())) {
                temp.push(act)
            }
        })

        setFilterActivities([...temp])
    }, [selectedMonths, selectedYears])

    const toggleMonthDropdown = () => {
        setMonthDropdown(prev => !prev)
    }

    const toggleYearDropdown = () => {
        setYearDropdown(prev => !prev)
    }

    const onMonthChange = (e) => {
        const value = e.target.value;

        setSelectedMonths(prev => {
            if (e.target.checked) {
                return [...prev, value];
            } else {
                return prev.filter(month => month != value);
            }
        })
    }

    const onYearChange = (e) => {
        const value = e.target.value;

        setSelectedYears(prev => {
            if (e.target.checked) {
                return [...prev, value];
            } else {
                return prev.filter(year => year != value);
            }
        })
    }

    const toggleAllMonth = (e) => {
        if (e.target.checked) {
            setSelectedMonths([...monthRange]);
        } else {
            setSelectedMonths([]);
        }
    }

    const toggleAllYear = (e) => {
        if (e.target.checked) {
            setSelectedYears([...yearRange]);
        } else {
            setSelectedYears([]);
        }
    }

    const customClustering = async () => {
        setClustering(true)

        const url = settings['api']['base_url'] + settings['api']['customClustering']
        const filterDate = {
            'month': selectedMonths,
            'year': selectedYears
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Type': 'application/json'
            },
            body: JSON.stringify({
                filterDate: filterDate
            })
        })

        const data = await res.json();

        if (data.data == 'Success') {
            navigate('/report/1', {
                state: {
                    isClusteringResult: true
                }
            })

            setClustering(false)
        } else {
            navigate(0)
            window.localStorage.setItem('visited', false)
            window.localStorage.setItem('alert_message_type', 'danger')
            window.localStorage.setItem('alert_message', 'Dataset selected not suitable for clustering. Please try again.')

            setClustering(false)
        }
    }

    return (
        <div className={isClustering ? 'clustering' : ''}>
            <Header />

            <div className="page-body">
                <Alerts />
                <h2 className="mb-5">Activities Data</h2>

                {
                    isLoading ?
                        <div className="loading-text d-flex align-items-center">
                            <div className="spinner-border text-dark me-5" style={{ width: '5rem', height: '5rem' }} role="status">
                                <span className="visually-hidden">Loading Data...</span>
                            </div>
                            Loading Data
                        </div> :
                        <div>
                            <div className='d-flex align-items-center'>
                                <div className='d-flex align-items-center'>
                                    <label>Month: </label>
                                    <div ref={monthRef} className='position-relative ms-3'>
                                        <div className='border ps-4 pe-2 py-1 rounded-1 d-flex align-items-center' style={{ cursor: 'pointer' }} onClick={toggleMonthDropdown}>
                                            Select Month
                                            <div className={`icon ${showMonthDropdown ? 'icon-active' : ''}`}>
                                                <FontAwesomeIcon icon={faAngleDown} />
                                            </div>
                                        </div>

                                        <div className={`dropdown ${showMonthDropdown ? 'dropdown-active' : ''}`}>
                                            <div className='d-flex align-items center mt-3 mb-4'>
                                                <input id='check-all-month' className="form-check-input" type="checkbox" checked={selectedMonths.length == 12}
                                                    onChange={(e) => toggleAllMonth(e)} />
                                                <label className="form-check-label ms-3 text-danger" htmlFor='check-all-month'>
                                                    Check All
                                                </label>
                                            </div>
                                            {
                                                monthRange.map((month, index) => (
                                                    <div key={index} className='d-flex align-items center mt-3'>
                                                        <input id={`month${month}`} className="form-check-input" type="checkbox" value={month} checked={selectedMonths.includes(month)}
                                                            onChange={(e) => onMonthChange(e)} />
                                                        <label className="form-check-label ms-3" htmlFor={`month${month}`}>
                                                            {month}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex align-items-center ms-5'>
                                    <label>Year: </label>
                                    <div ref={yearRef} className='position-relative ms-3'>
                                        <div className='border ps-4 pe-2 py-1 rounded-1 d-flex align-items-center' style={{ cursor: 'pointer' }} onClick={toggleYearDropdown}>
                                            Select Year
                                            <div className={`icon ${showYearDropdown ? 'icon-active' : ''}`}>
                                                <FontAwesomeIcon icon={faAngleDown} />
                                            </div>
                                        </div>

                                        <div className={`dropdown ${showYearDropdown ? 'dropdown-active' : ''}`}>
                                            <div className='d-flex align-items center mt-3 mb-4'>
                                                <input id='check-all-year' className="form-check-input" type="checkbox" checked={selectedYears.length == yearRange.length}
                                                    onChange={(e) => toggleAllYear(e)} />
                                                <label className="form-check-label ms-3 text-danger" htmlFor='check-all-year'>
                                                    Check All
                                                </label>
                                            </div>
                                            {
                                                yearRange.map((year, index) => (
                                                    <div key={index} className='d-flex align-items center mt-3'>
                                                        <input id={`year_${year}`} className="form-check-input" type="checkbox" value={year} checked={selectedYears.includes(year)}
                                                            onChange={(e) => onYearChange(e)} />
                                                        <label className="form-check-label ms-3" htmlFor={`year_${year}`}>
                                                            {year}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>

                                <button className='btn btn-secondary ms-auto px-4' data-bs-toggle="modal" data-bs-target="#custom-cluster">Go to cluster these users</button>
                            </div>
                            <ActivitiesTable filterActivities={filterActivities} />
                        </div>
                }
            </div>

            <div id='custom-cluster' className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Custom Clustering</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                filterActivities.length == 0 ?
                                    <p>There are no activities to cluster</p> :
                                    <>
                                        <p>Are you sure to cluster the users within these datetime?</p>
                                        <p>Month:
                                            <span className="text-success">&nbsp; &nbsp; {
                                                selectedMonths.map((month, index) => {
                                                    if (index != selectedMonths.length - 1) {
                                                        return <span key={index}>{month + ', '}</span>
                                                    } else {
                                                        return <span key={index}>{month}</span>
                                                    }
                                                })
                                            }
                                            </span>
                                        </p>
                                        <p>Year:
                                            <span className="text-success">&nbsp; &nbsp; {
                                                selectedYears.map((year, index) => {
                                                    if (index != selectedYears.length - 1) {
                                                        return <span key={index}>{year + ', '}</span>
                                                    } else {
                                                        return <span key={index}>{year}</span>
                                                    }
                                                })
                                            }
                                            </span>
                                        </p>
                                    </>
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {
                                filterActivities.length != 0 ?
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={customClustering}>Yes</button> : null
                            }
                        </div>
                    </div>
                </div>
            </div>

            {
                isClustering ?
                    <div className="position-fixed top-0 w-100 h-100" style={{ background: 'rgba(217, 217, 217, 0.7)' }}>
                        <div className="loading-text d-flex align-items-center">
                            <div className="spinner-border text-success me-5" style={{ width: '5rem', height: '5rem' }} role="status">
                                <span className="visually-hidden">Wait for clustering...</span>
                            </div>
                            <div className="text-dark fw-bold">
                                Wait for clustering...
                            </div>
                        </div>
                    </div>
                    : null
            }
        </div >
    )
}

export default ActivitiesView;
