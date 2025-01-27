// import client from "../utils/axiosClient";
// import { toast } from "sonner";

const Header = () => {
    // const handleLogout = async () => {
    //     const toastLoader = toast.loading("Logging out...");
    //     try {
    //         await client.post("/api/login/user-logout");
    //         localStorage.removeItem("userData");
    //         toast.success("Logged out successfully!");
    //         window.location.href = "/";
    //     } catch (error: any) {
    //         if (error?.response && error?.response?.data) {
    //             alert(`Error: ${error.response.data.message}`);
    //         } else {
    //             alert("An error occurred. Please try again.");
    //         }
    //     } finally {
    //         toast.dismiss(toastLoader);
    //     }
    // }
    return (
        <div className="bg-gray-500 flex items-center justify-center text-white p-5 text-xl font-bold w-full">
            {/* Spacer to push "Get RC" to the center */}
            

            {/* Centered text */}
            <div className="flex-none text-center">
                Get RC
            </div>

            {/* Logout button */}
            
        </div>
    );
};

export default Header;
