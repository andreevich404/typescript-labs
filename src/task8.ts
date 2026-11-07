export interface Repository<T extends { id: string }> {
  create(item: T): T;
  findById(id: string): T | undefined;
  update(id: string, changes: Partial<Omit<T, "id">>): T | undefined;
  delete(id: string): boolean;
}

export class MemoryRepository<T extends { id: string }> implements Repository<T> {
  private readonly items = new Map<string, T>();

  create(item: T): T {
    if (this.items.has(item.id)) throw new Error(`Запись с id ${item.id} уже существует`);
    const stored = { ...item };
    this.items.set(stored.id, stored);
    return { ...stored };
  }

  findById(id: string): T | undefined {
    const item = this.items.get(id);
    return item === undefined ? undefined : { ...item };
  }

  update(id: string, changes: Partial<Omit<T, "id">>): T | undefined {
    const item = this.items.get(id);
    if (item === undefined) return undefined;
    // id записывается последним: внешние данные не смогут подменить его.
    const updated = { ...item, ...changes, id };
    this.items.set(id, updated);
    return { ...updated };
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }
}

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
}

console.log("Задача 8 — Хранилище книг");
const books = new MemoryRepository<Book>();
const book: Book = { id: "book-1", title: "Маленький принц", author: "Антуан де Сент-Экзюпери", year: 1943 };
console.log("Создание:", books.create(book));
console.log("Поиск:", books.findById(book.id));
console.log("Обновление:", books.update(book.id, { year: 1944 }));
try {
  books.create(book);
} catch (error: unknown) {
  if (!(error instanceof Error)) throw error;
  console.log("Ожидаемая ошибка:", error.message);
}
console.log("Удаление:", books.delete(book.id));
console.log("Поиск отсутствующей:", books.findById(book.id));
console.log("Обновление отсутствующей:", books.update(book.id, { title: "Другая книга" }));
console.log("Повторное удаление:", books.delete(book.id));
// books.update(book.id, { id: "book-2" }); // Ошибка: id исключён из changes.
