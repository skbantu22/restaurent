// store/reducer/cartReducer.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,

  products: [],
};

const cartSlice = createSlice({
  name: "cartStore",

  initialState,

  reducers: {
    // ---------------- ADD INTO CART ----------------

    addIntoCart: (state, action) => {
      const payload = action.payload;

      const qty = payload.quantity || 1;

      const index = state.products.findIndex(
        (product) =>
          product.productId === payload.productId &&
          product.variantId === payload.variantId,
      );

      // IF PRODUCT ALREADY EXISTS
      if (index >= 0) {
        state.products[index].quantity += qty;
      }

      // NEW PRODUCT
      else {
        state.products.push({
          ...payload,

          quantity: qty,
        });
      }

      state.count += qty;
    },

    // ---------------- INCREASE QUANTITY ----------------

    increaseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;

      const index = state.products.findIndex(
        (product) =>
          product.productId === productId && product.variantId === variantId,
      );

      if (index >= 0) {
        state.products[index].quantity += 1;

        state.count += 1;
      }
    },

    // ---------------- DECREASE QUANTITY ----------------

    decreaseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;

      const index = state.products.findIndex(
        (product) =>
          product.productId === productId && product.variantId === variantId,
      );

      if (index >= 0 && state.products[index].quantity > 1) {
        state.products[index].quantity -= 1;

        state.count -= 1;
      }
    },

    // ---------------- REMOVE PRODUCT ----------------

    removeFromCart: (state, action) => {
      const removed = state.products.find(
        (product) =>
          product.productId === action.payload.productId &&
          product.variantId === action.payload.variantId,
      );

      if (removed) {
        state.count -= removed.quantity;
      }

      state.products = state.products.filter(
        (product) =>
          !(
            product.productId === action.payload.productId &&
            product.variantId === action.payload.variantId
          ),
      );
    },

    // ---------------- CLEAR CART ----------------

    clearCart: (state) => {
      state.products = [];

      state.count = 0;
    },

    // ---------------- SET CART ----------------

    setCart: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [];

      state.products = items;

      state.count = items.reduce((total, item) => {
        return total + Number(item?.quantity || 1);
      }, 0);
    },
  },
});

// ---------------- EXPORT ACTIONS ----------------

export const {
  addIntoCart,

  increaseQuantity,

  decreaseQuantity,

  removeFromCart,

  clearCart,

  setCart,
} = cartSlice.actions;

// ---------------- EXPORT REDUCER ----------------

export default cartSlice.reducer;
