export function chunkArray<T>(items: readonly T[], chunkSize: number): T[][] {
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new RangeError("Размер блока должен быть положительным целым числом");
  }
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }
  return chunks;
}

console.log("Задача 7 — Разбиение массива");
const numbers: readonly number[] = Object.freeze([1, 2, 3, 4, 5]);
console.log("Числа с остатком:", chunkArray(numbers, 2));
console.log("Строки:", chunkArray(["a", "b", "c"], 2));
console.log("Пустой массив:", chunkArray([], 2));
console.log("Исходный массив:", numbers);
for (const size of [0, -1, 1.5, NaN, Infinity, -Infinity]) {
  try {
    chunkArray(numbers, size);
  } catch (error: unknown) {
    if (!(error instanceof RangeError)) throw error;
    console.log(`Ожидаемая ошибка для ${size}:`, error.message);
  }
}
