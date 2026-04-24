package com.pankaj.Jobportal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedJobs(JobRepository jobRepository) {
        return args -> {
            if (jobRepository.count() > 0) {
                return;
            }

            Job job1 = new Job();
            job1.setTitle("Frontend Developer Intern");
            job1.setCompanyName("TechNova");
            job1.setLocation("Pune");
            job1.setCountry("India");
            job1.setSalaryMin(15000);
            job1.setSalaryMax(25000);
            job1.setPostedDate(LocalDate.now().minusDays(2));
            job1.setJobType("Internship");
            job1.setRemoteType("Hybrid");
            job1.setExperienceLevel("Fresher");
            job1.setCategory("Software Development");
            job1.setDescription("Work on React UI components and frontend integrations.");
            job1.setSkillsRequired("React, JavaScript, HTML, CSS");
            job1.setApplicationUrl("https://example.com/apply/frontend-intern");

            Job job2 = new Job();
            job2.setTitle("Java Backend Developer");
            job2.setCompanyName("CloudPeak");
            job2.setLocation("Bengaluru");
            job2.setCountry("India");
            job2.setSalaryMin(600000);
            job2.setSalaryMax(1200000);
            job2.setPostedDate(LocalDate.now().minusDays(5));
            job2.setJobType("Full-Time");
            job2.setRemoteType("On-site");
            job2.setExperienceLevel("Mid-Level");
            job2.setCategory("Backend Engineering");
            job2.setDescription("Build scalable REST APIs with Spring Boot and MySQL.");
            job2.setSkillsRequired("Java, Spring Boot, MySQL, REST API");
            job2.setApplicationUrl("https://example.com/apply/java-backend");

            Job job3 = new Job();
            job3.setTitle("Full Stack Developer");
            job3.setCompanyName("NextHire");
            job3.setLocation("Remote");
            job3.setCountry("Global");
            job3.setSalaryMin(800000);
            job3.setSalaryMax(1500000);
            job3.setPostedDate(LocalDate.now().minusDays(1));
            job3.setJobType("Full-Time");
            job3.setRemoteType("Remote");
            job3.setExperienceLevel("Senior");
            job3.setCategory("Software Development");
            job3.setDescription("Develop end-to-end features across frontend and backend.");
            job3.setSkillsRequired("React, Node.js, Java, SQL");
            job3.setApplicationUrl("https://example.com/apply/fullstack");

            jobRepository.saveAll(List.of(job1, job2, job3));
        };
    }
}
