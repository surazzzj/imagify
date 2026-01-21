import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from "framer-motion";
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const [state, setState] = useState('Login')
    const [loading, setLoading] = useState(false)

    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (loading) return; // prevent multiple clicks
        setLoading(true)

        try {
            let data;

            if (state === 'Login') {
                const res = await axios.post(
                    `${backendUrl}/api/user/login`,
                    { email, password }
                )
                data = res.data
            } else {
                const res = await axios.post(
                    `${backendUrl}/api/user/register`,
                    { name, email, password }
                )
                data = res.data
            }

            if (data.success) {
                setToken(data.token)
                setUser(data.user)

                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))

                setShowLogin(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message || 'Something went wrong. Try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form
                onSubmit={onSubmitHandler}
                initial={{ opacity: 0.2, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='relative bg-white p-10 rounded-xl text-slate-500'
            >

                <h1 className='text-center text-2xl text-neutral-700 font-medium'>
                    {state}
                </h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>

                {state !== 'Login' && (
                    <div className='border border-gray-200 px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img width={20} className='opacity-[40%]' src={assets.user_icon} alt="" />
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='outline-none text-sm'
                            type="text"
                            placeholder='Full Name'
                            required
                        />
                    </div>
                )}

                <div className='border border-gray-200 px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img width={15} src={assets.email_icon} alt="" />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='outline-none text-sm'
                        type="email"
                        placeholder='Email'
                        required
                    />
                </div>

                <div className='border border-gray-200 px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img width={13} src={assets.lock_icon} alt="" />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='outline-none text-sm'
                        type="password"
                        placeholder='Password'
                        required
                    />
                </div>

                <button
                    disabled={loading}
                    className={`w-full py-2 rounded-full mt-5 text-white transition 
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'}`}
                >
                    {loading ? 'Please wait...' : state === 'Login' ? 'Login' : 'Create Account'}
                </button>

                {state === 'Login' ? (
                    <p className='mt-5 text-center'>
                        Don't have an account?{' '}
                        <span onClick={() => setState('Sign Up')} className='text-blue-600 cursor-pointer'>
                            Sign up
                        </span>
                    </p>
                ) : (
                    <p className='mt-5 text-center'>
                        Already have an account?{' '}
                        <span onClick={() => setState('Login')} className='text-blue-600 cursor-pointer'>
                            Login
                        </span>
                    </p>
                )}

                <img
                    onClick={() => setShowLogin(false)}
                    className='absolute top-5 right-5 cursor-pointer'
                    src={assets.cross_icon}
                    alt=""
                />
            </motion.form>
        </div>
    )
}

export default Login
