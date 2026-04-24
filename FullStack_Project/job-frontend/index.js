const Navbar = () => {
  return (
    <nav>
      <div className="logo">Job Portal</div>
      <div className="nav-links">
        <a href="index.html">Home</a>
        <a href="jobs.html">Jobs</a>
        <a href="tailored.html">Tailored Jobs</a>
      </div>
    </nav>
  );
};

const CategoryCard = ({ title, subtitle }) => {
  return (
    <div className="category-card">
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="stat-card">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
};

const FeaturedJobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <div className="company">{job.companyName}</div>
      <div className="location">{job.location}, {job.country}</div>
      <div className="salary">
        Salary: {job.salaryMin ? `${job.salaryMin} - ${job.salaryMax}` : "Not specified"}
      </div>
      <div className="badges">
        <span className="badge">{job.jobType}</span>
        <span className="badge">{job.remoteType}</span>
        <span className="badge">{job.experienceLevel}</span>
      </div>
      <div className="description">{job.description}</div>
      <div className="actions">
        <a className="btn" href="jobs.html">View More Jobs</a>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [keyword, setKeyword] = React.useState("");
  const [featuredJobs, setFeaturedJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${window.API_BASE_URL}/jobs`)
      .then((res) => res.json())
      .then((data) => {
        setFeaturedJobs(data.slice(0, 3));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      window.location.href = `jobs.html?keyword=${encodeURIComponent(trimmedKeyword)}`;
    } else {
      window.location.href = "jobs.html";
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="hero">
          <h1>Find Jobs Across the World</h1>
          <p>
            Search internships, fresher jobs, remote roles, and full-time opportunities
            tailored to your interests.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by job title or company"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button className="btn" onClick={handleSearch}>Search Jobs</button>
          </div>
        </div>

        <h2 className="section-title">Popular Categories</h2>
        <div className="categories">
          <CategoryCard title="Remote Jobs" subtitle="Work from anywhere" />
          <CategoryCard title="Internships" subtitle="Perfect for students" />
          <CategoryCard title="Fresher Jobs" subtitle="Start your career" />
          <CategoryCard title="Full-Time" subtitle="Long-term opportunities" />
        </div>

        <h2 className="section-title">Portal Highlights</h2>
        <div className="stats-grid">
          <StatCard title="Searchable Listings" value="100+" />
          <StatCard title="Countries Covered" value="Global" />
          <StatCard title="Tailored Matching" value="Smart" />
        </div>

        <h2 className="section-title">Featured Jobs</h2>

        {loading ? (
          <div className="loading-box">Loading featured jobs...</div>
        ) : featuredJobs.length === 0 ? (
          <div className="empty-box">No jobs found. Start the backend and add sample data.</div>
        ) : (
          <div className="job-grid">
            {featuredJobs.map((job) => (
              <FeaturedJobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        <div className="footer">
          Minimal Job Portal Project using React, Spring Boot and MySQL
        </div>
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<HomePage />);