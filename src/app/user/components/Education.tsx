import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Edit, Plus, X, Trash2 } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../app/lib/axiosInstance';
import { useConfirmation } from '../../../hooks/useConfirmation';
import { ConfirmationBox } from '../../../components/ConfirmationBox';


interface EducationData {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
}

interface EducationProps {
  education: EducationData[];
  onEducationUpdated: () => void;
}

const Education: React.FC<EducationProps> = ({ education, onEducationUpdated }) => {
  const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);

  const defaultEducation: EducationData = {
    _id: '',
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: new Date(),
    endDate: undefined,
  };

  const [newEducation, setNewEducation] = useState<EducationData>(defaultEducation);

  const [errors, setErrors] = useState<any>({});

  const {
    isOpen: isDeleteOpen,
    confirm: confirmDelete,
    handleConfirm: handleDeleteConfirm,
    handleCancel: handleDeleteCancel,
    options: deleteOptions,
  } = useConfirmation();

  useEffect(() => {
    // Example: Reset when `isAddEducationOpen` is false
    if (!isAddEducationOpen) {
      setNewEducation(defaultEducation);
      setErrors({})
    }
  }, [isAddEducationOpen]);

  const validateFields = () => {
    const newErrors: any = {};
    if (!newEducation.institution) newErrors.institution = "Institution is required.";
    if (!newEducation.degree) newErrors.degree = "Degree is required.";
    if (!newEducation.fieldOfStudy) newErrors.fieldOfStudy = "Field of study is required.";

    if (!newEducation.startDate) newErrors.startDate = "Start date is required.";
    if (newEducation.endDate && newEducation.endDate < newEducation.startDate) {
      newErrors.endDate = "End date cannot be earlier than start date.";
    }
    // if (!newEducation.endDate && newEducation.startDate) {
    //   newErrors.endDate = "End date is required if start date is provided.";
    // }
    return newErrors;
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    const validationErrors = validateFields();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Prevent submission if there are validation errors
    }

    try {
      const newEducationPayload = {
        ...newEducation,
        startDate: newEducation.startDate.toISOString(),
        endDate: newEducation.endDate ? newEducation.endDate.toISOString() : undefined,
      };
      await axiosInstance.post('/api/users/profile/education', { education: newEducationPayload });
      toast.success('Education added successfully!');
      setIsAddEducationOpen(false);
      onEducationUpdated();
    } catch (error) {
      console.error("Error adding education:", error);
      toast.error("Failed to add education. Please try again.");
    }
  };

  const handleDeleteEducation = async (educationId: string) => {

    const confirmed = await confirmDelete({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return

    try {
      const response = await axiosInstance.delete(`/api/users/profile/education/${educationId}`);
      toast.success(response.data.message);
      onEducationUpdated()
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Failed to delete education. Please try again.");
    }
  };

  // Helper function to format the date range
  const getDateRange = (startDate: Date, endDate?: Date) => {
    const startYear = startDate.getFullYear();
    const endYear = endDate ? endDate.getFullYear() : 'Present';
    return `${startYear} - ${endYear}`;
  };

  return (


    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-4">Education</h2>
      {education.length === 0 ? (
        <p className='text-gray-500'>No education added yet. You can add one.</p>
      ) : (
        <div>
          {education.map((edu, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <div>
                <span>{edu.degree} - {edu.institution}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {getDateRange(new Date(edu.startDate), edu.endDate ? new Date(edu.endDate) : undefined)}
                </span>
              </div>
              <button
                onClick={() => handleDeleteEducation(edu._id)}
                className="text-red-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsAddEducationOpen(true)}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        <Plus className="w-4 h-4 inline" /> Add Education
      </button>

      {/* Add Education Modal */}
      {isAddEducationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full m-4 p-6">
            <form onSubmit={handleAddEducation} className="">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Education</h2>
                <button
                  type="button"
                  onClick={() => setIsAddEducationOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="institution" className="block text-sm font-medium mb-1">
                    Institution
                  </label>
                  <input
                    id="institution"
                    type="text"
                    value={newEducation.institution}
                    onChange={e => setNewEducation({ ...newEducation, institution: e.target.value })}
                    placeholder="Institution"
                    className="w-full p-2 border rounded"
                  />
                  {errors.institution && <p className="text-red-500 text-xs">{errors.institution}</p>}
                </div>

                <div>
                  <label htmlFor="degree" className="block text-sm font-medium mb-1">
                    Degree
                  </label>
                  <input
                    id="degree"
                    type="text"
                    value={newEducation.degree}
                    onChange={e => setNewEducation({ ...newEducation, degree: e.target.value })}
                    placeholder="Degree"
                    className="w-full p-2 border rounded"
                  />
                  {errors.degree && <p className="text-red-500 text-xs">{errors.degree}</p>}
                </div>

                <div>
                  <label htmlFor="fieldOfStudy" className="block text-sm font-medium mb-1">
                    Field of Study
                  </label>
                  <input
                    id="fieldOfStudy"
                    type="text"
                    value={newEducation.fieldOfStudy || ''}
                    onChange={e => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                    placeholder="Field of Study"
                    className="w-full p-2 border rounded"
                  />
                  {errors.fieldOfStudy && <p className="text-red-500 text-xs">{errors.fieldOfStudy}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={newEducation.startDate.toISOString().split('T')[0]}
                      onChange={e => setNewEducation({ ...newEducation, startDate: new Date(e.target.value) })}
                      className="w-full p-2 border rounded"
                    />
                    {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={newEducation.endDate ? newEducation.endDate.toISOString().split('T')[0] : ''}
                      onChange={e => setNewEducation({ ...newEducation, endDate: e.target.value ? new Date(e.target.value) : undefined })}
                      className="w-full p-2 border rounded"
                    />
                    {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate}</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddEducationOpen(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Education
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

export default Education;
