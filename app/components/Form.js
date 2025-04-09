"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    jobRole: "",
    linkedInUrl: "",
    gitHubUrl: "",
    experienceLevel: "Junior",
    techStack: [],
  });
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    const storedCandidates = localStorage.getItem("candidates");
    if (storedCandidates) {
      setCandidates(JSON.parse(storedCandidates));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTechInputChange = (e) => {
    setTechInput(e.target.value);
  };

  const addTechStack = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTech = (tech) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((item) => item !== tech),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCandidates = [...candidates, formData];
    setCandidates(newCandidates);
    localStorage.setItem("candidates", JSON.stringify(newCandidates));

    setFormData({
      fullName: "",
      jobRole: "",
      linkedInUrl: "",
      gitHubUrl: "",
      experienceLevel: "Junior",
      techStack: [],
    });
  };

  return (
    <div className="container mx-auto p-4 w-1/2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Candidate Entry Form</h1>
        <Link
          href="/dashboard"
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          View Dashboard
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-50 p-6 rounded-xl shadow"
      >
        <div className="mb-4">
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-xl"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Job Role / Position applied for</label>
          <input
            type="text"
            name="jobRole"
            value={formData.jobRole}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-xl"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">LinkedIn URL</label>
          <input
            type="url"
            name="linkedInUrl"
            value={formData.linkedInUrl}
            onChange={handleChange}
            className="w-full border p-2 rounded-xl"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">GitHub URL</label>
          <input
            type="url"
            name="gitHubUrl"
            value={formData.gitHubUrl}
            onChange={handleChange}
            className="w-full border p-2 rounded-xl"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Experience Level</label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full border p-2 rounded-xl"
          >
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1">Tech Stack</label>
          <div className="flex">
            <input
              type="text"
              value={techInput}
              onChange={handleTechInputChange}
              placeholder="e.g. React, Node.js"
              className="flex-grow border p-2 rounded-xl"
            />
            <button
              type="button"
              onClick={addTechStack}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.techStack.map((tech, index) => (
              <span
                key={index}
                className="bg-gray-200 px-2 py-1 rounded flex items-center"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-xl"
        >
          Submit Candidate
        </button>
      </form>
    </div>
  );
}
