export function addTag(tags: readonly string[], tag: string): string[] {
  return tags.includes(tag) ? [...tags] : [...tags, tag];
}

export function removeTag(tags: readonly string[], tag: string): string[] {
  return tags.filter((current) => current !== tag);
}

export function mergeTags(first: readonly string[], second: readonly string[]): string[] {
  return [...new Set([...first, ...second])];
}

console.log("Задача 4 - Теги без мутаций");
const original: readonly string[] = Object.freeze(["ts", "node", "ts"]);
const extra: readonly string[] = Object.freeze(["node", "TS", "npm"]);
console.log("Добавление:", addTag(original, "npm"));
console.log("Повторный тег:", addTag(original, "ts"));
console.log("Удаление всех вхождений:", removeTag(original, "ts"));
console.log("Объединение:", mergeTags(original, extra));
console.log("Исходные массивы:", original, extra);
