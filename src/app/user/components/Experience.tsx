'use client'

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Plus, X, Trash2 } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../app/lib/axiosInstance';
import { useConfirmation } from '../../../hooks/useConfirmation';
import { ConfirmationBox } from '../../../components/ConfirmationBox';


interface ExperienceData {
  _id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string | null; // Updated to allow null end date
  description: string;
}

interface ExperienceProps {
  experience: ExperienceData[];
  onExperienceUpdated: () => void;
}

const Experience: React.FC<ExperienceProps> = ({ experience, onExperienceUpdated }) => {
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);

  const defaultExperience: ExperienceData = {
    _id: '',
    jobTitle: '',
    companyName: '',
    startDate: '',
    endDate: null,
    description: ''
  }

  const [newExperience, setNewExperience] = useState<ExperienceData>(defaultExperience);

  const [errors, setErrors] = useState({
    jobTitle: '',
    companyName: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const {
    isOpen: isDeleteOpen,
    confirm: confirmDelete,
    handleConfirm: handleDeleteConfirm,
    handleCancel: handleDeleteCancel,
    options: deleteOptions,
  } = useConfirmation();

  useEffect(() => {
    // Example: Reset when `isAddEducationOpen` is false
    if (!isAddExperienceOpen) {
      setNewExperience(defaultExperience);
      setErrors({
        jobTitle: '',
        companyName: '',
        startDate: '',
        endDate: '',
        description: ''
      })
    }
  }, [isAddExperienceOpen]);

  const validateForm = () => {
    const tempErrors = { ...errors };
    let isValid = true;

    // Validate Job Title
    if (!newExperience.jobTitle) {
      tempErrors.jobTitle = 'Job Title is required';
      isValid = false;
    } else {
      tempErrors.jobTitle = '';
    }

    // Validate Company Name
    if (!newExperience.companyName) {
      tempErrors.companyName = 'Company Name is required';
      isValid = false;
    } else {
      tempErrors.companyName = '';
    }

    // Validate Start Date
    if (!newExperience.startDate) {
      tempErrors.startDate = 'Start Date is required';
      isValid = false;
    } else if (new Date(newExperience.startDate) > new Date()) {
      tempErrors.startDate = 'Start Date cannot be in the future';
      isValid = false;
    } else {
      tempErrors.startDate = '';
    }

    // Validate End Date
    if (newExperience.endDate && new Date(newExperience.endDate) < new Date(newExperience.startDate)) {
      tempErrors.endDate = 'End Date cannot be before Start Date';
      isValid = false;
    } else if (newExperience.endDate && new Date(newExperience.endDate) > new Date()) {
      tempErrors.endDate = 'End Date cannot be in the future';
      isValid = false;
    } else {
      tempErrors.endDate = '';
    }

    // Validate Description
    if (!newExperience.description) {
      tempErrors.description = 'Description is required';
      isValid = false;
    } else {
      tempErrors.description = '';
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await axiosInstance.post('/api/users/profile/experience', { experience: newExperience });
        toast.success('Experience added successfully!');
        setIsAddExperienceOpen(false);
        onExperienceUpdated(); // Callback to refresh data
      } catch (error) {
        console.error("Error adding experience:", error);
        toast.error("Failed to add experience. Please try again.");
      }
    } else {
      toast.error('Please fill in all fields correctly.');
    }
  };

  const handleDeleteExperience = async (id: string) => {

    const confirmed = await confirmDelete({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return

    try {
      await axiosInstance.delete(`/api/users/profile/experience/${id}`);
      toast.success('Experience deleted successfully!');
      onExperienceUpdated(); // Callback to refresh data
    } catch (error: any) {
      console.error("Error deleting experience:", error);
      toast.error(error.response.data.message);
    }
  };

  const calculateYearDifference = (startDate: string, endDate: string | null) => {
    const startYear = new Date(startDate).getFullYear();
    const endYear = endDate ? new Date(endDate).getFullYear() : new Date().getFullYear();
    return endYear - startYear;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-4">Experience</h2>
      {experience.length === 0 ? (
        <p className='text-gray-500'>No experience added yet. You can add one.</p>
      ) : (
        <div>
          {experience.map((exp, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span>
                {exp.jobTitle} - {exp.companyName} ({calculateYearDifference(exp.startDate, exp.endDate)} year{calculateYearDifference(exp.startDate, exp.endDate) > 1 ? 's' : ''})
              </span>
              <div className="flex items-center">
                <button onClick={() => handleDeleteExperience(exp._id)} className="text-red-500 cursor-pointer mr-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsAddExperienceOpen(true)}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        <Plus className="w-4 h-4 inline" /> Add Experience
      </button>

      {/* Add Experience Modal */}
      {isAddExperienceOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full m-4 p-6">
            <form onSubmit={handleAddExperience} className="">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Experience</h2>
                <button
                  type="button"
                  onClick={() => setIsAddExperienceOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title</label>
                  <input
                    type="text"
                    value={newExperience.jobTitle}
                    onChange={e => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
                    placeholder="Job Title"
                    className={`w-full p-2 border rounded ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    value={newExperience.companyName}
                    onChange={e => setNewExperience({ ...newExperience, companyName: e.target.value })}
                    placeholder="Company Name"
                    className={`w-full p-2 border rounded ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={newExperience.startDate}
                      onChange={e => setNewExperience({ ...newExperience, startDate: e.target.value })}
                      className={`w-full p-2 border rounded ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      value={newExperience.endDate || ''}
                      onChange={e => setNewExperience({ ...newExperience, endDate: e.target.value })}
                      className={`w-full p-2 border rounded ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newExperience.description}
                    onChange={e => setNewExperience({ ...newExperience, description: e.target.value })}
                    placeholder="Describe your role"
                    className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddExperienceOpen(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-black-600"
                  >
                    Add Experience
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      <ConfirmationBox
        isOpen={isDeleteOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title={deleteOptions?.title || ''}
        message={deleteOptions?.message || ''}
        confirmText={deleteOptions?.confirmText}
        cancelText={deleteOptions?.cancelText}
      />
    </div>
  );
};

export default Experience;
