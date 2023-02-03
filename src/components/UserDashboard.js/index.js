import { useEffect, useMemo, useRef, useState } from "react";
import Table from "./Table";
import './index.css'
import CustomStatusCell from "./CustomCell";

const columnMap = {
    'description': {
        Header: 'Device Description',
        accessor: 'description',
        order: 3
    },
    'timezone': {
        Header: 'Device Timezone',
        accessor: 'timezone',
        order: 4
    },
    'layout': {
        Header: 'Layout Played',
        accessor: 'layout_name',
        order: 5
    },
    'resolution': {
        Header: 'Screen Resolution',
        accessor: 'resolution',
        order: 6
    },
    'status': {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ cell: { value } }) => <CustomStatusCell value={value} />,
        order: 7
    }
}

const UserDashboard = ({ user_id }) => {
    const [tableData, setTableData] = useState([]);
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [filteredColumns, setFilteredColumns] = useState(['description', 'timezone', 'layout', 'resolution', 'status'])
    const [columns, setColumns] = useState([
        {
            Header: '#',
            accessor: (_row, i) => i + 1,
            order: 1
        },
        {
            Header: 'Device Name',
            accessor: 'device_name',
            order: 2
        },
        {
            Header: 'Device Description',
            accessor: 'description',
            order: 3
        },
        {
            Header: 'Device Timezone',
            accessor: 'timezone',
            order: 4
        },
        {
            Header: 'Layout Played',
            accessor: 'layout_name',
            order: 5
        },
        {
            Header: 'Screen Resolution',
            accessor: 'resolution',
            order: 6
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ cell: { value } }) => <CustomStatusCell value={value} />,
            order: 7
        }
    ])

    useEffect(() => {
        const fetchDevice = async () => {
            if(user_id == undefined){
                return;
            }

            const res = await fetch('http://localhost:2020/api/get_device_info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id
                })
            })

            const data = await res.json();

            console.log(data);

            if(data.message == 'Data not found'){
                setTableData([])
            }else{
                const devices = data.data;

                const arr = [];

                for(const row of devices){
                    const device_name = row['device_name'];
                    const description = row['description'];
                    const timezone = row['timezone'];

                    const property_json = JSON.parse(row['property_json'])

                    const layout_name = property_json['layout_name']
                    let resolution = '';

                    if(property_json['display'].length > 0){
                        resolution = property_json['display'][0]['resolution']
                    }else{
                        resolution = 'Unknown'
                    }

                    const status = await fetchStatus(row['hardware_id'])

                    arr.push({
                        device_name: device_name,
                        description: description,
                        timezone: timezone,
                        layout_name: layout_name,
                        resolution: resolution,
                        status: status
                    })
                }
                console.log('last', arr)

                setTableData([...arr]);
            }
        }

        const fetchStatus = async (hardware_id) => {
            const res2 = await fetch('http://localhost:2020/api/get_device_status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hardware_id: hardware_id
                })
            })

            const data2 = await res2.json();

            if(data2.message == 'Data not found'){
                return 'Unknown'
            }else{
                return data2.data
            }
        }

        fetchDevice();
    }, [user_id])



    const filterbox = useRef(null)

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (filterbox.current && !filterbox.current.contains(e.target)) {
                setShowCheckbox(false);
            }
        })
    }, [])

    const showCheckboxes = () => {
        setShowCheckbox(prev => !prev)
    }

    const sortColumnWithOrder = (a, b) => {
        if(a.order > b.order){
            return 1
        }else{
            return -1;
        }
    }

    const changeColumn = (e) => {
        const value = e.target.value;

        if(filteredColumns.includes(value)){
            setFilteredColumns(prev => {
                const newArr = prev.filter(p => p != value);

                return [...newArr]
            })

            setColumns(prev => {
                const newArr = prev.filter(p => JSON.stringify(p) != JSON.stringify(columnMap[value]));
                newArr.sort(sortColumnWithOrder)

                return [...newArr]
            })
        }else{
            setFilteredColumns(prev => [...prev, value]);

            setColumns(prev => {
                const newArr = [...prev, columnMap[value]]
                newArr.sort(sortColumnWithOrder)

                return [...newArr]
            })
        }
    }

    const exportToCSV = () => {
        const output_data = []
        const title = Object.keys(tableData[0]);

        output_data.push(title);

        tableData.forEach(td => {
            output_data.push(Object.values(td))
        })

        let csvContent = 'data:text/csv;charset=utf-8,'

        output_data.forEach(row => {
            csvContent += row.join(',') + '\r\n'
        })

        var encodedUri = encodeURI(csvContent);

        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "MyDevices.csv");
        document.body.appendChild(link);

        link.click();
    }

    return (
        <div>
            <div className="mb-5 d-flex align-items-center">
                <label className="me-4 text-nowrap">Filter Column: </label>
                <div className="filter-box" ref={filterbox}>
                    <div className="select-box" onClick={showCheckboxes}>
                        <select>
                            <option selected>Filter Columns</option>
                        </select>
                        <div className="overSelect"></div>
                    </div>
                    <div className={`checkboxes checkboxes-${showCheckbox ? 'show' : 'hide'}`}>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" value="description" id="description" onChange={changeColumn} checked={filteredColumns.includes('description')} />
                            <label className="form-check-label text-nowrap" for="description">Device Description</label>
                        </div>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" value="timezone" id="timezone" onChange={changeColumn} checked={filteredColumns.includes('timezone')} />
                            <label className="form-check-label" for="timezone">Device Timezone</label>
                        </div>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" value="layout" id="layout" onChange={changeColumn} checked={filteredColumns.includes('layout')} />
                            <label className="form-check-label" for="layout">Layout Played</label>
                        </div>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" value="resolution" id="resolution" onChange={changeColumn} checked={filteredColumns.includes('resolution')} />
                            <label className="form-check-label" for="resolution">Screen Resolution</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="status" id="status" onChange={changeColumn} checked={filteredColumns.includes('status')} />
                            <label className="form-check-label" for="status">Device Status</label>
                        </div>
                    </div>
                </div>


                <div className="ms-auto">
                    <button className="btn btn-dark px-4" onClick={exportToCSV}>Export to CSV</button>
                </div>
            </div>
            {
                <Table columns={columns} data={tableData} />
            }
        </div>
    )
}

export default UserDashboard;
