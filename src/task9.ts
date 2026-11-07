export type DeepReadonly<T> = T extends object
  ? { readonly [Key in keyof T]: DeepReadonly<T[Key]> }
  : T;

export function deepFreeze<T>(obj: T): DeepReadonly<T> {
  if (typeof obj === "object" && obj !== null) {
    for (const key of Object.getOwnPropertyNames(obj)) {
      // Для оговорённых обычных объектов и массивов собственные строковые
      // свойства охватывают все вложенные данные (в том числе скрытые).
      const value: unknown = (obj as Record<string, unknown>)[key];
      deepFreeze(value);
    }
    Object.freeze(obj);
  }
  // Все вложенные объекты и массивы уже заморожены. Утверждение отражает
  // выполненную рекурсию, а не подменяет проверку входных данных.
  return obj as DeepReadonly<T>;
}

console.log("Задача 9 - Глубокая заморозка");
const settings = deepFreeze({
  user: { name: "Иван", preferences: { theme: "dark" } },
  books: [{ title: "Маленький принц", metadata: { year: 1943 } }],
});
console.log(settings);
console.log("Корень:", Object.isFrozen(settings));
console.log("Пользователь:", Object.isFrozen(settings.user));
console.log("Настройки:", Object.isFrozen(settings.user.preferences));
console.log("Массив:", Object.isFrozen(settings.books));
console.log("Книга:", Object.isFrozen(settings.books[0]));
console.log("Метаданные:", Object.isFrozen(settings.books[0].metadata));
// settings.user.preferences.theme = "light"; // Ошибка: вложенное поле readonly.
// settings.books[0].title = "Другая книга"; // Ошибка: поле объекта readonly.
// settings.books.push({ title: "Новая", metadata: { year: 2026 } });
// Ошибка: у readonly-массива нет изменяющего метода push.
