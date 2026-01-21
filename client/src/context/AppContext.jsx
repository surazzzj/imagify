import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const isGeneratingRef = useRef(false);

    /* ---------------- LOAD CREDITS ---------------- */
    const loadCreditsData = async () => {
        if (!token) return;

        try {
            const { data } = await axios.get(
                `${backendUrl}/api/user/credits`,
                {
                    headers: { token },
                    timeout: 8000
                }
            );

            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (error) {
            console.error(error);
            toast.error('Unable to fetch user data');
        }
    };

    /* ---------------- GENERATE IMAGE ---------------- */
    const generateImage = async (prompt) => {
        if (!prompt || isGeneratingRef.current) return;

        isGeneratingRef.current = true;

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/image/generate-image`,
                { prompt },
                {
                    headers: { token },
                    timeout: 20000
                }
            );

            if (data.success) {
                loadCreditsData();
                return data.resultImage;
            } else {
                toast.error(data.message);
                if (data.creditBalance === 0) {
                    navigate('/buy');
                }
            }
        } catch (error) {
            toast.error('Image generation failed. Try again.');
        } finally {
            isGeneratingRef.current = false;
        }
    };

    /* ---------------- LOGOUT ---------------- */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken('');
        setUser(null);
        setCredit(false);
    };

    /* ---------------- FIXED CREDIT LOAD ---------------- */
    useEffect(() => {
        if (token) {
            loadCreditsData(); // always load after login/signup
        }
    }, [token]);

    const value = {
        user, setUser,
        showLogin, setShowLogin,
        backendUrl,
        token, setToken,
        credit, setCredit,
        loadCreditsData,
        logout,
        generateImage
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;

