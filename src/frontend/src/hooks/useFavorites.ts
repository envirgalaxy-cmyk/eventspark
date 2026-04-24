import { useCallback, useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: bigint) => {
    const key = id.toString();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: bigint) => favorites.has(id.toString()),
    [favorites],
  );

  return { favorites, toggle, isFavorite };
}
