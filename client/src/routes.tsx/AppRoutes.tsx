import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpCard from "../pages/signup_page";
import LoginCard from "../pages/login_page";
import PrivateRoute from "./ProtectedRoutes";
import Home from "../pages/Home";
import PublicRoute from "./PublicRoutes";


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes — logged-in users get redirected to /home */}
                <Route element={<PublicRoute />}>
                    <Route path="/" element={<LoginCard />} />
                    <Route path="/register" element={<SignUpCard />} />
                </Route>

                {/* Private Routes — logged-out users get redirected to / */}
                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}