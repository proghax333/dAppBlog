export function dateFromTimestamp(timestamp) {
  const d = new Date(timestamp * 1000);
  const result = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  return result;
}
