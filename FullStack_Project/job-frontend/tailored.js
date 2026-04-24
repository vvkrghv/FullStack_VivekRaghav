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

const RecommendedJobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <div className="company">{job.companyName}</div>
      <div className="location">{job.location}, {job.country}</div>
      <div className="salary">
        Salary: {job.salaryMin ? `${job.salaryMin} - ${job.salaryMax}` : "Not specified"}
      </div>

      <div className="badges">
        <span className="badge">{job.jobType || "N/A"}</span>
        <span className="badge">{job.remoteType || "N/A"}</span>
        <span className="badge">{job.experienceLevel || "N/A"}</span>
      </div>

      <div className="description">{job.description}</div>

      <div className="info-text">
        <span className="highlight">Skills:</span> {job.skillsRequired || "Not specified"}
      </div>

      <div className="actions">
        <a
          className="btn"
          href={job.applicationUrl || "#"}
          target="_blank"
          rel="noreferrer"
        >
          Apply
        </a>
      </div>
    </div>
  );
};

const TailoredPage = () => {
  const [formData, setFormData] = React.useState({
    preferredRole: "",
    preferredLocation: "",
    preferredJobType: "",
    preferredRemoteType: "",
    skills: "",
    experienceLevel: ""
  });

  const [recommendedJobs, setRecommendedJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);

    try {
      const savePreferenceResponse = await fetch(`${window.API_BASE_URL}/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const savedPreference = await savePreferenceResponse.json();

      const recommendationResponse = await fetch(
        `${window.API_BASE_URL}/recommendations/${savedPreference.id}`
      );

      const jobs = await recommendationResponse.json();
      setRecommendedJobs(jobs);
      setSubmitted(true);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Could not fetch recommendations. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="section-title">Tailored Job Recommendations</h1>

        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="preferredRole"
                placeholder="Preferred Role"
                value={formData.preferredRole}
                onChange={handleChange}
              />

              <input
                type="text"
                name="preferredLocation"
                placeholder="Preferred Location"
                value={formData.preferredLocation}
                onChange={handleChange}
              />

              <select
                name="preferredJobType"
                value={formData.preferredJobType}
                onChange={handleChange}
              >
                <option value="">Select Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Part-Time">Part-Time</option>
              </select>

              <select
                name="preferredRemoteType"
                value={formData.preferredRemoteType}
                onChange={handleChange}
              >
                <option value="">Select Work Mode</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <input
                type="text"
                name="skills"
                placeholder="Skills (comma separated)"
                value={formData.skills}
                onChange={handleChange}
              />

              <input
                type="text"
                name="experienceLevel"
                placeholder="Experience Level"
                value={formData.experienceLevel}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <button className="btn" type="submit">
                Get Recommendations
              </button>
            </div>
          </form>
        </div>

        {loading && <div className="loading-box">Finding the best jobs for you...</div>}

        {!loading && submitted && recommendedJobs.length === 0 && (
          <div className="empty-box">
            No recommendations found. Try changing your preferences.
          </div>
        )}

        {!loading && recommendedJobs.length > 0 && (
          <>
            <h2 className="section-title">Recommended Jobs</h2>
            <div className="job-grid">
              {recommendedJobs.map((job) => (
                <RecommendedJobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}

        <div className="footer">
          Enter your preferences to get tailored job suggestions
        </div>
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<TailoredPage />);