let cachedConfig = null;

export async function loadConfig() {
  if (cachedConfig) return cachedConfig;

  try {
    const res = await fetch('/config');
    const data = await res.json();

    cachedConfig = data;
    return data;
  } catch (err) {
    console.error('Failed to load config');

    cachedConfig = {
      LANG: 'default',
      MEDIUM_USERNAME: ''
    };

    return cachedConfig;
  }
}