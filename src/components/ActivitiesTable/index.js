import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useRef, useState } from 'react';
import useSettingStore from '../../stores/SettingsStore';

const ActivitiesTable = ({ activities, filterTable }) => {
    const { settings } = useSettingStore();
    const [showMonthDropdown, setMonthDropdown] = useState(false);
    const [showYearDropdown, setYearDropdown] = useState(false);

    const [monthRange, setMonthRange] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    const [yearRange, setYearRange] = useState([]);

    const [selectedMonths, setSelectedMonths] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    const [selectedYears, setSelectedYears] = useState([]);

    const [filterActivities, setFilterActivities] = useState([...activities])

    const monthRef = useRef(null);
    const yearRef = useRef(null);

    useEffect(() => {
        const fetchMinMaxDate = async() => {
            const url = settings['api']['base_url'] + settings['api']['getMinMaxDate']

            const res = await fetch(url);
            const data = await res.json();

            const min_year = parseInt(data.data.min_date.split(' ')[0].split('/')[2])   // 1/1/2022 11:57
            const max_year = parseInt(data.data.max_date.split(' ')[0].split('/')[2])

            const recordedYears = []

            for(let i = min_year; i <= max_year; i++){
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

            if(selectedMonths.includes(map[month-1]) && selectedYears.includes(year.toString())){
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

    const userIdHeaderTemplate = (row) => {
        return (
            <div className='d-flex align-items-center'>
                <div className='me-2'>User ID</div>
                <div className='position-relative custom-tooltip'>
                    <FontAwesomeIcon icon={faCircleQuestion} size='lg' />
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
            </div>
        )
    }

    const userIdBodyTemplate = (row) => {
        const classname = classNames({
            'text-primary': row.user_id == 22,
            'text-danger': row.user_id == 0
        })

        return <div className={classname}>{row.user_id}</div>
    }

    const footer = `Total ${filterActivities.length} rows`

    return (
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

                <button className='btn btn-secondary ms-auto px-4'>Go to cluster these users</button>
            </div>

            <div className='mt-5'>
                <DataTable value={filterActivities} paginator footer={footer} rows={10} stripedRows rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}>
                    <Column field='user_id' header={userIdHeaderTemplate} body={userIdBodyTemplate} style={{ width: '7%', textAlign: 'center' }} />
                    <Column field='date_time' header='Datetime' style={{ width: '8%' }} />
                    <Column field='date_timestamp' header='Timestamp' style={{ width: '7%' }} />
                    <Column field='code' header='Code' style={{ width: '10%' }} />
                    <Column field='code_id' header='Code ID' style={{ width: '20%' }} />
                    <Column field='message' header='Message' style={{ width: '38%' }} />
                    <Column field='ip_address' header='IP Address' style={{ width: '10%' }} />
                </DataTable>
            </div>
        </div>
    )
}

export default ActivitiesTable;
