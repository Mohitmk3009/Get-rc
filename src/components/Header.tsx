import { useNavigate } from "react-router-dom";
import client from "../utils/axiosClient";
import { toast } from "sonner";

const Header = () => {
    // const navigate = useNavigate();
    const handleLogout = async () => {
        const toastLoader = toast.loading("Logging out...");
        try {
            const response = await client.post("/api/login/user-logout");
            toast.success("Logged out successfully!");
            // navigate("/");
        } catch (error: any) {
            if (error?.response && error?.response?.data) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("An error occurred. Please try again.");
            }
        } finally {
            toast.dismiss(toastLoader);
        }
    }
    return (
        <div className="bg-gray-500 flex items-center justify-between text-white p-4 text-xl font-bold w-full">
            {/* Spacer to push "Get RC" to the center */}
            <div className="flex-1"></div>

            {/* Centered text */}
            <div className="flex-none text-center">
                Get RC
            </div>

            {/* Logout button */}
            <div className="flex-1 flex justify-end">
                <button className="px-6 py-2 bg-white text-black rounded-lg" onClick={handleLogout}>
                    {/* <button className="px-6 py-2 bg-white text-black rounded-lg" > */}
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Header;
