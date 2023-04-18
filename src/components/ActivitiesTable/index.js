import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';

const ActivitiesTable = ({ filterActivities }) => {


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
    )
}

export default ActivitiesTable;
