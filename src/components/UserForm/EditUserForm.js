import { useEffect, useState } from "react";
import useSettingStore from "../../stores/SettingsStore";
import { useNavigate } from "react-router-dom";

const EditUserForm = ({ actionUser, users }) => {
    const { settings } = useSettingStore();

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const [changePassword, setChangePassword] = useState(false);

    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [password2Error, setPassword2Error] = useState('')

    const navigate = useNavigate();

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const updateUser = async () => {
        const url = settings['api'][`${process.env.NODE_ENV}_base_url`] + settings['api']['updateUser']
        console.log(url)

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: actionUser['id'],
                username: username,
                email: email,
                password: password
            })
        })

        const data = await res.json();

        console.log(data)
        window.localStorage.setItem('visited', false)
        window.localStorage.setItem('alert_message_type', 'success')
        window.localStorage.setItem('alert_message', 'Successfully update user ' + username)
    }

    const submitForm = async (e) => {
        let submitFlag = true;
        let userExist = false;
        let emailExist = false;

        users['admin'].forEach(user => {
            if (user['username'] == username && username != actionUser['username']) {
                userExist = true
            }

            if (user['email'] == email && email != actionUser['email']) {
                emailExist = true
            }
        })

        users['user'].forEach(user => {
            if (user['username'] == username && username != actionUser['username']) {
                userExist = true
            }

            if (user['email'] == email && email != actionUser['email']) {
                emailExist = true
            }
        })

        if (username == '') {
            setUsernameError('Please fill in this field')
            submitFlag = false;
        } else if (username.length < 8 || username.length > 20) {
            setUsernameError('Username length must between 8 and 20')
            submitFlag = false;
        } else if (userExist) {
            setUsernameError('Username exists')
            submitFlag = false;
        } else {
            setUsernameError('')
        }

        if (email == '') {
            setEmailError('Please fill in this field')
            submitFlag = false;
        } else if (!validateEmail(email)) {
            setEmailError('Please fill in valid email')
            submitFlag = false;
        } else if (emailExist) {
            setEmailError('Email exist')
            submitFlag = false;
        } else {
            setEmailError('')
        }

        if (changePassword == false) {
            setPasswordError('')
        } else if (password == '') {
            setPasswordError('Please fill in this field')
            submitFlag = false;
        } else if (password.length < 8 || password.length > 12) {
            setPasswordError('Username length must between 8 and 12')
            submitFlag = false;
        } else {
            setPasswordError('')
        }

        if (changePassword == false) {
            setPasswordError('')
        } else if (password2 == '') {
            setPassword2Error('Please fill in this field')
            submitFlag = false;
        } else if (password2 != password) {
            setPassword2Error('Please fill in same password')
            submitFlag = false;
        } else {
            setPassword2Error('')
        }

        if (submitFlag) {
            await updateUser();
            navigate(0)
            //document.getElementById("edit-submit-btn").click();
        }
    }

    useEffect(() => {
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity() || usernameError != '' || emailError != '' || passwordError != '' || password2Error != '') {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    }, [])

    useEffect(() => {
        setUsername(actionUser['username'])
        setEmail(actionUser['email'])
    }, [actionUser])

    return (
        <div className="modal fade" id="edit-modal" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit User</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form id='edit-form' className="needs-validation" noValidate>
                            <div className="mb-3">
                                <label htmlFor="edit-username" className="form-label">Username</label>
                                <input type="text" className={`form-control ${usernameError != '' ? 'is-invalid' : ''}`} id="edit-username" placeholder="username"
                                    onChange={(e) => setUsername(e.target.value)} value={username} required />
                                <div className="invalid-feedback">
                                    {usernameError}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="edit-email" className="form-label">Email</label>
                                <input type="email" className={`form-control ${emailError != '' ? 'is-invalid' : ''}`} id="edit-email" placeholder="email@gmail.com"
                                    onChange={(e) => setEmail(e.target.value)} value={email} required />
                                <div className="invalid-feedback">
                                    {emailError}
                                </div>
                            </div>

                            <div className="form-check form-switch mt-4">
                                <input className="form-check-input cursor-pointer" type="checkbox" role="switch" id="change-pw" checked={changePassword}
                                    onChange={() => setChangePassword(prev => !prev)} />
                                <label className="form-check-label cursor-pointer" htmlFor="change-pw">Change Password</label>
                            </div>

                            {
                                changePassword ?
                                    <div className="mt-4">
                                        <div className="mb-3">
                                            <label htmlFor="edit-password" className="form-label">New Password</label>
                                            <input type="password" className={`form-control ${passwordError != '' ? 'is-invalid' : ''}`} id="edit-password" placeholder="password"
                                                onChange={(e) => setPassword(e.target.value)} value={password} required />
                                            <div className="invalid-feedback">
                                                {passwordError}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="edit-password2" className="form-label">Confirmed Password</label>
                                            <input type="password" className={`form-control ${password2Error != '' ? 'is-invalid' : ''}`} id="edit-password2" placeholder="confirmed password"
                                                onChange={(e) => setPassword2(e.target.value)} value={password2} required />
                                            <div className="invalid-feedback">
                                                {password2Error}
                                            </div>
                                        </div>
                                    </div> : null
                            }


                            <button id='edit-submit-btn' className="btn btn-primary d-none" type="submit">Submit form</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={(e) => submitForm(e)}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditUserForm;
