import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, ChangeEvent } from "react";
import axios from "axios";
import {  Calendar, ArrowRight, ChevronsDown } from "lucide-react";
import { server } from "../../../db";
import { toast } from "react-hot-toast";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JobFormData {
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryMin: string;
  salaryMax: string;
  jobDescription: string;
  applicationDeadline: string;
  responsibilities: string;
  requirements: string;
}

export default function CreateJobModal({ isOpen, onClose }: CreateJobModalProps) {
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: "",
    companyName: "",
    location: "",
    jobType: "Full-time",
    salaryMin: "",
    salaryMax: "",
    jobDescription: "",
    applicationDeadline: "",
    responsibilities: "",
    requirements: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleSubmit = async (): Promise<void> => {
    const minWords = 21;

    if (
      countWords(formData.jobDescription) < minWords ||
      countWords(formData.responsibilities) < minWords ||
      countWords(formData.requirements) < minWords
    ) {
      toast.error(
        "Please provide at least 21 words in Job Description, Responsibilities, and Requirements.",
        {
          duration: 4000,
          position: "top-right",
        }
      );
      return;
    }

    const salaryRange = `${parseInt(formData.salaryMin)}-${parseInt(
      formData.salaryMax
    )}`;
    const isoDeadline = new Date(
      `${formData.applicationDeadline}T23:59:59Z`
    ).toISOString();

    try {
      const response = await axios.post(`${server}/api/jobs`, {
        ...formData,
        salaryRange,
        applicationDeadline: isoDeadline,
      });
      console.log(response);
      toast.success("Job created successfully!", {
        duration: 3000,
        position: "top-right",
      });
      
      onClose();
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to create job. Please try again.",
        {
          duration: 4000,
          position: "top-right",
        }
      );
    }
  };

  const handleSaveDraft = (): void => {
    toast.success("Draft saved successfully!", {
      duration: 3000,
      position: "top-right",
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.42)] bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-2xl font-semibold text-center text-black mb-6">
                  Create Job Opening
                </Dialog.Title>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Job Title
                    </label>
                    <input
                      className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="Full Stack Developer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company Name
                    </label>
                    <input
                      className="w-full  rounded-md p-2 border-2 border-gray-300 outline-none"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Amazon, Microsoft, Swiggy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <select
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full  rounded-md p-2 bg-white border-2 border-gray-300 text-gray-700"
                    >
                      <option>Choose Preferred Location</option>
                      <option>Remote</option>
                      <option>Bangalore</option>
                      <option>Hyderabad</option>
                      <option>Mumbai</option>
                      <option>Pune</option>
                      <option>Chennai</option>
                      <option>Delhi</option>
                      <option>Noida</option>
                      <option>Gurgaon</option>
                      <option>Kolkata</option>
                      <option>Ahmedabad</option>
                      <option>Jaipur</option>
                      <option>Lucknow</option>
                      <option>Indore</option>
                      <option>Bhopal</option>
                      <option>Surat</option>
                      <option>Coimbatore</option>
                      <option>Thiruvananthapuram</option>
                      <option>Vijayawada</option>
                      <option>Visakhapatnam</option>
                      <option>Patna</option>
                      <option>Chandigarh</option>
                      <option>Goa</option>
                      <option>Mysore</option>
                      <option>Nagpur</option>
                      <option>Kanpur</option>
                      <option>Rajkot</option>
                      <option>Vadodara</option>
                      <option>Hubli</option>
                      <option>Madurai</option>
                      <option>Guwahati</option>
                      <option>International - USA</option>
                      <option>International - UK</option>
                      <option>International - Canada</option>
                      <option>International - Germany</option>
                      <option>International - Australia</option>
                      <option>International - Singapore</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Job Type
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      required
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 rounded-md p-2 bg-white text-gray-700"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>

                  <div className="flex space-x-2">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium mb-1">
                        Salary Min
                      </label>
                      <input
                        type="number"
                        className="w-full border-2 border-gray-300 rounded-md p-2"
                        name="salaryMin"
                        required
                        value={formData.salaryMin}
                        onChange={handleChange}
                        placeholder="₹0"
                      />
                    </div>

                    <div className="w-1/2">
                      <label className="block text-sm font-medium mb-1">
                        Salary Max
                      </label>
                      <input
                        type="number"
                        required
                        className="w-full border-2 border-gray-300 rounded-md p-2"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleChange}
                        placeholder="₹12,00,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Application Deadline
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="applicationDeadline"
                        required
                        value={formData.applicationDeadline}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-300 rounded-md p-2 pr-10"
                      />
                      <Calendar className="absolute right-2 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Job Description
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-300 rounded-md p-3"
                    rows={2}
                    placeholder="Please share a description to let the candidate know more about the job role"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Responsibilties
                  </label>
                  <textarea
                    name="responsibilities"
                    required
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 rounded-md p-3"
                    rows={1}
                    placeholder="Please share a description to let the candidate know more about the job role"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-300 rounded-md p-3"
                    rows={1}
                    placeholder="Please share a description to let the candidate know more about the job role"
                  />
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    className="px-4 py-2 border-2 border-gray-300 rounded-md flex items-center gap-2 text-sm font-medium"
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                    <ChevronsDown className="w-4 h-4" />
                  </button>

                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
                    onClick={handleSubmit}
                  >
                    Publish
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
