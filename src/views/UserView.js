import { useEffect, useState } from "react";
import Header from "../components/Header";
import useSettingStore from "../stores/SettingsStore";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import UserForm from "../components/UserForm/AddUserForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import AddUserForm from "../components/UserForm/AddUserForm";
import DeleteUserForm from "../components/UserForm/DeleteUserForm";
import EditUserForm from "../components/UserForm/EditUserForm";
import Alerts from "../components/Alerts";

const UserView = () => {
    const { settings } = useSettingStore();
    const [users, setUsers] = useState({ 'admin': [], 'user': [] })
    const [userType, setUserType] = useState('admin')

    const [actionUser, setActionUser] = useState({})

    useEffect(() => {
        const fetchUsers = async () => {
            const url = settings['api']['base_url'] + settings['api']['getUsers']

            const res = await fetch(url);

            const data = await res.json();
            const users = data.data;
            console.log(users)

            const newUsers = { 'admin': [], 'user': [] };

            users.map(user => {
                newUsers[user['user_type']].push(user)
            })

            setUsers({ ...newUsers })
        }

        fetchUsers();
    }, [])

    const changeUserType = (type) => {
        setUserType(type);
    }

    const actionsBody = (row) => {
        return (
            <div className="d-flex align-items-center">
                <FontAwesomeIcon className="cursor-pointer" icon={faPenToSquare} size='lg'
                    onClick={() => setActionUser(row)} data-bs-toggle="modal" data-bs-target="#edit-modal" />
                {
                    row.id != 22 ?
                        <FontAwesomeIcon className="ms-3 cursor-pointer" icon={faTrashCan} size='lg'
                            onClick={() => setActionUser(row)} data-bs-toggle="modal" data-bs-target="#delete-modal" /> :
                        null
                }
            </div>
        )
    }

    const footer = `Total ${users[userType].length} rows`

    return (
        <div>
            <Header />

            <div className="page-body">
                <Alerts />
                <h2 className="mb-5">Users</h2>

                <div className="mt-5 d-flex">
                    <div className="form-check form-check-inline ms-2">
                        <input className="form-check-input cursor-pointer" type="radio" name="user_type" id="admin" value="admin" checked={userType == 'admin'}
                            onChange={() => changeUserType('admin')} />
                        <label className="form-check-label cursor-pointer" for="admin">
                            Admin
                        </label>
                    </div>

                    <div className="form-check form-check-inline ms-4 cursor-pointer">
                        <input className="form-check-input cursor-pointer" type="radio" name="user_type" id="user" value="user" checked={userType == 'user'}
                            onChange={() => changeUserType('user')} />
                        <label className="form-check-label cursor-pointer" for="user">
                            User
                        </label>
                    </div>

                    <button className="btn btn-success ms-auto" data-bs-toggle="modal" data-bs-target="#add-modal">
                        Add new {userType}
                    </button>
                </div>

                <div className='mt-4'>
                    <DataTable value={users[userType]} paginator footer={footer} rows={10} stripedRows rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}>
                        <Column field='id' header='User ID' style={{ width: '10%', textAlign: 'center' }} />
                        <Column field='username' header='Username' style={{ width: '35%' }} />
                        <Column field='email' header='Email' style={{ width: '55%' }} />
                        <Column body={actionsBody} />
                    </DataTable>
                </div>
            </div>

            <AddUserForm userType={userType} users={users} />
            <EditUserForm actionUser={actionUser} users={users} />
            <DeleteUserForm actionUser={actionUser} />
        </div>
    )
}

export default UserView;
