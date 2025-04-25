"use client";
import Image from "next/image";
import logo from "../../public/cmwlogo.png";
import Link from "next/link";
import { AlignJustify, MapPin, Search, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import CreateJobModal from "./components/CreateJobModel";
import { server } from "../../db";
import { useIsMobile } from "./hooks/useIsMobile";

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

export default function Home() {
  const [navbar, setNavbar] = useState(true);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 2000000]);

  // Get unique locations and job types for dropdowns
  const locations = Array.from(new Set(jobs.map(job => job.location)));
  const jobTypes = Array.from(new Set(jobs.map(job => job.jobType)));

  // Filter jobs based on search criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesJobType = !selectedJobType || job.jobType === selectedJobType;
    
    // Parse salary range
    const [minSalary, maxSalary] = job.salaryRange.split('-').map(Number);
    const matchesSalary = minSalary >= salaryRange[0] && maxSalary <= salaryRange[1];

    return matchesSearch && matchesLocation && matchesJobType && matchesSalary;
  });

  function getHoursAgo(isoDateString: string) {
    const pastDate = new Date(isoDateString);
    const now = new Date();
  
    const diffInMs = now.getTime() - pastDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
    if (diffInHours < 1) return "less than 1h";
    if (diffInHours === 1) return "1h ago";
    return `${diffInHours}h ago`;
  }

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
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-[#fbfbff]">
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
      {/* filter sectopm */}
      <div className="flex flex-col md:flex-row justify-between items-center py-5 px-4 md:px-8 shadow-lg gap-4">
        <div className="flex items-center border-r-2 border-gray-300 pr-3 w-full md:w-auto">
          <Search className="text-gray-400" />
          <input
            type="text"
            className="outline-none ml-2 w-full"
            placeholder="Search by Job Title, Role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center border-r-2 pr-3 border-gray-300 w-full md:w-auto">
          <MapPin className="text-gray-400" />
          <select
            className="outline-none ml-2 w-full"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center border-r-2 pr-3 border-gray-300 w-full md:w-auto">
          <UserSearch className="text-gray-400" />
          <select
            className="outline-none ml-2 w-full"
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
          >
            <option value="">All Job Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col items-center w-full md:w-auto">
          <label className="text-sm text-gray-600 mb-1">Salary Range (₹)</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="2000000"
              step="10000"
              value={salaryRange[0]}
              onChange={(e) => setSalaryRange([Number(e.target.value), salaryRange[1]])}
              className="w-32"
            />
            <span className="text-sm">{salaryRange[0].toLocaleString()}</span>
            <span>-</span>
            <input
              type="range"
              min="0"
              max="2000000"
              step="10000"
              value={salaryRange[1]}
              onChange={(e) => setSalaryRange([salaryRange[0], Number(e.target.value)])}
              className="w-32"
            />
            <span className="text-sm">{salaryRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
      {/* job Cards section */}
      
      <CreateJobModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex flex-wrap gap-10 p-9 ">
        
        {filteredJobs.map((job, index) => (
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
    </div>
  );
}


