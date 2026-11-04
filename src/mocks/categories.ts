export interface Category {
  id: number;
  name: string;
  slug: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Kopi Susu", slug: "kopi-susu" },
  { id: 2, name: "Espresso", slug: "espresso" },
  { id: 3, name: "Non-Kopi", slug: "non-kopi" },
  { id: 4, name: "Makanan Ringan", slug: "makanan-ringan" },
  { id: 5, name: "Biji Kopi Kemasan", slug: "biji-kopi-kemasan" },
  { id: 6, name: "Buah-Buahan", slug: "buah-buahan" },
];
