// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";
// // import CreateProjModal from "../Components/CreateProjModal";
// // import Loader from "../Components/Loader";
// // const Home = () => {
// //   const baseUrl = import.meta.env.VITE_BASE_URL;
// //   const navigate = useNavigate();
// //   const [projects, setProjects] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [showModal, setShowModal] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [newProject, setNewProject] = useState({
// //     name: "",
// //     description: "",
// //   });

// //   useEffect(() => {
// //     allProjects();
// //   }, []);
// //   if (loading) {
// //     return (
// //       <div>
// //         <Loader />
// //       </div>
// //     );
// //   }
// //   const allProjects = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${baseUrl}/projects/`);
// //       console.log(response.data.projects);
// //       setProjects(response.data.projects);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Error fetching projects:", error);
// //       setLoading(false);
// //     }
// //   };

// //   const handleNewProject = async (e) => {
// //     e.preventDefault();
// //     try {
// //       setLoading(true);
// //       const response = await axios.post(`${baseUrl}/projects/`, newProject);
// //       const projectId = response.data.project_id;

// //       sessionStorage.setItem("project_id", projectId);

// //       setShowModal(false);
// //       setNewProject({ name: "", description: "" });

// //       console.log(projectId);
// //       navigate(`/projects/${projectId}/upload`);
// //     } catch (error) {
// //       console.error("Error creating project:", error);
// //     }
// //   };

// //   const handleProjectClick = async (projectId) => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       sessionStorage.setItem("project_id", projectId);
// // const status = await handleProjectStatus(projectId);
// // if (!status.data.data_uploaded) {
// //   navigate(`/projects/${projectId}/upload`);
// //   return;
// // }
// // if(status.data.feature_ranking_completed){
// //   navigate(`/projects/${projectId}/clustered-data`, {
// //     state: { kpiList:status.data.kpi_list,
// //        importantColumnNames:status.data.important_features,
// //         activeKPI:status.data.kpi,
// //          rankingStatus:"SUCCESS" },
// //   });
// // }else{
// //   const rankingResponse = await axios.post(`${baseUrl}/projects/${projectId}/feature-ranking`, {
// //     project_id: projectId,
// //     kpi: status.data.kpi,
// //     important_features: status.data.important_features,
// //     kpi_list: status.data.kpi_list
// //   });

// //   navigate(`/projects/${projectId}/clustered-data`, {
// //     state: {
// //       kpiList: status.data.kpi_list,
// //       importantColumnNames: status.data.important_features,
// //       activeKPI: status.data.kpi,
// //       rankingStatus: false,
// //       task_id: rankingResponse.data.task_id
// //     }
// //   });
// // }
// //     } catch (error) {
// //       console.error('Error navigating to project:', error);
// //       setError('Failed to open project');
// //     }finally{
// //       setLoading(false);
// //     }

// //   };

// //   //handle project status
// //   const handleProjectStatus = async (projectId) => {
// //     try {
// //       const status = await axios.get(`${baseUrl}/projects/${projectId}/status`);
// //       return status;
// //     } catch (error) {
// //       console.error('Error fetching project status:', error);
// //       throw new Error('Failed to fetch project status');
// //     }
// //   };
// //   return (
// //     <div className="p-6">
// //       <div className="mb-6 mx-10">
// //         <div className="flex justify-start">
// //           <button
// //             onClick={() => setShowModal(true)}
// //             className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
// //           >
// //             Create New Project
// //           </button>
// //         </div>
// //       </div>

// //       <div>
// //         {projects.length > 0 ? (
// //           <table className="w-screen text-wrap border-collapse mx-10 bg-white shadow-sm rounded-lg">
// //             <thead className="bg-gray-500">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
// //                   Project Name
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
// //                   Project Description
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y text-wrap divide-gray-200">
// //               {projects.map((project, index) => (
// //                 <tr
// //                   key={project.project_id || index}
// //                   className="hover:bg-gray-50 text-wrap"
// //                   onClick={() => handleProjectClick(project.project_id)}
// //                 >
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                     {project.name}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-wrap text-sm text-gray-500">
// //                     {project.description}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         ) : (
// //           <p className="text-gray-500 text-center">No projects to display</p>
// //         )}
// //       </div>

// //       {showModal && (
// //         <CreateProjModal
// //           setNewProject={setNewProject}
// //           setShowModal={setShowModal}
// //           handleNewProject={handleNewProject}
// //           newProject={newProject}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default Home;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import CreateProjModal from "../Components/CreateProjModal";
// import Loader from "../Components/Loader";

// const Home = () => {
//   const baseUrl = import.meta.env.VITE_BASE_URL;
//   const navigate = useNavigate();

//   // State management
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState(null);
//   const [newProject, setNewProject] = useState({
//     name: "",
//     description: "",
//   });

//   // Fetch projects on component mount
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(`${baseUrl}/projects/`);
//       setProjects(response.data.projects || []);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setError("Failed to fetch projects. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewProject = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError(null);

//       if (!newProject.name.trim()) {
//         throw new Error("Project name is required");
//       }

//       const response = await axios.post(`${baseUrl}/projects/`, newProject);
//       const projectId = response.data.project_id;

//       if (!projectId) {
//         throw new Error("Invalid project ID received from server");
//       }

//       sessionStorage.setItem("project_id", projectId);
//       setShowModal(false);
//       setNewProject({ name: "", description: "" });
//       navigate(`/projects/${projectId}/upload`);
//     } catch (error) {
//       console.error("Error creating project:", error);
//       setError(error.response?.data?.message || error.message || "Failed to create project");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProjectClick = async (projectId) => {
//     try {
//       setLoading(true);
//       setError(null);
//       sessionStorage.setItem("project_id", projectId);

//       const status = await handleProjectStatus(projectId);

//       if (!status.data.data_uploaded) {
//         navigate(`/projects/${projectId}/upload`);
//         return;
//       }

//       if (status.data.feature_ranking_completed) {
//         navigate(`/projects/${projectId}/clustered-data`, {
//           state: {
//             kpiList: status.data.kpi_list,
//             importantColumnNames: status.data.important_features,
//             activeKPI: status.data.kpi,
//             rankingStatus: "SUCCESS"
//           },
//         });
//       } else {
//         const rankingResponse = await axios.post(
//           `${baseUrl}/projects/${projectId}/feature-ranking`,
//           {
//             project_id: projectId,
//             kpi: status.data.kpi,
//             important_features: status.data.important_features,
//             kpi_list: status.data.kpi_list
//           }
//         );

//         navigate(`/projects/${projectId}/clustered-data`, {
//           state: {
//             kpiList: status.data.kpi_list,
//             importantColumnNames: status.data.important_features,
//             activeKPI: status.data.kpi,
//             rankingStatus: false,
//             task_id: rankingResponse.data.task_id
//           }
//         });
//       }
//     } catch (error) {
//       console.error('Error navigating to project:', error);
//       setError('Failed to open project. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProjectStatus = async (projectId) => {
//     try {
//       const status = await axios.get(`${baseUrl}/projects/${projectId}/status`);
//       return status;
//     } catch (error) {
//       console.error('Error fetching project status:', error);
//       throw new Error('Failed to fetch project status');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="mb-6 mx-10">
//         <div className="flex justify-between items-center">
//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
//             disabled={loading}
//           >
//             Create New Project
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="mx-10 mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       <div>
//         {projects.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-screen text-wrap border-collapse mx-10 bg-white shadow-sm rounded-lg">
//               <thead className="bg-gray-500">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                     Project Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                     Project Description
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y text-wrap divide-gray-200">
//                 {projects.map((project) => (
//                   <tr
//                     key={project.project_id}
//                     className="hover:bg-gray-50 text-wrap cursor-pointer transition-colors"
//                     onClick={() => !loading && handleProjectClick(project.project_id)}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {project.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-normal text-wrap text-sm text-gray-500">
//                       {project.description}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-gray-500 text-center p-4">
//             No projects to display. Create your first project to get started.
//           </div>
//         )}
//       </div>

//       {showModal && (
//         <CreateProjModal
//           setNewProject={setNewProject}
//           setShowModal={setShowModal}
//           handleNewProject={handleNewProject}
//           newProject={newProject}
//           loading={loading}
//         />
//       )}
//     </div>
//   );
// };

// export default Home;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateProjModal from "../Components/CreateProjModal";
import Loader from "../Components/Loader";

const Home = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${baseUrl}/projects/`);
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!newProject.name.trim()) {
        throw new Error("Project name is required");
      }

      const response = await axios.post(`${baseUrl}/projects/`, newProject);
      const projectId = response.data.project_id;

      if (!projectId) {
        throw new Error("Invalid project ID received from server");
      }

      sessionStorage.setItem("project_id", projectId);
      setShowModal(false);
      setNewProject({ name: "", description: "" });
      navigate(`/projects/${projectId}/configuration`);
    } catch (error) {
      console.error("Error creating project:", error);
      setError(error.response?.data?.message || error.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectStatus = async (projectId) => {
    try {
      if (!projectId) {
        throw new Error("Invalid project ID");
      }

      const response = await axios.get(`${baseUrl}/projects/${projectId}/status`);

      // Validate response data
      if (!response.data) {
        throw new Error("Invalid response from server");
      }

      return response;
    } catch (error) {
      // Check specific error types
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error("Project not found or data not available");
        } else {
          throw new Error(`Server error: ${error.response.data?.message || 'Unknown error'}`);
        }
      }
      throw new Error("Failed to fetch project status: " + (error.message || "Unknown error"));
    }
  };


  const handleProjectClick = async (projectId) => {
    try {
      if (!projectId) {
        throw new Error("Invalid project ID");
      }

      setLoading(true);
      setError(null);
      sessionStorage.setItem("project_id", projectId);

      let status;
      try {
        status = await handleProjectStatus(projectId);
      } catch (statusError) {
        // If status check fails, redirect to upload
        console.warn("Status check failed, redirecting to upload:", statusError);
        // navigate(`/projects/${projectId}/upload`);
        return;
      }

      if (!status.data.data_uploaded) {
        navigate(`/projects/${projectId}/configuration`);
        return;
      }

      if (status.data.feature_ranking_completed) {
        navigate(`/projects/${projectId}/clustered-data`, {
          state: {
            kpiList: status.data.kpi_list,
            importantColumnNames: status.data.important_features,
            activeKPI: status.data.kpi,
            rankingStatus: "SUCCESS"
          },
        });
      } else {
        try {
          const rankingResponse = await axios.post(
            `${baseUrl}/projects/${projectId}/feature-ranking`,
            {
              project_id: projectId,
              kpi: status.data.kpi,
              important_features: status.data.important_features,
              kpi_list: status.data.kpi_list
            }
          );

          navigate(`/projects/${projectId}/clustered-data`, {
            state: {
              kpiList: status.data.kpi_list,
              importantColumnNames: status.data.important_features,
              activeKPI: status.data.kpi,
              rankingStatus: false,
              task_id: rankingResponse.data.task_id
            }
          });
        } catch (rankingError) {
          console.error("Feature ranking failed:", rankingError);
          throw new Error("Failed to start feature ranking process");
        }
      }
    } catch (error) {
      console.error('Error navigating to project:', error);
      setError(error.message || 'Failed to open project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Project
        </button>
      </div>

      {error && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
          <button
            onClick={fetchProjects}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm text-gray-500">Loading projects...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {projects.slice(0, 1).map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer min-h-[120px] max-h-[120px] "
              onClick={() => !loading && handleProjectClick(project.id)}
            >
              <div className="bg-[url('https://companieslogo.com/img/orig/APARINDS.NS_BIG-0ae30472.png?t=1720244490')] bg-contain bg-no-repeat bg-center h-full m-2"/>
              {/* <h2 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h2>
              <p className="text-sm text-gray-500 truncate">{project.description}</p> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No projects to display. Create your first project to get started.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      )}

      {showModal && (
        <CreateProjModal
          setNewProject={setNewProject}
          setShowModal={setShowModal}
          handleNewProject={handleNewProject}
          newProject={newProject}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Home;