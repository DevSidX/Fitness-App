import { createContext, useContext, useState, useEffect } from "react";
import { initialState, type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
// import mockApi from "../assets/mockApi";
import api from "../config/api";
import toast from "react-hot-toast";

const AppContext = createContext(initialState)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {

    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null)
    const [isUserFetched, setIsUserFetched] = useState(localStorage.getItem('token') ? false : true)
    const [onboardingCompleted, setOnboardingCompleted] = useState(false)
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([])
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([])

    const signup = async (credentials: Credentials) => {
        try {
            const { data } = await api.post('/api/auth/local/register', credentials)
            setUser({ ...data.user, token: data.jwt })//

            if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
                setOnboardingCompleted(true)
            }
            localStorage.setItem('token', data.jwt)  // after signup it will set the token in local storage
            api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`//

        } catch (error: any) {
            console.log(error);
            const message = error?.response?.data?.error?.message || error.message || "Something went wrong";
            toast.error(message);
            return;
        }
    }

    const login = async (credentials: Credentials) => {

        try {
            const { data } = await api.post('/api/auth/local', {
                identifier: credentials.email,
                password: credentials.password
            })
            setUser({ ...data.user, token: data.jwt })

            if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
                setOnboardingCompleted(true)
            }
            localStorage.setItem('token', data.jwt)
            api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`//
            toast.success("Login successful")

        } catch (error: any) {
            console.log(error);
            const backendMessage = error?.response?.data?.error?.message;
            if (backendMessage === "Invalid identifier or password") {
                toast.error("User not registered. Please sign up first.");
            } else {
                toast.error(backendMessage || "Login failed");
            }
            return;
        }
    }

    const fetchUser = async (token: string) => {
        try {
            const { data } = await api.get('/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUser({ ...data, token })

            if (data?.age && data?.weight && data?.goal) {
                setOnboardingCompleted(true)
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`//

        } catch (error: any) {
            console.log(error);
            const message = error?.response?.data?.error?.message || error.message || "Session expired. Please login again";
            toast.error(message);
            localStorage.removeItem('token')
            setUser(null)
        } finally {
            setIsUserFetched(true)
        }
    }

    const fetchFoodLogs = async (token: string) => {
        try {
            const { data } = await api.get('/api/food-logs', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAllFoodLogs(data)
        } catch (error: any) {
            console.log(error);
            const message = error?.response?.data?.error?.message || error.message || "Something went wrong";
            toast.error(message);
            return;
        }
    }

    const fetchActivityLogs = async (token: string) => {
        try {
            const { data } = await api.get('/api/activity-logs', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAllActivityLogs(data)
        } catch (error: any) {
            console.log(error);
            const message = error?.response?.data?.error?.message || error.message || "Something went wrong";
            toast.error(message);
            return;
        }
    }

    const logout = async () => {
        localStorage.removeItem('token')
        setUser(null)
        setOnboardingCompleted(false)
        delete api.defaults.headers.common['Authorization']
        navigate(`/`)
        toast.success('Logged out successfully')
    }

    //fetch the user when the token is available
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            (async () => {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`

                await fetchUser(token)
                await fetchFoodLogs(token)
                await fetchActivityLogs(token)
            })()
        } else {
            setIsUserFetched(true) // user fetching is finished
        }
    }, [])

    const value = {
        user,
        setUser,
        isUserFetched,
        fetchUser,
        signup,
        login,
        logout,
        onboardingCompleted,
        setOnboardingCompleted,
        allFoodLogs,
        allActivityLogs,
        setAllActivityLogs,
        setAllFoodLogs
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
