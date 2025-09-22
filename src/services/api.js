// src/services/api.js
import axios from "axios";


const API_URL = "https://crudcrud.com/api/0aa046a23a2249c8959e537614555916/books";
// const API_URL = "https://reqres-free-v1/api/books";


export const getBooks = () => axios.get(API_URL);
export const addBook = (book) => axios.post(API_URL, book);
export const updateBook = (id, book) => axios.put(`${API_URL}/${id}`, book);
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`);
