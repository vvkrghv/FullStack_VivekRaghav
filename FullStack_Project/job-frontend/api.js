window.API_BASE_URL = window.API_BASE_URL || "http://localhost:8080/api";

async function fetchAllJobs() {
  const response = await fetch(`${window.API_BASE_URL}/jobs`);
  return response.json();
}

async function searchJobsByKeyword(keyword) {
  const response = await fetch(`${window.API_BASE_URL}/jobs/search?keyword=${encodeURIComponent(keyword)}`);
  return response.json();
}

async function savePreference(preferenceData) {
  const response = await fetch(`${window.API_BASE_URL}/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(preferenceData)
  });
  return response.json();
}

async function fetchRecommendations(preferenceId) {
  const response = await fetch(`${window.API_BASE_URL}/recommendations/${preferenceId}`);
  return response.json();
}