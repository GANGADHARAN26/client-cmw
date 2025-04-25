"use client";
import Image from "next/image";
import logo from "../../public/cmwlogo.png";
import Link from "next/link";
import { AlignJustify, MapPin, Search, UserSearch, Loader2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import CreateJobModal from "./components/CreateJobModel";
import { server } from "../../db";
import { useIsMobile } from "./hooks/useIsMobile";
import { Toaster, toast } from "react-hot-toast";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface Job {
  _id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryRange: string;
  jobDescription: string;
  requirements: string;
  responsibilities: string;
  applicationDeadline: string;
  createdAt: string;
  __v: number;
}

const getHoursAgo = (isoDateString: string) => {
    const pastDate = new Date(isoDateString);
    const now = new Date();
  
    const diffInMs = now.getTime() - pastDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
    if (diffInHours < 1) return "less than 1h";
    if (diffInHours === 1) return "1h ago";
    return `${diffInHours}h ago`;
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="text-red-500 text-center">
      <p className="text-lg font-semibold">Error</p>
      <p>{message}</p>
    </div>
  </div>
);

const JobList = ({ jobs }: { jobs: Job[] }) => (
  <div className="flex flex-wrap gap-10 p-9">
    {jobs.map((job, index) => (
      <div
        key={index}
        className="w-[316px] h-[360px] shadow-lg rounded-xl p-4"
      >
        <div className="flex justify-between">
          <Image
            src={logo}
            alt="CMW"
            width={70}
            height={40}
            className="p-2 shadow-2xl rounded-2xl"
            style={{
              background: "linear-gradient(to bottom, #fefefd, #f1f1f1)",
            }}
          />
          <div>
            <div className="flex justify-end pb-1 ">
              <span className="bg-[#b0d9ff] rounded-xl flex justify-center items-center w-[75px] h-[33px] text-xs font-medium font-(family-name:Satoshi Variable)">
                {getHoursAgo(job.createdAt)}
              </span>
            </div>
            <div>
              <p className="py-1 text-sm text-gray-500 font-bold ">
                {job.companyName}
              </p>
            </div>
          </div>
        </div>
        <h1 className="pt-5 font-medium font-(family-name:Satoshi Variable) text-xl">
          {job.jobTitle}{" "}
        </h1>

        <div className="flex justify-between items-center py-2 text-sm text-gray-500 font-medium ">
          <p className="flex">
            <MapPin width={17} />
            &nbsp; {job.location}{" "}
          </p>
          <p className="flex">
            <Search width={17} />
            &nbsp; {job.jobType}{" "}
          </p>

          <p></p>
        </div>
        <p className="py-1 text-sm text-gray-500 font-bold ">
                Salary Range&nbsp; &nbsp;{" ₹"+job.salaryRange}
              </p> 
                <p className="text-sm text-gray-500 font-medium py-1 line-clamp-4 h-[88px]">
                  {job.responsibilities}
                </p>
               <div className="flex items-end pt-3">
               <button className="bg-[#00aaff] w-full rounded-md py-2 text-white">Apply Now</button>
               </div>
      </div>
    ))}
  </div>
);

export default function Home() {
  const [navbar, setNavbar] = useState<boolean>(true);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 2000000]);

  const locations = Array.from(new Set(jobs.map(job => job.location)));
  const jobTypes = Array.from(new Set(jobs.map(job => job.jobType)));

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesJobType = !selectedJobType || job.jobType === selectedJobType;
    
    const [minSalary, maxSalary] = job.salaryRange.split('-').map(Number);
    const matchesSalary = minSalary >= salaryRange[0] && maxSalary <= salaryRange[1];

    return matchesSearch && matchesLocation && matchesJobType && matchesSalary;
  });

  useEffect(() => {
    if (isMobile) {
      setNavbar(false);
    } else {
      setNavbar(true);
    }
  }, [isMobile]);

useEffect(() => {
  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${server}/api/jobs`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data.jobs);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setError(errorMessage);
        toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, []);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setSalaryRange(newValue as [number, number]);
  };

  return (
    <div className="bg-[#fbfbff]">
      <Toaster position="top-right" />
      
      {/* navbar section */}
      <div>
        <nav className="flex md:justify-center my-4 font-medium mx-4 md:mx-0">
          <span className="  md:p-4 md:rounded-full md:px-9 md:shadow-xl w-full md:w-auto">
            <div className="md:flex  md:text-md">
              <span className="flex justify-between items-center">
                <Image src={logo} alt="CMW" width={40} height={40} />{" "}
                <AlignJustify
                  onClick={() => setNavbar(!navbar)}
                  className="visible md:invisible "
                />
              </span>
              {navbar && (
                <>
                  <Link
                    href={"/"}
                    className="flex justify-center items-center pb-2 md:pb-0 px-3 sm:px-5 xl:px-10 cursor-pointer"
                  >
                    Home
                  </Link>
                  <Link
                    href={"/"}
                    className="flex justify-center items-center pb-2 md:pb-0 px-3 sm:px-5 xl:px-10 cursor-pointer"
                  >
                    Find Jobs
                  </Link>
                  <Link
                    href={"/"}
                    className="flex justify-center items-center pb-2 md:pb-0 px-3 sm:px-5 xl:px-10 cursor-pointer"
                  >
                    Find Talents
                  </Link>
                  <Link
                    href={"/"}
                    className="flex justify-center items-center pb-2 md:pb-0 px-3 sm:px-5 xl:px-10 cursor-pointer"
                  >
                    About us
                  </Link>
                  <Link
                    href={"/"}
                    className="flex justify-center items-center pb-2 md:pb-0 px-3 sm:px-5 xl:px-10 cursor-pointer"
                  >
                    Testimonials
                  </Link>
                  <span className="flex justify-center">
                    <button
                      className="  rounded-full text-white px-3 p-1 sm:px-5 xl:px-10 cursor-pointer "
                      style={{
                        background:
                          "linear-gradient(to bottom, #a128ff, #6100ad)",
                      }}
                      onClick={() => setIsOpen(true)}
                    >
                      Create Jobs
                    </button>
                  </span>
                </>
              )}
            </div>
          </span>
        </nav>
      </div>
      {/* Filter section */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between py-3 px-4 md:px-6 space-y-4 md:space-y-0">
          {/* Search Input */}
          <div className="flex items-center w-full md:w-auto md:flex-1 min-w-[200px]">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full outline-none ml-3 text-gray-600 placeholder:text-gray-400"
              placeholder="Search By Job Title, Role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Divider - visible only on desktop */}
          <div className="hidden md:block h-10  w-[1.5px] bg-gray-200 mx-4"></div>

          {/* Location Dropdown */}
          <div className="flex items-center w-full md:w-auto md:flex-1 min-w-[200px] relative">
            <MapPin className="w-5 h-5 text-gray-400" />
            <select
              className="w-full outline-none ml-3 text-gray-600 bg-transparent appearance-none cursor-pointer font-semibold
              focus:outline-none hover:bg-gray-50 rounded-md py-2 px-1
              bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')]
              bg-[length:8px_8px] bg-[right_0.7rem_center] bg-no-repeat"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="" className="text-gray-600 font-semibold">Preferred Location</option>
              {locations.map((location) => (
                <option key={location} value={location} className="text-gray-800 font-semibold py-2">
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Divider - visible only on desktop */}
          <div className="hidden md:block h-10 w-[1.5px] bg-gray-200 mx-4"></div>

          {/* Job Type Dropdown */}
          <div className="flex items-center w-full md:w-auto md:flex-1 min-w-[200px] relative">
            <UserSearch className="w-5 h-5 text-gray-400" />
            <select
              className="w-full outline-none ml-3 text-gray-600 bg-transparent appearance-none cursor-pointer font-semibold
              focus:outline-none hover:bg-gray-50 rounded-md py-2 px-1
              bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')]
              bg-[length:8px_8px] bg-[right_0.7rem_center] bg-no-repeat"
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="" className="text-gray-600 font-semibold">Job Type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type} className="text-gray-800 font-semibold py-2">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Divider - visible only on desktop */}
          <div className="hidden md:block h-10 w-[1.5px] bg-gray-200 mx-4"></div>

          {/* Salary Range */}
          <div className="w-full md:w-auto md:flex-1 min-w-[250px] px-2 md:px-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">Salary Per Month</span>
              <span className="text-sm font-semibold">
                ₹{(salaryRange[0]/1000).toFixed(0)}k - ₹{(salaryRange[1]/1000).toFixed(0)}k
              </span>
            </div>
            <Box>
              <Slider
                value={salaryRange}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={0}
                max={2000000}
                step={10000}
                valueLabelFormat={(value: number) => `₹${(value/1000).toFixed(0)}k`}
                getAriaLabel={() => 'Salary range'}
                className="font-black"
                sx={{
                  color: 'black', // Change slider color to black
                  '& .MuiSlider-thumb': {
                    borderColor: 'black',
                    backgroundColor: 'black',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: 'black',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#ccc', // optional: change rail color
                  },
                }}
              />
            </Box>
          </div>
        </div>
      </div>
      {/* job Cards section */}
      
      <CreateJobModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      
      <Suspense fallback={<LoadingSpinner />}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <JobList jobs={filteredJobs} />
        )}
      </Suspense>
    </div>
  );
}


