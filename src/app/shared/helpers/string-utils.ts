export function capitalize(value = '') {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

export function camelCase(value = '') {
  return String(value).charAt(0).toLowerCase() + String(value).slice(1);
}

export function replaceFirst(value: string, oldValue: string, newValue = '') {
  return value.startsWith(oldValue) ? newValue + value.slice(oldValue.length) : value;
}

export function replaceLast(value: string, oldValue: string, newValue = '') {
  return value.endsWith(oldValue) ? value.slice(0, -oldValue.length) + newValue : value;
}

export function getSimpleHash(object: object) {
  const str = JSON.stringify(object);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const character = str.charCodeAt(i);
    hash = (hash << 5) - hash + character;
  }
  return (hash >>> 0).toString(36).padStart(7, '0');
}

export function generateShortId(length = 6) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}
