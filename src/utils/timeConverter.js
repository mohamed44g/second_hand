export function time(timestamp) {
  const time = new Date(timestamp).getTime();
  const now = Date.now();
  const diff = Math.floor((now - time) / 1000); // الفرق بالثواني

  if (diff < 60) return "Just now";
  if (diff < 3600) return `قبل ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 2592000) return `قبل ${Math.floor(diff / 86400)} يوم`;
  if (diff < 31536000) return `قبل ${Math.floor(diff / 2592000)} شهر`;

  return `قبل ${Math.floor(diff / 31536000)} سنة`;
}
export function timeWithDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = date.toLocaleDateString("ar-EG", options);
  return formattedDate;
}

export function timeWithDateAndTime(timestamp) {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = date.toLocaleString("ar-EG", options);
  return formattedDate;
}
