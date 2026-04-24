package com.pankaj.Jobportal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String preferredRole;
    private String preferredLocation;
    private String preferredJobType;
    private String preferredRemoteType;
    private String skills;
    private String experienceLevel;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPreferredRole() { return preferredRole; }
    public void setPreferredRole(String preferredRole) { this.preferredRole = preferredRole; }

    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }

    public String getPreferredJobType() { return preferredJobType; }
    public void setPreferredJobType(String preferredJobType) { this.preferredJobType = preferredJobType; }

    public String getPreferredRemoteType() { return preferredRemoteType; }
    public void setPreferredRemoteType(String preferredRemoteType) { this.preferredRemoteType = preferredRemoteType; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
}
