
import { useEffect, useState } from 'react';
import caricon from '../assets/car.png'
import Pagination from './Pagination';
import client from '../utils/axiosClient';
import { toast } from 'sonner';
import { getDate, getTime } from '../utils/getDateTime';
import Header from './Header';
import GetRcModal from './GetRcModal';

const AgentDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [isGetRcModelOpen, setIsGetRcModelOpen] = useState(false)
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [userData, setUserData] = useState<any>();
    const [transactionsData, setTransactionsData] = useState<any[]>([]);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);  // Pagination state
    const itemsPerPage = 10;  // Number of transactions per page

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await client.get("/api/dashboard/get-user-dashboard-data");
            setUserData(res?.data?.userData);
            setTransactionsData(res?.data?.transactions);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, [success, isGetRcModelOpen]);

    const handleDownloadBulkRc = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const toastLoading = toast.loading("Uploading CSV and Downloading Bulk RC...");
        try {
            if (!e.target.files || e.target.files.length === 0) {
                toast.error("Please select a CSV file.");
                return;
            }
            const file = e?.target?.files[0];
            if (!file) {
                toast.error("Please select a CSV file.");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            // Make the API call
            const res = await client.post(
                "/api/dashboard/get-bulk-rc",
                formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob",
            }
            );
            setSuccess(true)

            // Create a link to download the ZIP file
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Bulk_RCs_${Date.now()}.zip`);
            document.body.appendChild(link);
            link.click(); // Trigger download
            link.remove(); // Cleanup
            window.URL.revokeObjectURL(url);

            // Notify success
            toast.success("Bulk RC Downloaded Successfully!");
            await fetchDashboardData()
        } catch (error: any) {
            try {
                // If the response is a blob, parse it to get the error message
                if (error.response?.data instanceof Blob) {
                    const blob = error.response.data;
                    const text = await blob.text();
                    const errorData = JSON.parse(text);
                    console.error("Parsed Error Message:", errorData.message);
                    toast.error(`Failed to download RC: ${errorData.message}`);
                } else {
                    // Fallback to default error handling
                    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
                    console.error("Error Message:", errorMessage);
                    toast.error(`Failed to download RC: ${errorMessage}`);
                }
            } catch (parsingError) {
                console.error("Error parsing error response:", parsingError);
                toast.error("Failed to download RC. Please try again.");
            }
        } finally {
            toast.dismiss(toastLoading);
            setLoading(false);
            setSuccess(null)
        }
    };

    const setRcModalOpen = () => {
        if (vehicleNumber?.length < 4) {
            toast.error("Please enter vehicle number")
            return
        }
        setIsGetRcModelOpen(true)
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = transactionsData.slice(startIndex, startIndex + itemsPerPage);
    return (
        <>
            <div className="  bg-gradient-to-b  min-h-[90vh] from-cyan-200 to-white ">
                <Header />
                {/* User Info and Input Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:px-20 px-5 md:py-10 py-5">
                    {/* User Info */}
                    <div className="p-5 md:text-xl  md:gap-4 gap-2 flex flex-col border border-gray-500 bg-white rounded-lg shadow">
                        <p><strong >Name</strong>: {userData?.fullname || "NA"}</p>
                        <p><strong>Mob No.</strong>: +91-{userData?.mobile}</p>
                        <p><strong>Wallet Balance</strong>: {userData?.balance} Rs</p>
                    </div>

                    {/* Get RC Section */}

                    <div className="md:p-6 p-2 bg-white border border-gray-500 rounded-lg shadow flex flex-col gap-2 items-center">
                        <div className="flex w-full gap-3">
                            <img src={caricon} alt="Car" className="w-10 h-10 " />
                            <div className=" flex flex-col w-full justify-end gap-5">
                                <input
                                    type="text"
                                    placeholder="Enter Vehicle Number"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
                                    style={{ textTransform: "uppercase" }} // Inline style for fallback
                                    onChange={(e) =>
                                        setVehicleNumber(e.target.value.toUpperCase())}
                                />
                                <button className="md:px-10 md:hidden  px-2 py-2 bg-blue-500 whitespace-nowrap text-white font-semibold rounded hover:bg-blue-600" onClick={setRcModalOpen}>
                                    {loading ? "Loading..." : "Get RC"}
                                </button>
                            </div>
                            <button className="md:px-20 px-2 hidden md:flex py-2 bg-blue-500 whitespace-nowrap text-white font-semibold rounded hover:bg-blue-600" onClick={setRcModalOpen}>
                                {loading ? "Loading..." : "Get RC"}
                            </button>
                        </div>

                        <div className="flex md:gap-4 gap-2 mt-3 items-center text-sm justify-end w-full">
                            <h3 className="mg:text-xl text-sm font-bold ">For&nbsp;Bulk&nbsp;RC</h3>

                            <a className="bg-purple-500 text-white py-2 md:px-10 px-3 rounded font-semibold hover:bg-purple-600" href='/modifiedSample Vrn.csv' download={true}>
                                Sample&nbsp;CSV
                            </a>
                            <label
                                htmlFor='downloadBulkRcInput'
                                className="bg-green-500 text-white py-2 md:px-10 px-3 font-semibold rounded hover:bg-green-600 cursor-pointer">
                                Upload&nbsp;CSV
                            </label>
                            <input
                                type="file"
                                accept=".csv"
                                className='hidden'
                                id='downloadBulkRcInput'
                                onChange={handleDownloadBulkRc}
                            />

                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="md:px-20 px-2 md:pb-10 pb-5">
                    <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
                    <div className="border-t border-black">
                        {paginatedTransactions.map((transaction, index) => (
                            <div
                                key={index}
                                className={`flex md:p-4 p-2 md:gap-5 gap-2 items-center md:text-lg text-sm my-4 border-2 rounded-xl ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} ${transaction?.transactionType === "debit" ? "border-red-500" : "border-gray-500"}`}
                            >
                                <img src={caricon} alt="Car" className="md:w-8 md:h-8 w-4 h-4" />
                                <div className="flex justify-between items-center w-full">
                                    <div className="md:w-28">{transaction?.vehicleNumber}</div>
                                    <div className="md:w-24">{getDate(transaction?.createdAt)}</div>
                                    <div className="md:w-24">{getTime(transaction?.createdAt)}</div>
                                    <div className="md:w-24">{transaction?.amount}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        totalPages={Math.ceil(transactionsData.length / itemsPerPage)}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                    />
                </div>
            </div>

            {/* get rc modal */}
            {
                isGetRcModelOpen && <GetRcModal
                    setIsModalOpen={setIsGetRcModelOpen}
                    vehicleNumber={vehicleNumber}
                    setSuccess={setSuccess}
                />
            }
        </>
    );
};

export default AgentDashboard;
