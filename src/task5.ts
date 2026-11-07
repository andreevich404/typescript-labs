export function applyPipeline<A, B>(value: A, first: (value: A) => B): B;
export function applyPipeline<A, B, C>(
  value: A, first: (value: A) => B, second: (value: B) => C,
): C;
export function applyPipeline<A, B, C, D>(
  value: A, first: (value: A) => B, second: (value: B) => C, third: (value: C) => D,
): D;
export function applyPipeline(value: unknown, ...steps: readonly unknown[]): unknown {
  // Перегрузки связывают вход, соседние шаги и результат. Внутри цепочки
  // конкретные типы скрыты, но каждый шаг получает результат совместимого шага.
  return steps.reduce<unknown>((result, step) => {
    const transform = step as (input: unknown) => unknown;
    return transform(result);
  }, value);
}

console.log("Задача 5 - Pipeline");
console.log(applyPipeline(5, (value) => value * 2));
console.log(applyPipeline(5, (value) => value * 2, (value) => `Число: ${value}`));
console.log(applyPipeline(
  5,
  (value) => value * 2,
  (value) => `Число: ${value}`,
  (value) => value.toUpperCase(),
));
// applyPipeline(5, (value: number) => value * 2, (value: string) => value.trim());
// Ошибка типов: результат первого шага number несовместим со входом string.
