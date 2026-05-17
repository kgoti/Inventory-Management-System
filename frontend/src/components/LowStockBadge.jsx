import React from 'react';
import { useEffect, useState } from 'react';

function LowStockBadge({ stock, lowStockLimit }) {
  if (stock === 0) {
    return <span className="badge out-of-stock">Out of Stock</span>;
  }

  if (stock <= lowStockLimit) {
    return <span className="badge low-stock">Low Stock</span>;
  }

  return <span className="badge in-stock">In Stock</span>;
}

export default LowStockBadge;