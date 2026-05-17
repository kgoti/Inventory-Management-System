const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: true,
    trim:     true,
  },

  description: {
    type:    String,
    default: '',
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Category',
  },

  price: {
    type:    Number,
    default: 0,
  },

  stock: {
    type:    Number,
    default: 0,
  },

  lowStockLimit: {
    type:    Number,
    default: 5,
  },

},
{ timestamps: true });

module.exports = mongoose.model('Product', productSchema);