import React from 'react'

const DefinationModel = ({ setIsOpen }) => {

    const data = [
        { parameter: "Parameter 1", weight: "2.4" },
        { parameter: "Parameter 2", weight: "3.6" },
        { parameter: "Parameter 3", weight: "1.8" },
    ]

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
                <div className="p-4">
                    <table className="w-full border">
                        <thead>
                            <tr className="border">
                                <th className="text-left py-2 px-4 text-gray-600 font-medium border-r-2">Parameter</th>
                                <th className="text-left py-2 px-4 text-gray-600 font-medium">Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4 text-gray-800 border-r-2">{row.parameter}</td>
                                    <td className="py-2 px-4 text-gray-800">{row.weight}</td>
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