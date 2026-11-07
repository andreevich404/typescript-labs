import assert from "node:assert/strict";
import test from "node:test";
import { formatInput } from "../dist/task1.js";
import { ColorName, getColor, rgbToHex } from "../dist/task2.js";
import { getUserProfile, isUserId } from "../dist/task3.js";
import { addTag, mergeTags, removeTag } from "../dist/task4.js";
import { applyPipeline } from "../dist/task5.js";
import { sumByStatus } from "../dist/task6.js";
import { chunkArray } from "../dist/task7.js";
import { MemoryRepository } from "../dist/task8.js";
import { deepFreeze } from "../dist/task9.js";

test("formatInput: форматы трёх перегрузок", () => {
  assert.equal(formatInput(3.5), "3.50");
  assert.equal(formatInput(" \tTypeScript\n"), "TypeScript");
  assert.equal(formatInput(new Date("2026-01-01Z")), "2026-01-01T00:00:00.000Z");
});

test("RGB: границы, ведущие нули и недопустимые каналы", () => {
  assert.equal(rgbToHex([0, 1, 255]), "#0001ff");
  assert.equal(rgbToHex([255, 255, 255]), "#ffffff");
  for (const name of Object.values(ColorName)) {
    const { rgb, hex } = getColor(name);
    assert.equal(hex, rgbToHex(rgb));
  }
  for (const value of [-1, 256, 0.5, NaN, Infinity, -Infinity]) {
    for (const index of [0, 1, 2]) {
      const rgb = [0, 0, 0];
      rgb[index] = value;
      assert.throws(() => rgbToHex(rgb), RangeError);
    }
  }
});

test("UserId: точный формат UUID, обе раскладки и отсутствие проверки версии", () => {
  for (const id of ["550e8400-e29b-41d4-a716-446655440000", "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"]) {
    assert.equal(isUserId(id), true);
    assert.equal(getUserProfile(id).id, id);
  }
  for (const value of [null, undefined, 42, {}, "", "invalid", "550e8400-e29b-41d4-a716-446655440000\n"]) {
    assert.equal(isUserId(value), false);
  }
});

test("Теги: порядок, регистр, все повторы и новые массивы", () => {
  const original = Object.freeze(["ts", "node", "ts"]);
  const extra = Object.freeze(["TS", "node", "npm"]);
  assert.deepEqual(addTag(original, "npm"), ["ts", "node", "ts", "npm"]);
  assert.deepEqual(addTag(original, "ts"), original);
  assert.notEqual(addTag(original, "ts"), original);
  assert.deepEqual(removeTag(original, "ts"), ["node"]);
  assert.notEqual(removeTag(original, "missing"), original);
  assert.deepEqual(mergeTags(original, extra), ["ts", "node", "TS", "npm"]);
  assert.deepEqual(original, ["ts", "node", "ts"]);
  assert.deepEqual(extra, ["TS", "node", "npm"]);
});

test("Pipeline: от одного до трёх шагов со сменой типов", () => {
  assert.equal(applyPipeline(3, (n) => n * 2), 6);
  assert.equal(applyPipeline(3, (n) => n * 2, String), "6");
  assert.equal(applyPipeline(3, (n) => n * 2, String, (s) => s + "!"), "6!");
});

test("Счета: обе группы, пустой массив и отсутствие мутаций", () => {
  const invoices = Object.freeze([
    Object.freeze({ id: "1", amount: 100, status: "paid" }),
    Object.freeze({ id: "2", amount: 25, status: "free" }),
    Object.freeze({ id: "3", amount: -10, status: "paid" }),
  ]);
  assert.deepEqual(sumByStatus(invoices), { paid: 90, free: 25 });
  assert.deepEqual(sumByStatus([]), { paid: 0, free: 0 });
  assert.equal(invoices[0].amount, 100);
});

test("Блоки: остаток, строки, пустой вход и независимые подмассивы", () => {
  const original = Object.freeze([1, 2, 3, 4, 5]);
  const chunks = chunkArray(original, 2);
  assert.deepEqual(chunks, [[1, 2], [3, 4], [5]]);
  chunks[0][0] = 99;
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
  assert.deepEqual(chunkArray(["a", "b", "c"], 2), [["a", "b"], ["c"]]);
  assert.deepEqual(chunkArray(original, 10), [[1, 2, 3, 4, 5]]);
  assert.deepEqual(chunkArray([], 1), []);
  for (const size of [0, -1, 1.5, NaN, Infinity, -Infinity]) {
    assert.throws(() => chunkArray(original, size), RangeError);
    assert.throws(() => chunkArray([], size), RangeError);
  }
});

test("Repository: CRUD, дубликат, отсутствие записи и защита id", () => {
  const repository = new MemoryRepository();
  const book = { id: "one", title: "Book", year: 2020 };
  assert.deepEqual(repository.create(book), book);
  assert.throws(() => repository.create(book), /уже существует/);
  assert.deepEqual(repository.update("one", { year: 2021 }), { ...book, year: 2021 });
  // JavaScript имитирует внешние данные, обходящие ограничение TypeScript.
  assert.equal(repository.update("one", { id: "changed" }).id, "one");
  assert.equal(repository.findById("changed"), undefined);
  book.id = "outside";
  const found = repository.findById("one");
  found.id = "also-outside";
  assert.equal(repository.findById("one").id, "one");
  assert.equal(repository.delete("one"), true);
  assert.equal(repository.delete("one"), false);
  assert.equal(repository.findById("one"), undefined);
  assert.equal(repository.update("one", { year: 2022 }), undefined);
});

test("deepFreeze: вложенные объекты, массивы, примитивы и запрет мутации", () => {
  const input = { nested: { items: [{ value: 1 }] }, nullable: null };
  const frozen = deepFreeze(input);
  assert.equal(frozen, input);
  for (const value of [frozen, frozen.nested, frozen.nested.items, frozen.nested.items[0]]) {
    assert.equal(Object.isFrozen(value), true);
  }
  assert.throws(() => { frozen.nested.items[0].value = 2; }, TypeError);
  assert.throws(() => frozen.nested.items.push({ value: 2 }), TypeError);
  for (const value of [null, undefined, 0, "text", true, 1n]) assert.equal(deepFreeze(value), value);
  assert.equal(Object.isFrozen(deepFreeze([])), true);
});
