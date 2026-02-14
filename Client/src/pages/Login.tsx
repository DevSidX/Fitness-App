import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Toaster } from 'react-hot-toast'

const Login = () => {

  const [state, setState] = useState('signup')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { login, signup, user } = useAppContext()  // provide services

  useEffect(() => {
    if (user) {
      navigate(`/`)  // if the user is available navigate it to home page
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (state === 'login') {
      await login({ email, password })
    } else {
      await signup({ username, email, password })
    }
    setIsSubmitting(false)
  }

  return (
    <>
      <Toaster />
      <main className='flex items-center justify-center w-full h-screen px-4 bg-white dark:bg-slate-950 transition-colors duration-200'>
        <form onSubmit={handleSubmit} className="flex w-full flex-col max-w-80">

          <h2 className='font-medium text-gray-900 text-center text-3xl dark:text-white'>
            {state === 'login' ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className='mt-2 text-sm text-gray-500/90 text-center dark:text-gray-400'>
            {state === 'login' ? 'Please enter email and password to access.' : 'Please enter your details to create an account.'}
          </p>
          {/* Username */}
          {state !== 'login' && (
            <div className="mt-4">
              <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Username</label>
              <div className='relative mt-2'>
                <AtSignIcon className='absolute left-3 top-1/2 translate-y-1/2 text-gray-400 size-4.5 mt-1' />
              </div>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                placeholder='Enter a username'
                className='pl-10 rounded-md ring ring-gray-200 dark:ring-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 outline-none p-2.5 w-full transition-all duration-200' required />
            </div>
          )}
          {/*Email */}
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Email</label>
            <div className='relative mt-2'>
              <MailIcon className='absolute left-3 top-1/2 translate-y-1/2 text-gray-400 size-4.5 mt-1' />
            </div>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='Enter your Email'
              className='pl-10 rounded-md ring ring-gray-200 dark:ring-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 outline-none p-2.5 w-full transition-all duration-200' required />
          </div>

          {/*Password */}
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Password</label>
            <div className='relative mt-2'>
              <LockIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5' />

              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? 'text' : 'password'} /* if true show password text otherwise ......*/
                placeholder='Enter your Password'
                className='pl-10 rounded-md ring ring-gray-200 dark:ring-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 outline-none p-2.5 w-full transition-all duration-200 pr-10' required />

              <button
                type='button'
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon />}

              </button>
            </div>
          </div>
          <button
            type='submit'
            disabled={isSubmitting}
            className='mt-6 py-2.5 w-full rounded-md bg-green-600 text-white transition hover:bg-green-700 disabled:opacity-60 text-sm;'>
            {isSubmitting ? 'Signing in...' : state === 'login' ? 'login' : 'signup'}
          </button>
          {state === 'login' ?
            (
              <p className='text-center p-6 text-sm text-gray-500 dark:textgray-400'>
                Don't have an account? <button className='ml-1 cursor-pointer text-green-600 hover:underline' onClick={() =>
                  setState('signup')}>Sign up</button>
              </p>
            ) : (
              <p className='text-center p-6 text-sm text-gray-500 dark:text-gray-400'>
                Already have an account? <button className='ml-1 cursor-pointer text-green-600 hover:underline' onClick={() => setState('login')}>Login</button>
              </p>
            )
          }

        </form>
      </main>
    </>
  )
}

export default Login