import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';

const DefinationModel = ({ setIsOpen, kpi }) => {

    const baseUrl = 'http://98.130.44.68';
    const [data, setData] = useState([]);
    console.log(kpi);

    const checkSubclusterStatus = (task_id2) => {
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    const subclusterStatus = await axios.get(`${baseUrl}/projects/tasks/${task_id2}/status`);
                    if (subclusterStatus.data.status === "SUCCESS") {
                        clearInterval(intervalId);
                        resolve();
                    } else if (subclusterStatus.data.status === "FAILURE") {
                        reject(new Error("Subcluster task failed"));
                        clearInterval(intervalId);
                        throw new Error("Processing subcluster failed");
                    }
                } catch (err) {
                    clearInterval(intervalId);
                    reject(err);
                }
            }, 1000);
        });
    };

    const fetchData = async () => {
        try {
            const response = await axios.post(`${baseUrl}/projects/f90e7cde-e6fc-40b9-9f07-4d9ecc2dcede/features/weight`, {
                path: [],
                kpi: kpi
            });
            const task_id2 = response.data.task_id;
            // await checkSubclusterStatus(task_id2);
            const result = await axios.post(`${baseUrl}/projects/f90e7cde-e6fc-40b9-9f07-4d9ecc2dcede/features/weight/result`, {
                path: [],
                kpi: kpi
            });
            return result.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData().then(data => {
            if (data) {
                setData(data);
            }
        });
    }, []);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-700">Definition</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Table */}
                <div className="p-4 max-h-[80vh] overflow-y-auto">
                    <table className="w-full border">
                        <thead className='sticky -top-3 bg-white '>
                            <tr className="border">
                                <th className="text-left py-2 px-4 text-gray-600 font-medium border-r-2 border-b-2">Parameter</th>
                                <th className="text-left py-2 px-4 text-gray-600 font-medium border-b-2 ">Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row, index) => (
                                <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4 text-gray-800 border-r-2">{row.Feature}</td>
                                    <td className="py-2 px-4 text-gray-800 text-center">{row.Impact_Score.toFixed(3)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DefinationModel