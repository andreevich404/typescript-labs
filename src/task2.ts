export type RGBColor = [number, number, number];

export enum ColorName {
  Red = "red",
  Green = "green",
  Blue = "blue",
}

export function rgbToHex(color: RGBColor): string {
  const channels = color.map((channel) => {
    if (!Number.isInteger(channel) || channel < 0 || channel > 255) {
      throw new RangeError("Канал RGB должен быть целым числом от 0 до 255");
    }
    return channel.toString(16).padStart(2, "0");
  });
  return `#${channels.join("")}`;
}

export function getColor(name: ColorName): { rgb: RGBColor; hex: string } {
  const colors: Record<ColorName, RGBColor> = {
    [ColorName.Red]: [255, 0, 0],
    [ColorName.Green]: [0, 128, 0],
    [ColorName.Blue]: [0, 0, 255],
  };
  const rgb = colors[name];
  return { rgb, hex: rgbToHex(rgb) };
}

console.log("Задача 2 - Цвета");
for (const name of Object.values(ColorName)) console.log(name, getColor(name));
try {
  rgbToHex([256, 0, 0]);
} catch (error: unknown) {
  if (!(error instanceof RangeError)) throw error;
  console.log("Ожидаемая ошибка:", error.message);
}
