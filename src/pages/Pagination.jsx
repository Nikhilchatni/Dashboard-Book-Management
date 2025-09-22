// src/components/Pagination.jsx
import React from "react";

export default function Pagination({ current, totalPages, onChange }) {
    return (
        <div className="flex gap-2">
            <button
                disabled={current === 1}
                onClick={() => onChange(current - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`px-3 py-1 border rounded ${p === current ? "bg-blue-600 text-white" : ""}`}
                >
                    {p}
                </button>
            ))}
            <button
                disabled={current === totalPages}
                onClick={() => onChange(current + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
