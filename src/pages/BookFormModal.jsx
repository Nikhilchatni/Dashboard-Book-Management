// src/components/BookFormModal.jsx
import React, { useEffect, useState } from "react";
import { addBook, updateBook } from "../services/api";

export default function BookFormModal({ onClose, initialData, onSaved }) {
    const [form, setForm] = useState({
        title: "",
        author: "",
        genre: "",
        year: "",
        status: "Available",
    });

    const [saving, setSaving] = useState(false); // new state

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || "",
                author: initialData.author || "",
                genre: initialData.genre || "",
                year: initialData.year || "",
                status: initialData.status || "Available",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); // start saving
        try {
            const payload = { ...form };
            if (initialData && initialData._id) {
                await updateBook(initialData._id, payload);
                alert("Book updated");
            } else {
                await addBook(payload);
                alert("Book added");
            }
            onSaved();
            setForm({ title: "", author: "", genre: "", year: "", status: "Available" });
        } catch (err) {
            console.error(err);
            alert("Save failed");
        } finally {
            setSaving(false); // stop saving
        }
    };

    // Prevent closing modal when clicking inside modal content
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div
                className="bg-white rounded shadow-lg z-10 w-full max-w-md p-6"
                onClick={handleModalClick}
            >
                <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Book" : "Add Book"}</h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        name="author"
                        placeholder="Author"
                        value={form.author}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        name="genre"
                        placeholder="Genre"
                        value={form.genre}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        name="year"
                        placeholder="Year"
                        value={form.year}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option>Available</option>
                        <option>Issued</option>
                    </select>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-4 py-2 rounded text-white ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
