export const getOptimizedImageUrl = (url: string | null, width: number) => {
  if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
  return `${url}?auto=format&fit=crop&w=${width}&q=70`;
};