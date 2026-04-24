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

const emptyJobForm = {
  title: "",
  companyName: "",
  location: "",
  country: "",
  salaryMin: "",
  salaryMax: "",
  postedDate: "",
  jobType: "",
  remoteType: "",
  experienceLevel: "",
  category: "",
  description: "",
  skillsRequired: "",
  applicationUrl: ""
};

const JobCard = ({ job, onEdit, onDelete }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <div className="company">{job.companyName}</div>
      <div className="location">{job.location}, {job.country}</div>
      <div className="salary">
        Salary: {job.salaryMin ? `${job.salaryMin} - ${job.salaryMax}` : "Not specified"}
      </div>
      <div className="posted">
        Posted: {job.postedDate ? job.postedDate : "Recently"}
      </div>

      <div className="badges">
        <span className="badge">{job.jobType || "N/A"}</span>
        <span className="badge">{job.remoteType || "N/A"}</span>
        <span className="badge">{job.experienceLevel || "N/A"}</span>
        <span className="badge">{job.category || "General"}</span>
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
        <button className="btn btn-secondary" onClick={() => onEdit(job)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(job.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

const JobsPage = () => {
  const [allJobs, setAllJobs] = React.useState([]);
  const [filteredJobs, setFilteredJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const [keyword, setKeyword] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [jobType, setJobType] = React.useState("");
  const [remoteType, setRemoteType] = React.useState("");

  const [formData, setFormData] = React.useState(emptyJobForm);
  const [editingJobId, setEditingJobId] = React.useState(null);

  const applyClientFilters = React.useCallback((jobsData, currentLocation, currentJobType, currentRemoteType) => {
    let result = [...jobsData];

    if (currentLocation.trim() !== "") {
      result = result.filter((job) =>
        (job.location || "").toLowerCase().includes(currentLocation.toLowerCase())
      );
    }

    if (currentJobType.trim() !== "") {
      result = result.filter((job) =>
        (job.jobType || "").toLowerCase() === currentJobType.toLowerCase()
      );
    }

    if (currentRemoteType.trim() !== "") {
      result = result.filter((job) =>
        (job.remoteType || "").toLowerCase() === currentRemoteType.toLowerCase()
      );
    }

    setFilteredJobs(result);
  }, []);

  const fetchJobs = React.useCallback(async (keywordValue = "") => {
    try {
      setLoading(true);
      const endpoint = keywordValue.trim() !== ""
        ? `${window.API_BASE_URL}/jobs/search?keyword=${encodeURIComponent(keywordValue)}`
        : `${window.API_BASE_URL}/jobs`;

      const response = await fetch(endpoint);
      const data = await response.json();
      setAllJobs(data);
      applyClientFilters(data, location, jobType, remoteType);
    } catch (fetchError) {
      console.error("Error loading jobs:", fetchError);
      setError("Unable to load jobs right now.");
    } finally {
      setLoading(false);
    }
  }, [applyClientFilters, jobType, location, remoteType]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keywordFromUrl = params.get("keyword") || "";
    setKeyword(keywordFromUrl);
    fetchJobs(keywordFromUrl);
  }, [fetchJobs]);

  const handleSearch = () => {
    fetchJobs(keyword);
  };

  React.useEffect(() => {
    applyClientFilters(allJobs, location, jobType, remoteType);
  }, [allJobs, applyClientFilters, location, jobType, remoteType]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(emptyJobForm);
    setEditingJobId(null);
  };

  const buildPayload = () => ({
    ...formData,
    salaryMin: formData.salaryMin === "" ? null : Number(formData.salaryMin),
    salaryMax: formData.salaryMax === "" ? null : Number(formData.salaryMax),
    postedDate: formData.postedDate || null
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.companyName.trim()) {
      setError("Title and company are required.");
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload();
      const url = editingJobId ? `${window.API_BASE_URL}/jobs/${editingJobId}` : `${window.API_BASE_URL}/jobs`;
      const method = editingJobId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      resetForm();
      await fetchJobs(keyword);
    } catch (submitError) {
      console.error("Error saving job:", submitError);
      setError("Unable to save job. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJobId(job.id);
    setFormData({
      title: job.title || "",
      companyName: job.companyName || "",
      location: job.location || "",
      country: job.country || "",
      salaryMin: job.salaryMin ?? "",
      salaryMax: job.salaryMax ?? "",
      postedDate: job.postedDate || "",
      jobType: job.jobType || "",
      remoteType: job.remoteType || "",
      experienceLevel: job.experienceLevel || "",
      category: job.category || "",
      description: job.description || "",
      skillsRequired: job.skillsRequired || "",
      applicationUrl: job.applicationUrl || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    setError("");
    try {
      await fetch(`${window.API_BASE_URL}/jobs/${id}`, { method: "DELETE" });
      await fetchJobs(keyword);
      if (editingJobId === id) {
        resetForm();
      }
    } catch (deleteError) {
      console.error("Error deleting job:", deleteError);
      setError("Unable to delete job. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="section-title">Available Jobs</h1>

        <div className="form-box">
          <h3>{editingJobId ? "Edit Job" : "Add New Job"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input name="title" placeholder="Job title *" value={formData.title} onChange={handleInputChange} />
              <input name="companyName" placeholder="Company *" value={formData.companyName} onChange={handleInputChange} />
              <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
              <input name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} />
              <input name="salaryMin" type="number" placeholder="Min salary" value={formData.salaryMin} onChange={handleInputChange} />
              <input name="salaryMax" type="number" placeholder="Max salary" value={formData.salaryMax} onChange={handleInputChange} />
              <input name="postedDate" type="date" value={formData.postedDate} onChange={handleInputChange} />
              <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} />
              <select name="jobType" value={formData.jobType} onChange={handleInputChange}>
                <option value="">Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Part-Time">Part-Time</option>
              </select>
              <select name="remoteType" value={formData.remoteType} onChange={handleInputChange}>
                <option value="">Work Mode</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
              <input name="experienceLevel" placeholder="Experience level" value={formData.experienceLevel} onChange={handleInputChange} />
              <input name="applicationUrl" placeholder="Application URL" value={formData.applicationUrl} onChange={handleInputChange} />
            </div>
            <textarea
              name="description"
              placeholder="Job description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="job-textarea"
            />
            <input
              name="skillsRequired"
              placeholder="Skills (comma separated)"
              value={formData.skillsRequired}
              onChange={handleInputChange}
              className="job-text-input"
            />
            <div style={{ marginTop: "15px" }}>
              <button className="btn" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingJobId ? "Update Job" : "Add Job"}
              </button>
              {editingJobId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
          {error && <div className="error-text">{error}</div>}
        </div>

        <div className="filter-bar">
          <div className="filter-grid">
            <input
              type="text"
              placeholder="Search by title or company"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <input
              type="text"
              placeholder="Filter by location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="">All Job Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
              <option value="Part-Time">Part-Time</option>
            </select>

            <select value={remoteType} onChange={(e) => setRemoteType(e.target.value)}>
              <option value="">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div style={{ marginTop: "15px" }}>
            <button className="btn" onClick={handleSearch}>Search</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-box">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-box">
            No jobs found matching your search or filters.
          </div>
        ) : (
          <div className="job-grid">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <div className="footer">
          Browse jobs by title, company, location and work mode
        </div>
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<JobsPage />);