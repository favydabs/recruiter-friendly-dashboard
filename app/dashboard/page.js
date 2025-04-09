"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [filters, setFilters] = useState({
    role: "",
    experience: "",
    techStack: "",
  });

  useEffect(() => {
    const storedCandidates = localStorage.getItem("candidates");
    if (storedCandidates) {
      const parsedCandidates = JSON.parse(storedCandidates);
      setCandidates(parsedCandidates);
      setFilteredCandidates(parsedCandidates);
    }
  }, []);

  useEffect(() => {
    let result = [...candidates];

    if (filters.role) {
      result = result.filter((candidate) =>
        candidate.jobRole.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    if (filters.experience) {
      result = result.filter(
        (candidate) => candidate.experienceLevel === filters.experience
      );
    }

    if (filters.techStack) {
      result = result.filter((candidate) =>
        candidate.techStack.some((tech) =>
          tech.toLowerCase().includes(filters.techStack.toLowerCase())
        )
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.fullName.localeCompare(b.fullName);
      } else if (sortBy === "experience") {
        const levels = { Junior: 1, Mid: 2, Senior: 3 };
        return levels[a.experienceLevel] - levels[b.experienceLevel];
      }
      return 0;
    });

    setFilteredCandidates(result);
  }, [candidates, sortBy, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const experienceBadgeColor = (level) => {
    switch (level) {
      case "Junior":
        return "bg-green-100 text-green-800";
      case "Mid":
        return "bg-blue-100 text-blue-800";
      case "Senior":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold ">Candidates Dashboard</h1>
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-xl">
          Add New Candidate
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sort By:</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full border rounded-xl p-2"
            >
              <option value="name">Name</option>
              <option value="experience">Experience Level</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Filter by Role:
            </label>
            <input
              type="text"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              placeholder="Enter role..."
              className="w-full border rounded-xl p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Filter by Experience:
            </label>
            <select
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
              className="w-full border rounded-xl p-2"
            >
              <option value="">All Levels</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Filter by Tech Stack:
            </label>
            <input
              type="text"
              name="techStack"
              value={filters.techStack}
              onChange={handleFilterChange}
              placeholder="e.g., React"
              className="w-full border rounded-xl p-2"
            />
          </div>
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No candidates match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((candidate, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 bg-white shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{candidate.fullName}</h3>
                  <p className="text-gray-600">{candidate.jobRole}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${experienceBadgeColor(
                    candidate.experienceLevel
                  )}`}
                >
                  {candidate.experienceLevel}
                </span>
              </div>

              <div className="mt-3 flex space-x-3">
                {candidate.linkedInUrl && (
                  <a
                    href={candidate.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}

                {candidate.gitHubUrl && (
                  <a
                    href={candidate.gitHubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
              </div>

              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {candidate.techStack.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
