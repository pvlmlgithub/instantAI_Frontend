import React from 'react';
import { Home, Layers, Network } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const AppBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navigateToConfiguration = () => {
        navigate('/configuration');
    };

    return (
        <div className="p-4 bg-white shadow-md">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center font-bold">
                    {/* <img src="/path/to/logo.png" alt="Logo" className="h-10" /> */}
                    Instant AI
                </div>
                <div className="flex space-x-8">
                    <button
                        onClick={navigateToConfiguration}
                        className={`text-black flex items-center ring-1 ring-gray-300 px-2 py-1 rounded-md ${
                            location.pathname === '/configuration' ? 'bg-black text-white' : ''
                        }`}
                    >
                        Configurations
                        <Network className="h-4 w-4 ml-2" />
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className={`text-black flex items-center ring-1 ring-gray-300 px-2 py-1 rounded-md ${
                            location.pathname === '/' ? 'bg-black text-white' : ''
                        }`}
                    >
                        Home
                        <Home className="h-4 w-4 ml-2" />
                    </button>
                    <button
                        onClick={() => navigate('/projection-home')}
                        className={`text-black flex items-center ring-1 ring-gray-300 px-2 py-1 rounded-md ${
                            location.pathname === '/projection-home' ? 'bg-black text-white' : ''
                        }`}
                    >
                        Projection Home
                        <Layers className="h-4 w-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppBar;
