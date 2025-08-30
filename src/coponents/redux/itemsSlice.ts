import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchItems, addItem, updateItemDB, deleteItemDB } from '../database';

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

export const loadItems = createAsyncThunk('items/loadItems', async () => {
  const items = await fetchItems();
  return items;
});

export const createItem = createAsyncThunk(
  'items/createItem',
  async ({ name, description, price, category }: { name: string; description: string; price: number; category: string }) => {
    const id = await addItem(name, description, price, category);
    return { id, name, description, price, category };
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, name, description, price, category }: { id: number; name: string; description: string; price: number; category: string }) => {
    await updateItemDB(id, name, description, price, category);
    return { id, name, description, price, category };
  }
);

export const removeItem = createAsyncThunk('items/removeItem', async (id: number) => {
  await deleteItemDB(id);
  return id;
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadItems.pending, state => {
        state.loading = true;
      })
      .addCase(loadItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error loading items';
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default itemsSlice.reducer;