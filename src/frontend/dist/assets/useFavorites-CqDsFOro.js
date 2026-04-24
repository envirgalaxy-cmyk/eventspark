import { r as reactExports } from "./index-BV_UP3b9.js";
function useFavorites() {
  const [favorites, setFavorites] = reactExports.useState(/* @__PURE__ */ new Set());
  const toggle = reactExports.useCallback((id) => {
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
  const isFavorite = reactExports.useCallback(
    (id) => favorites.has(id.toString()),
    [favorites]
  );
  return { favorites, toggle, isFavorite };
}
export {
  useFavorites as u
};
