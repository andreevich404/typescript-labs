export type UserId = string & { readonly brand: unique symbol };

export function isUserId(value: unknown): value is UserId {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function getUserProfile(id: UserId): { id: UserId; name: string } {
  return { id, name: "Иван" };
}

console.log("Задача 3 — Проверка UserId");
const inputs: unknown[] = ["550e8400-e29b-41d4-a716-446655440000", "invalid-id", 123];
for (const value of inputs) {
  if (isUserId(value)) console.log(getUserProfile(value));
  else console.log("Некорректный UserId:", value);
}
