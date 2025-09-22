// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/api";
import BookFormModal from "./BookFormModal";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog"; // ✅ import ConfirmDialog
import loadingGif from "../assets/loading.gif";

const PER_PAGE = 10;

export default function Dashboard() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [genreFilter, setGenreFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    // ✅ ConfirmDialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await getBooks();
            setBooks(res.data || []);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch books");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Trigger ConfirmDialog
    const handleDelete = (book) => {
        setBookToDelete(book);
        setConfirmOpen(true);
    };

    // ✅ Called when ConfirmDialog 'Delete' is clicked
    const confirmDelete = async () => {
        if (!bookToDelete) return;
        try {
            await deleteBook(bookToDelete._id);
            // alert("Book deleted");
            fetchBooks();
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        } finally {
            setConfirmOpen(false);
            setBookToDelete(null);
        }
    };

    // filtering
    const filtered = books.filter((b) => {
        const q = search.toLowerCase();
        const matchesSearch =
            !q ||
            (b.title && b.title.toLowerCase().includes(q)) ||
            (b.author && b.author.toLowerCase().includes(q));
        const matchesGenre = genreFilter === "All" || b.genre === genreFilter;
        const matchesStatus = statusFilter === "All" || b.status === statusFilter;
        return matchesSearch && matchesGenre && matchesStatus;
    });

    // pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const start = (currentPage - 1) * PER_PAGE;
    const pageData = filtered.slice(start, start + PER_PAGE);

    const genres = ["All", ...new Set(books.map((b) => b.genre || "").filter(Boolean))];
    const statuses = ["All", "Available", "Issued"];

    return (
        <div className="p-6">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">📚 Book Dashboard</h1>
                <button
                    onClick={() => {
                        setEditingBook(null);
                        setModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Add Book
                </button>
            </div>

            {/* controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search title/author..."
                    className="px-3 py-2 border rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="px-3 py-2 border rounded">
                    {genres.map((g) => (
                        <option key={g}>{g}</option>
                    ))}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded">
                    {statuses.map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-3">Title</th>
                            <th className="border border-gray-300 px-4 py-3">Author</th>
                            <th className="border border-gray-300 px-4 py-3">Genre</th>
                            <th className="border border-gray-300 px-4 py-3">Year</th>
                            <th className="border border-gray-300 px-4 py-3">Status</th>
                            <th className="border border-gray-300 px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-6 text-center">
                                    <img src={loadingGif} alt="Loading..." className="mx-auto w-16 h-16" />
                                </td>
                            </tr>
                        ) : pageData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                                    No books found
                                </td>
                            </tr>
                        ) : (
                            pageData.map((book) => (
                                <tr key={book._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 border">{book.title}</td>
                                    <td className="px-4 py-3 border">{book.author}</td>
                                    <td className="px-4 py-3 border">{book.genre}</td>
                                    <td className="px-4 py-3 border">{book.year}</td>
                                    <td className="px-4 py-3 border">{book.status}</td>
                                    <td className="px-4 py-3 border">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingBook(book);
                                                    setModalOpen(true);
                                                }}
                                                className="px-2 py-1 border rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book)}
                                                className="px-2 py-1 border rounded text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            <div className="mt-4">
                <Pagination current={currentPage} totalPages={totalPages} onChange={(p) => setCurrentPage(p)} />
            </div>

            {/* Book Form Modal */}
            {modalOpen && (
                <BookFormModal
                    onClose={() => setModalOpen(false)}
                    initialData={editingBook}
                    onSaved={() => {
                        setModalOpen(false);
                        fetchBooks();
                    }}
                />
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                description={`Are you sure you want to delete "${bookToDelete?.title}"?`}
            />
        </div>
    );
}
