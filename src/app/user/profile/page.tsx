'use client'
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Education from '../components/Education';
import Experience from '../components/Experience';
import React, { useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../../../app/lib/axiosInstance';
import { Edit, MapPin, Phone, Mail, Upload, Plus, X } from 'lucide-react';
import { setImage } from '../../../store/slices/userAuthSlice'
import Header from '../../../components/Header'


import 'react-toastify/dist/ReactToastify.css';


// Types definition moved inline for clarity
interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  isFresher: boolean;
  resume: string;
  skills: string[];
  experience: any[];
  education: any[];
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full m-4">
        {children}
      </div>
    </div>
  );
};

const ResumeProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<ProfileData>>({});
  const [newSkill, setNewSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [skillError, setSkillError] = useState<string>(''); // For skill validation error

  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);

  const dispatch = useDispatch();



  useEffect(() => {
    fetchProfileData();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editFormData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!editFormData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!editFormData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(editFormData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (!editFormData.city?.trim()) newErrors.city = 'City is required';
    if (!editFormData.state?.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get('/api/users/profile');
      setProfileData(response.data.data);
      setEditFormData(response.data.data);

      setEducation(response.data.data.education);
      setExperience(response.data.data.experience);
      if (profileData?.profilePicture) {
        await dispatch(setImage({ image: response.data.data.profilePicture }));

      }
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching profile data:", error);
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: any) => {
    e.preventDefault();

    if (!validateForm())
      return
    try {
      await axiosInstance.put('/api/users/profile', editFormData);
      fetchProfileData();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to track validation error message
  const [isUploading, setIsUploading] = useState<boolean>(false); // State to track uploading status

  const handlePhotoUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    setLoading(true);
    try {
      await axiosInstance.post('/api/users/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchProfileData();

      toast.success("Photo uploaded successfully!");

    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload the photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    // Allowed file types for the resume
    const validFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    // Check if the file type is valid
    if (!validFileTypes.includes(file.type)) {
      toast.error("Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axiosInstance.post('/api/users/profile/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Resume uploaded successfully!");

      fetchProfileData(); // Assuming this will refresh the user data after upload
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };


  const handleAddSkill = async () => {

    if (!newSkill.trim()) {
      setSkillError('Skill cannot be empty');
      return;
    }

    setSkillError('');;

    try {
      await axiosInstance.post('/api/users/profile/skills', { skill: newSkill.trim() });
      fetchProfileData();
      setNewSkill('');
      setIsAddingSkill(false);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleRemoveSkill = async (skill: string) => {
    try {
      await axiosInstance.delete(`/api/users/profile/skills/${skill}`);
      toast.success("Skill removed successfully!");

      fetchProfileData();
    } catch (error) {
      console.error("Error removing skill:", error);
      toast.error("Failed to remove skill. Please try again.");

    }
  };


  const handleEducationUpdated = () => {
    fetchProfileData();
  };

  const handleExperienceUpdated = () => {
    fetchProfileData();

  };


  if (!profileData) return <div>Error loading profile data.</div>;

  return (

    <>
      <Header />


      <div className="max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">Quick links</h2>
              <nav>
                {[
                  { name: 'Resume', hasAction: false, action: 'Upload' },
                  { name: 'Profile details', hasAction: false, action: 'Edit' },
                  { name: 'Key skills', hasAction: false, action: 'Add' },
                  { name: 'Education', hasAction: false, action: 'Add' },
                  { name: 'Experience', hasAction: false, action: 'Add' },
                ].map((link, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-700">{link.name}</span>
                    {link.hasAction && (
                      <span className="text-blue-500 text-sm cursor-pointer hover:underline">
                        {link.action}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {loading ? (
                      <span className="text-gray-400 text-sm">Loading...</span>
                    ) : (
                      <>
                        <input
                          type="file"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="profile-photo"
                          accept="image/*"
                        />
                        <label htmlFor="profile-photo" className="cursor-pointer w-full h-full">
                          {profileData?.profilePicture ? (
                            <Image
                              src={profileData.profilePicture}
                              alt="Profile"
                              className="object-cover"
                              layout="fill"
                              sizes="64px"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">Add photo</span>
                          )}
                        </label>
                      </>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h1 className="text-xl font-semibold">
                        {`${profileData.firstName} ${profileData.lastName}`}
                      </h1>
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {profileData.city && profileData.state
                          ? `${profileData.city}, ${profileData.state}`
                          : 'Location not specified'}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{profileData.phoneNumber || 'Add phone number'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4" />
                        {profileData.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
              <form onSubmit={handleProfileUpdate} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Edit Profile</h2>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input
                        type="text"
                        value={editFormData.firstName || ''}
                        onChange={e => setEditFormData({ ...editFormData, firstName: e.target.value.trim() })}
                        className="w-full p-2 border rounded"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input
                        type="text"
                        value={editFormData.lastName || ''}
                        onChange={e => setEditFormData({ ...editFormData, lastName: e.target.value.trim() })}
                        className="w-full p-2 border rounded"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editFormData.phoneNumber || ''}
                      onChange={e => setEditFormData({ ...editFormData, phoneNumber: e.target.value.trim() })}
                      className="w-full p-2 border rounded"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        value={editFormData.city || ''}
                        onChange={e => setEditFormData({ ...editFormData, city: e.target.value.trim() })}
                        className="w-full p-2 border rounded"
                      />
                      {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        value={editFormData.state || ''}
                        onChange={e => setEditFormData({ ...editFormData, state: e.target.value.trim() })}
                        className="w-full p-2 border rounded"
                      />
                      {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}

                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </Modal>

            {/* Resume Upload */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Resume</h2>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                  {!profileData?.resume ? (
                    // If the resume is not uploaded, show the upload button
                    <>
                      <input
                        type="file"
                        onChange={handleResumeUpload} // Handle resume upload
                        className="hidden"
                        id="resume-upload"
                        accept=".pdf,.doc,.docx"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center hover:bg-gray-50">
                          <Upload className="w-8 h-8 text-blue-500 mb-2" />
                          <span>Upload Resume</span>
                        </div>
                      </label>
                    </>
                  ) : (
                    // If the resume is already uploaded, show the resume file link and the Update option
                    <div className="mt-4 flex justify-between items-center">
                      <a
                        href={profileData.resume} // URL to the resume
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {profileData.resume.split('/').pop()} {/* Display the resume file name */}
                      </a>
                      <div className="flex items-center">
                        <input
                          type="file"
                          onChange={handleResumeUpload} // Handle resume upload for updating
                          className="hidden"
                          id="resume-upload-update"
                          accept=".pdf,.doc,.docx"
                        />
                        <label htmlFor="resume-upload-update" className="cursor-pointer text-blue-500 hover:underline flex items-center ml-4">
                          <Upload className="w-5 h-5 text-blue-500 mr-2" /> {/* Update icon */}
                          <span>Update Resume</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>






            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold">Skills</h2>
                  <button
                    onClick={() => setIsAddingSkill(true)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {isAddingSkill && (
                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter skill"
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingSkill(false);
                        setSkillError(''); // Clear the error when cancelling
                      }} className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {skillError && <p className="text-red-500 text-sm">{skillError}</p>} {/* Error message here */}
                {profileData.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                ) : (
                  <p className="text-gray-500">Add your skills to help recruiters find you</p>
                )}
              </div>
            </div>

            {/* Premium Banner */}
            <div className="bg-gray-50 rounded-lg shadow">
              <div className="p-4 flex justify-between items-center">
                <span>Highlight Your Resume From Others</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Buy Premium
                </button>
              </div>
            </div>

            <Education education={education} onEducationUpdated={handleEducationUpdated} />
            <Experience experience={experience} onExperienceUpdated={handleExperienceUpdated} />





          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      </div>
    </>

  );
};

// export default withAuth(ResumeProfile);
export default ResumeProfile