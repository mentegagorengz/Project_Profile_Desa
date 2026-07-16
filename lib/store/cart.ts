import { create } from 'zustand'

export type CartItem = {
  produk_id: string
  nama_produk: string
  harga_per_kg: number
  jumlah_kg: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'jumlah_kg'>, jumlah_kg: number) => void
  updateJumlah: (produk_id: string, jumlah_kg: number) => void
  removeItem: (produk_id: string) => void
  clear: () => void
  total: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item, jumlah_kg) => set((state) => {
    const existing = state.items.find((i) => i.produk_id === item.produk_id)
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.produk_id === item.produk_id ? { ...i, jumlah_kg: i.jumlah_kg + jumlah_kg } : i
        ),
      }
    }
    return { items: [...state.items, { ...item, jumlah_kg }] }
  }),
  updateJumlah: (produk_id, jumlah_kg) => set((state) => ({
    items: state.items.map((i) => (i.produk_id === produk_id ? { ...i, jumlah_kg } : i)),
  })),
  removeItem: (produk_id) => set((state) => ({
    items: state.items.filter((i) => i.produk_id !== produk_id),
  })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.harga_per_kg * i.jumlah_kg, 0),
}))
