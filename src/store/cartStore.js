import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // Array of tests
      labId: null,

      addToCart: (test, lab) => {
        // Add full lab object to the test for grouping later
        const testWithLab = { ...test, labDetails: lab };

        // Check if already in cart
        const exists = get().items.find((item) => item._id === test._id);
        if (exists) {
          return { success: false, message: 'Test is already in your cart.' };
        }

        set({ items: [...get().items, testWithLab] });
        return { success: true };
      },

      removeFromCart: (testId) => {
        const newItems = get().items.filter(item => item._id !== testId);
        set({ items: newItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.discountedPrice, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
