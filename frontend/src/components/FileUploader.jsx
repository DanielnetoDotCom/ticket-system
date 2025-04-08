import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const FileUploader = ({ ticketId }) => {
    const [file, setFile] = useState(null);
    const [versions, setVersions] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [selectedVersion, setSelectedVersion] = useState("");

    const fetchFiles = async () => {
        const res = await axios.get(`${API_URL}/tickets/${ticketId}/files`);
        const feedbacksRes = await axios.get(`${API_URL}/tickets/${ticketId}/feedbacks`);

        // Merge feedbacks into version list
        const enriched = res.data.map((v) => {
            const matching = feedbacksRes.data.find((f) => f.version === v.version);
            return {
                ...v,
                feedbacks: matching ? matching.feedbacks : [],
            };
        });


        setVersions(enriched);
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        await axios.post(`${API_URL}/tickets/${ticketId}/upload`, formData);
        setFile(null);
        fetchFiles();
    };

    const handleSendFeedback = async () => {
        if (!selectedVersion || !feedback) return;
        await axios.post(`${API_URL}/tickets/${ticketId}/feedback`, {
            version: selectedVersion,
            feedback,
        });
        setFeedback("");
        setSelectedVersion("");
        fetchFiles();
    };

    const handleDeleteVersion = async (version) => {
        if (!confirm(`Are you sure you want to delete version ${version}?`)) return;
        await axios.delete(`${API_URL}/tickets/${ticketId}/version/${version}`);
        fetchFiles();
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold text-lg text-indigo-700 mb-2">Design Files & Feedback</h4>

            {/* Upload form */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
                <label className="block w-full">
                    <span className="text-sm font-medium text-gray-700">Select an image file</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block w-full mt-1 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                    />
                </label>
                <button
                    onClick={handleUpload}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                >
                    Upload File
                </button>
            </div>

            {/* Feedback form */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-6">
                <select
                    value={selectedVersion}
                    onChange={(e) => setSelectedVersion(e.target.value)}
                    className="w-full sm:w-40 p-2 border border-gray-300 rounded text-sm"
                >
                    <option value="">Select version</option>
                    {versions.map((v) => (
                        <option key={v.version} value={v.version}>
                            {v.version}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Write feedback..."
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <button
                    onClick={handleSendFeedback}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                >
                    Submit
                </button>
            </div>

            {/* Version list */}
            {versions.length === 0 ? (
                <p className="text-gray-500 text-sm">No files uploaded yet.</p>
            ) : (
                <div className="space-y-3">
                    {versions.map((v, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded border">
                            <div className="flex justify-between items-center mb-1">
                                <h5 className="font-semibold text-gray-800">{v.version}</h5>
                                <button
                                    onClick={() => handleDeleteVersion(v.version)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Delete version
                                </button>
                            </div>

                            <ul className="pl-0 text-sm text-gray-700 space-y-1">
                                {v.files.map((f, i) => (
                                    <li key={i}>
                                        <a
                                            href={`${API_URL}/uploads/${ticketId}/${v.version}/${f}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {f}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            {v.feedbacks && v.feedbacks.length > 0 && (
                                <div className="mt-3 bg-white border rounded p-2 text-sm text-gray-800">
                                    <div className="font-medium text-gray-700 mb-1">Feedbacks:</div>
                                    <ul className="space-y-1">
                                        {v.feedbacks.map((fb, i) => (
                                            <li key={i}>
                                                <div className="text-gray-800">{fb.text}</div>
                                                <div className="text-xs text-gray-500">
                                                    Submitted at {new Date(fb.createdAt).toLocaleString()}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUploader;
