import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductDataType {
  productId: string;
  variantId:  string;
  name:  string;
  url:  string;
  size:  string;
  color:  string;
  mrp:  number;
  sellingPrice:  number;
  media:  string;
  qty:  number;
}

interface IntialStateDataType {
  products:ProductDataType[];
  count:number;
}

const initialState:IntialStateDataType = {
  products:[],
  count: 0
};

export const cartReducer = createSlice({
  name: "cartStore",
  initialState,
  reducers: {
    addToCart:(state, action)=>{
      const payload = action.payload;
      const existingProduct = state.products.findIndex(
        (product)=>((product.productId === payload.productId) && (product.variantId === payload.variantId))
      )
      if(existingProduct < 0){
        state.products.push(payload);
        state.count = state.products.length
      }
    },

    increaseQuantity:(state, action)=>{
      const { productId, variantId } = action.payload;
      const existingProduct = state.products.findIndex(
        (product)=>((product.productId === productId) && (product.variantId === variantId))
      )
      if(existingProduct >= 0){
        state.products[existingProduct].qty += 1
      }
    },
    decreaseQuantity:(state, action)=>{
      const { productId, variantId } = action.payload;
      const existingProduct = state.products.findIndex(
        (product)=>((product.productId === productId) && (product.variantId === variantId))
      )
      if(existingProduct >=0){
        if(state.products[existingProduct].qty > 1){
          state.products[existingProduct].qty -= 1
        }
      }
    },
    removeFromCart:(state, action)=>{
      const { productId, variantId } = action.payload;
      state.products = state.products.filter((product)=>!((product.productId === productId) && (product.variantId === variantId)));
      state.count = state.products.length
    },
    clearCart:(state)=>{
      state.products = [];
      state.count = 0
    }
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart  } = cartReducer.actions;
export default cartReducer.reducer;
