import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/image/screenplify-logo.svg'
import useSessionStore from '../stores/sessionStore';

const LoginView = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setAuth } = useSessionStore();

    const navigate = useNavigate();

    const [loginError, setLoginError] = useState('')

    const onSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const auth = {
            email: email,
            password: password
        }

        console.log(JSON.stringify(auth))

        const res = await fetch('http://localhost:2020/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Type': 'application/json'
            },
            body: JSON.stringify(auth)
        })

        const data = await res.json();

        console.log(data);

        if (data.message == 'Incorrect Login') {
            setLoginError('Incorrect Login')
        } else {
            setLoginError('')

            const user = {
                user_id: data.data.id,
                user_type: data.data.user_type,
            }

            setAuth(user)

            window.sessionStorage.setItem('auth', JSON.stringify(user))
            navigate('/dashboard')
        }
    }

    useEffect(() => {
        const forms = document.querySelectorAll('.needs-validation')

        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    }, [])

    return (
        <div className="app container-fluid">
            <div className='row h-100'>
                <div className='col-4 sidebar'>
                    <a id="logo" className="navbar-brand" href="">
                        <img src={logo} width="40" height="40" className="mr-2" />
                    </a>

                    <div className='d-block text-center text-block'>
                        <p className='subheader'>All-In-One Digital Signage Solution.</p>
                        <p className='welcome-heading'>Welcome to Screenplify</p>
                    </div>
                </div>
                <div className='col-8 main-content'>
                    <div className='login-box'>
                        <h2>Please Login</h2>
                        <p className='login-subheader mb-5 mt-2'>Enter your details below</p>
                        {
                            loginError != '' &&
                            <div className="alert alert-danger mb-5">
                                <p>Incorrect Login</p>
                            </div>
                        }
                        <form className='needs-validation' onSubmit={e => onSubmit(e)} noValidate>
                            <div>
                                <label htmlFor='email' className='form-label text-uppercase'>Email</label>
                                <input id='email' type='email' className='form-control' placeholder='Email' onChange={e => setEmail(e.target.value)} required />
                                <div className="invalid-feedback">
                                    Please provide a valid email
                                </div>
                            </div>
                            <div className='mt-4'>
                                <label htmlFor='password' className='form-label text-uppercase'>Password</label>
                                <input id='password' type='password' className='form-control' placeholder='Password' onChange={e => setPassword(e.target.value)} required />
                                <div className="invalid-feedback">
                                    Please provide a password
                                </div>
                            </div>
                            <button type='submit' className='btn btn-warning rounded mt-5'>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginView;
