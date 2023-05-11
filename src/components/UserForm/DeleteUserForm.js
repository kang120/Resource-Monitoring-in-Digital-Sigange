import { useNavigate } from "react-router-dom";
import useSettingStore from "../../stores/SettingsStore"

const DeleteUserForm = ({ actionUser }) => {
    const { settings } = useSettingStore();

    const navigate = useNavigate();

    const deleteUser = async () => {
        navigate(0);
        window.localStorage.setItem('visited', false)
        window.localStorage.setItem('alert_message_type', 'success')
        window.localStorage.setItem('alert_message', 'Successfully delete user ' + actionUser['username'])

        const url = settings['api'][`${process.env.NODE_ENV}_base_url`] + settings['api']['deleteUser']
        console.log(url)

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Type': 'application/json'
            },
            body: JSON.stringify({
                user: {
                    user_id: actionUser['id'],
                }
            })
        })
    }

    return (
        <div id='delete-modal' className="modal" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete user</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure to delete user <strong>{actionUser['username']}</strong>?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteUser}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteUserForm;
