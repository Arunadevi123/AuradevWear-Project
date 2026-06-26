import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cart_guest') || '[]'),
  total: JSON.parse(localStorage.getItem('cart_total') || '0'),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      state.total = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

      localStorage.setItem('cart_guest', JSON.stringify(state.items));
      localStorage.setItem('cart_total', JSON.stringify(state.total));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.total = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

      localStorage.setItem('cart_guest', JSON.stringify(state.items));
      localStorage.setItem('cart_total', JSON.stringify(state.total));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) item.quantity = quantity;
      state.total = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

      localStorage.setItem('cart_guest', JSON.stringify(state.items));
      localStorage.setItem('cart_total', JSON.stringify(state.total));
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;

      localStorage.removeItem('cart_guest');
      localStorage.removeItem('cart_total');
    },
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.total = action.payload.total || 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
