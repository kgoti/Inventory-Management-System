import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [error,      setError]      = useState('');

  const [form, setForm] = useState({
    name:          '',
    description:   '',
    category:      '',
    price:         '',
    stock:         '',
    lowStockLimit: '5',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name) {
      setError('Product name is required.');
      return;
    }

    try {
      await api.post('/products', {
        name:          form.name,
        description:   form.description,
        category:      form.category  || null,
        price:         parseFloat(form.price)  || 0,
        stock:         parseInt(form.stock)    || 0,
        lowStockLimit: parseInt(form.lowStockLimit) || 5,
      });

      navigate('/products');

    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="form-container">

      <div className="form-header">
        <h2>Add Product</h2>
        <Link to="/products">← Back</Link>
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Laptop Stand"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional description"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">-- Select --</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Price (€)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Low Stock Limit</label>
            <input
              type="number"
              name="lowStockLimit"
              value={form.lowStockLimit}
              onChange={handleChange}
              placeholder="5"
              min="1"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Save Product
        </button>

      </form>
    </div>
  );
}

export default AddProduct;