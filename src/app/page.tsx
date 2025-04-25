"use client";
import Image from "next/image";
import logo from "../../public/cmwlogo.png";
import Link from "next/link";
import { AlignJustify, MapPin, Search, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import CreateJobModal from "./components/CreateJobModel";
import { server } from "../../db";
import { useIsMobile } from "./hooks/useIsMobile";
export default function Home() {
  const [navbar, setNavbar] = useState(true);
  const isMobile = useIsMobile();
  function getHoursAgo(isoDateString) {
    const pastDate = new Date(isoDateString);
    const now = new Date();

    const diffInMs = now - pastDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "less then 1h";
    } else if (diffInHours === 1) {
      return "1h Ago";
    } else {
      return `${diffInHours}h Ago`;
    }
  }

  // const jobs = [
  //   {
  //     jobTitle: "Data Scientist",
  //     companyName: "Data Analytics Pro",
  //     location: "Boston, MA",
  //     jobType: "Full-time",
  //     salaryRange: "110000-140000",
  //     jobDescription:
  //       "We're looking for a Data Scientist to help us extract insights from complex datasets and build predictive models.",
  //     requirements:
  //       "Master's degree in Data Science or related field\n3+ years of experience in data analysis\nProficiency in Python and R\nExperience with machine learning algorithms\nStrong statistical knowledge",
  //     responsibilities:
  //       "Develop and implement machine \nAnalyze large datasets\nCreate data visualizations\nCollaborate with business teams\nPresent findings to stakeholders",
  //     applicationDeadline: "2025-06-30T23:59:59Z",
  //     createdAt: "2025-04-24T07:15:51.697Z",
  //   },
  //   {
  //     jobTitle: "Machine Learning Engineer",
  //     companyName: "AI Solutions Inc.",
  //     location: "San Francisco, CA",
  //     jobType: "Full-time",
  //     salaryRange: "120000-150000",
  //     jobDescription:
  //       "Join our AI team to build intelligent systems and predictive algorithms that solve real-world problems.",
  //     requirements:
  //       "Bachelor's degree in Computer Science\nExperience with TensorFlow and PyTorch\nSolid Python programming skills\nUnderstanding of deep learning architectures",
  //     responsibilities:
  //       "Design ML pipelines\nTrain and deploy models\nEvaluate performance metrics\nWork with product teams\nMaintain model accuracy",
  //     applicationDeadline: "2025-07-15T23:59:59Z",
  //     createdAt: "2025-04-24T07:15:51.697Z",
  //   },
  //   {
  //     jobTitle: "Business Intelligence Analyst",
  //     companyName: "Insight Corp",
  //     location: "New York, NY",
  //     jobType: "Contract",
  //     salaryRange: "90000-115000",
  //     jobDescription:
  //       "Seeking a BI Analyst to deliver actionable insights using data visualization tools and dashboards.",
  //     requirements:
  //       "Proficiency in SQL\nExperience with Tableau or Power BI\nStrong communication skills\nBachelor’s in Analytics or similar",
  //     responsibilities:
  //       "Build dashboards\nWork with stakeholders\nPrepare reports\nOptimize database queries\nIdentify business trends",
  //     applicationDeadline: "2025-08-10T23:59:59Z",
  //     createdAt: "2025-04-24T07:15:51.697Z",
  //   },
  //   {
  //     jobTitle: "Data Analyst",
  //     companyName: "FinTech Dynamics",
  //     location: "Austin, TX",
  //     jobType: "Part-time",
  //     salaryRange: "65000-85000",
  //     jobDescription:
  //       "We are hiring a Data Analyst to track performance and assist in decision-making processes with data insights.",
  //     requirements:
  //       "Experience with Excel and SQL\nUnderstanding of business KPIs\n1+ years in analytics\nBachelor’s degree",
  //     responsibilities:
  //       "Analyze performance metrics\nReport generation\nTrend analysis\nSupport decision making\nData cleaning",
  //     applicationDeadline: "2025-07-01T23:59:59Z",
  //     createdAt: "2025-04-24T07:15:51.697Z",
  //   },
  //   {
  //     jobTitle: "AI Researcher",
  //     companyName: "Quantum AI Lab",
  //     location: "Seattle, WA",
  //     jobType: "Remote",
  //     salaryRange: "140000-170000",
  //     jobDescription:
  //       "Join our research lab to explore and publish breakthroughs in artificial intelligence and machine learning.",
  //     requirements:
  //       "Ph.D. in AI/ML or related field\nPublications in top-tier conferences\nStrong coding skills\nResearch experience",
  //     responsibilities:
  //       "Research and publish papers\nPrototype algorithms\nCollaborate with academics\nConduct experiments",
  //     applicationDeadline: "2025-10-01T23:59:59Z",
  //     createdAt: "2025-04-24T07:15:51.697Z",
  //   },
  //   {
  //     jobTitle: "Data Engineer",
  //     companyName: "DataStack",
  //     location: "Chicago, IL",
  //     jobType: "Full-time",
  //     salaryRange: "105000-130000",
  //     jobDescription:
  //       "Build and maintain scalable data pipelines for various product and analytics teams.",
  //     requirements:
  //       "Experience with ETL tools\nProficiency in Python or Scala\nFamiliarity with AWS/GCP\nSQL expertise",
  //     responsibilities:
  //       "Design data pipelines\nEnsure data quality\nMonitor system health\nDocument architecture",
  //     applicationDeadline: "2025-09-20T23:59:59Z",
  //     createdAt: "2025-04-24T07:15:51.697Z",
  //   },
  //   {
  //     jobTitle: "NLP Engineer",
  //     companyName: "VoiceBot AI",
  //     location: "Remote",
  //     jobType: "Contract",
  //     salaryRange: "95000-125000",
  //     jobDescription:
  //       "We're looking for an NLP Engineer to enhance our chatbot and voice assistant capabilities.",
  //     requirements:
  //       "Experience with NLP libraries (spaCy, NLTK)\nKnowledge of transformer models\nGood Python skills\nUnderstanding of conversational AI",
  //     responsibilities:
  //       "Train NLP models\nImprove text understanding\nAnalyze user input\nEnhance intent detection",
  //     applicationDeadline: "2025-08-31T23:59:59Z",
  //     createdAt: "2025-04-24T07:15:51.697Z",
  //   },
  //   {
  //     jobTitle: "Data Architect",
  //     companyName: "Cloudify Solutions",
  //     location: "Denver, CO",
  //     jobType: "Full-time",
  //     salaryRange: "130000-160000",
  //     jobDescription:
  //       "Design modern data platforms and architecture for our enterprise-grade clients.",
  //     requirements:
  //       "Strong knowledge of cloud platforms\nData modeling experience\nETL design skills\nArchitect-level certifications",
  //     responsibilities:
  //       "Architect data lakes\nDefine data strategy\nEnsure governance\nWork with engineering teams",
  //     applicationDeadline: "2025-07-25T23:59:59Z",
  //     createdAt: "2025-04-24T07:15:51.697Z",
  //   },
  //   {
  //     jobTitle: "Junior Data Analyst",
  //     companyName: "StartUpBoost",
  //     location: "Remote",
  //     jobType: "Internship",
  //     salaryRange: "20000-30000",
  //     jobDescription:
  //       "Great opportunity for a fresher to explore the world of data analysis in a startup environment.",
  //     requirements:
  //       "Currently pursuing or completed Bachelor’s\nGood with Excel & SQL\nCuriosity to learn\nProblem-solving skills",
  //     responsibilities:
  //       "Assist senior analysts\nRun data queries\nClean datasets\nMake visualizations",
  //     applicationDeadline: "2025-06-20T23:59:59Z",
  //     createdAt: "2025-04-24T07:15:51.697Z",
  //   },
  //   {
  //     jobTitle: "Statistical Analyst",
  //     companyName: "HealthData Pros",
  //     location: "Atlanta, GA",
  //     jobType: "Full-time",
  //     salaryRange: "95000-110000",
  //     jobDescription:
  //       "Looking for a Statistical Analyst to help with epidemiological studies and data research.",
  //     requirements:
  //       "Strong background in statistics\nProficiency with R and SAS\nExperience in health domain preferred",
  //     responsibilities:
  //       "Run statistical models\nInterpret data findings\nCollaborate with researchers\nPublish reports",
  //     applicationDeadline: "2025-09-10T23:59:59Z",
  //     createdAt: "2025-04-24T07:15:51.697Z",
  //   },
  // ];

  useEffect(() => {
    if (isMobile) {
      setNavbar(false); // auto-close navbar if screen is larger than md
    } else {
      setNavbar(true);
    }
  }, [isMobile]);

  const [isOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
console.log(loading,error)
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
        setError(err.message || "Something went wrong");
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
      <div className="flex justify-between items-center py-5 px-45 shadow-lg ">
        <div className="flex justify-center items-center border-r-2 border-gray-300 pr-3">
          <Search className="text-gray-400" /> &nbsp;&nbsp;
          <input type="text" className="outline-none" placeholder="Search by Job Title, Role " />
        </div>
        <div className="flex justify-center items-center border-r-2 pr-3 border-gray-300">
          <MapPin className="text-gray-400" /> &nbsp;&nbsp;
          <input type="text" placeholder="Preferref locations" />
        </div>
        <div className="flex justify-center items-center border-r-2 pr-3 border-gray-300">
          <UserSearch className="text-gray-400" /> &nbsp;&nbsp;
          <input type="text" placeholder="Job type" />
        </div>
        <div className="flex justify-center items-center ">
          salary pern month
        </div>
      </div>
      {/* job Cards section */}
      
      <CreateJobModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex flex-wrap gap-10 p-9 ">
        
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
    </div>
  );
}


