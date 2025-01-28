import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Hash, Network } from 'lucide-react';
import UploadCom from "../Components/UploadCom";

export default function Configuration() {
    const [activeTab, setActiveTab] = useState("dataMappings");
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <motion.div 
            className="p-4 sm:p-6 max-w-7xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Configuration Section */}
            <motion.h2 
                className="text-xl font-bold text-gray-900 mb-4"
                variants={itemVariants}
            >
                Configuration
            </motion.h2>
            <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-8 mt-2"
                variants={itemVariants}
            >
                {Array.from({ length: 1 }).map((_, i) => (
                    <motion.div 
                        key={i} 
                        className="rounded-lg overflow-hidden ring-[1px] ring-gray-200 bg-white"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img
                            src={`https://companieslogo.com/img/orig/APARINDS.NS_BIG-0ae30472.png?t=1720244490`}
                            alt={`Configuration thumbnail ${i + 1}`}
                            className="w-full h-[70px] object-contain px-2 py-1"
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Upload Data Section */}
            <motion.div 
                className="mt-8"
                variants={itemVariants}
            >
                <motion.h2 
                    className="text-xl font-bold text-gray-900 mb-4"
                    variants={itemVariants}
                >
                    Upload data
                </motion.h2>
                <UploadCom />

                {/* Tabs */}
                <motion.div 
                    className="border-b border-gray-200 mt-4"
                    variants={itemVariants}
                >
                    <div className="flex flex-wrap gap-2 sm:gap-4 mb-2">
                        <motion.button
                            className={`text-black flex items-center ring-1 ring-gray-300 px-2 py-1 rounded-md text-sm sm:text-base ${activeTab === "dataMappings" ? "bg-gray-200" : ""}`}
                            onClick={() => setActiveTab("dataMappings")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Data Mappings <Network className="h-4 w-4 ml-2" />
                        </motion.button>
                        <motion.button
                            className={`text-black flex items-center ring-1 ring-gray-300 px-2 py-1 rounded-md text-sm sm:text-base ${activeTab === "keyParameters" ? "bg-gray-200" : ""}`}
                            onClick={() => setActiveTab("keyParameters")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Key parameters/Calculations <Hash className="h-4 w-4 ml-2" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div 
                    className="mt-4 overflow-x-auto"
                    variants={itemVariants}
                >
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {activeTab === "dataMappings" ? "Field Name" : "Parameter Name"}
                                </th>
                                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {activeTab === "dataMappings" ? "Parameters" : "Calculation"}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <motion.tr 
                                    key={i}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activeTab === "dataMappings" ? `Field ${i + 1}` : `Parameter ${i + 1}`}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activeTab === "dataMappings" ? `Parameter ${i + 1}` : `Calculation ${i + 1}`}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
                {/* Analyze Button */}
                <motion.div 
                    className="mt-4 flex justify-start"
                    variants={itemVariants}
                >
                    <motion.button
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 cursor-pointer"
                        onClick={() => navigate('/analysis')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Analyze
                        <div className="text-xl ml-2">⌘</div>
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
