const KEY = "creator-usage";

export function trackGeneration(type) {
  const data = JSON.parse(localStorage.getItem(KEY)) || {
    total: 0,
    byType: {},
  };

  data.total += 1;
  data.byType[type] = (data.byType[type] || 0) + 1;

  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getUsageStats() {
  return (
    JSON.parse(localStorage.getItem(KEY)) || {
      total: 0,
      byType: {},
    }
  );
}
