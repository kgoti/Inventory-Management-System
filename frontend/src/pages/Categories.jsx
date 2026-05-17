import React from 'react';
import { useState, useEffect } from 'react';
import api from '../api/axios';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name,       setName]       = useState('');
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      await api.post('/categories', { name });
      setName('');
      fetchCategories();
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="page-title">Categories</h2>

      {/* Add category form */}
      <div className="form-container" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '16px' }}>Add New Category</h3>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleAdd} className="inline-form">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Add
          </button>
        </form>
      </div>

      {/* Categories list */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="empty">No categories yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="link-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default Categories;