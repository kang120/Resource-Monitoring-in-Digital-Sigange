import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './index.css'
import { useEffect, useState } from 'react';

const AnalysisTable = ({ analysisData, analysisNumericData }) => {

    const [isNumeric, setIsNumeric] = useState(false);

    return (
        <div className='mt-5'>
            <div className="form-check form-switch mb-4">
                <input className="form-check-input cursor-pointer" type="checkbox" role="switch" id="numeric-switch"
                       onChange={() => setIsNumeric(!isNumeric)} />
                <label className="form-check-label cursor-pointer" htmlFor="numeric-switch">Show Numeric Data</label>
            </div>

            <DataTable value={isNumeric ? analysisNumericData : analysisData} stripedRows>
                <Column field='Cluster' header='Cluster' style={{ width: '7%', textAlign: 'center' }} />
                <Column field='Session Count' header='Session Count' style={{ width: '10%', textAlign: 'center' }} />
                <Column field='Layout Management Preference' header='Layout Management Preference' style={{ width: '10%', textAlign: 'center' }} />
                <Column field='View Only Preference' header='View Only Preference' style={{ width: '10%', textAlign: 'center' }} />
                <Column field='Layout Management Spent Time' header='Layout Management Spent Time' style={{ width: '10%', textAlign: 'center' }} />
            </DataTable>
        </div>
    )
}

export default AnalysisTable;
