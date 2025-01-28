import React from 'react'

const NoPage = () => {
  return (
    <div>
       <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
      >
        Go Back to Home
      </a>
    </div>
    </div>
  )
}

export default NoPage
