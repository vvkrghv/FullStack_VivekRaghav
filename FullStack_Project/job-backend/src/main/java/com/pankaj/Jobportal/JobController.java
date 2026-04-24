package com.pankaj.Jobportal;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class JobController {

    private final JobRepository jobRepository;
    private final UserPreferenceRepository preferenceRepository;

    public JobController(JobRepository jobRepository, UserPreferenceRepository preferenceRepository) {
        this.jobRepository = jobRepository;
        this.preferenceRepository = preferenceRepository;
    }

    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/jobs/search")
    public List<Job> searchJobs(@RequestParam(defaultValue = "") String keyword) {
        String trimmedKeyword = keyword.trim();
        if (trimmedKeyword.isEmpty()) {
            return jobRepository.findAll();
        }
        return jobRepository.searchByKeyword(trimmedKeyword);
    }

    @PostMapping("/jobs")
    public Job addJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }

    @PutMapping("/jobs/{id}")
    public Job updateJob(@PathVariable Long id, @RequestBody Job job) {
        job.setId(id);
        return jobRepository.save(job);
    }

    @DeleteMapping("/jobs/{id}")
    public void deleteJob(@PathVariable Long id) {
        jobRepository.deleteById(id);
    }

    @PostMapping("/preferences")
    public UserPreference savePreference(@RequestBody UserPreference preference) {
        return preferenceRepository.save(preference);
    }

    @GetMapping("/recommendations/{preferenceId}")
    public List<Job> getRecommendations(@PathVariable Long preferenceId) {
        UserPreference preference = preferenceRepository.findById(preferenceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Preference not found"));

        return jobRepository.findAll().stream()
                .filter(job -> containsIgnoreCase(job.getTitle(), preference.getPreferredRole())
                        || containsIgnoreCase(job.getCategory(), preference.getPreferredRole()))
                .filter(job -> containsIgnoreCase(job.getLocation(), preference.getPreferredLocation()))
                .filter(job -> equalsIgnoreCase(job.getJobType(), preference.getPreferredJobType()))
                .filter(job -> equalsIgnoreCase(job.getRemoteType(), preference.getPreferredRemoteType()))
                .filter(job -> equalsIgnoreCase(job.getExperienceLevel(), preference.getExperienceLevel()))
                .filter(job -> skillsMatch(job.getSkillsRequired(), preference.getSkills()))
                .collect(Collectors.toList());
    }

    private boolean containsIgnoreCase(String source, String expected) {
        if (isBlank(expected)) {
            return true;
        }
        if (source == null) {
            return false;
        }
        return source.toLowerCase(Locale.ROOT).contains(expected.trim().toLowerCase(Locale.ROOT));
    }

    private boolean equalsIgnoreCase(String source, String expected) {
        if (isBlank(expected)) {
            return true;
        }
        if (source == null) {
            return false;
        }
        return source.trim().equalsIgnoreCase(expected.trim());
    }

    private boolean skillsMatch(String jobSkills, String preferredSkills) {
        if (isBlank(preferredSkills)) {
            return true;
        }
        if (isBlank(jobSkills)) {
            return false;
        }

        String normalizedJobSkills = jobSkills.toLowerCase(Locale.ROOT);
        return Arrays.stream(preferredSkills.split(","))
                .map(String::trim)
                .filter(skill -> !skill.isEmpty())
                .anyMatch(skill -> normalizedJobSkills.contains(skill.toLowerCase(Locale.ROOT)));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}