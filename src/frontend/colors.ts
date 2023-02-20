import chroma from "chroma-js";

export const getColor = (index: number) => {
  const mod = 97;
  const jump = 18;
  return chroma
    .scale([
      "#cb2d2d",
      "cb8c2d",
      "1c8b0b",
      "0aae8b",
      "0a5fae",
      "1c16e5",
      "5116e5",
      "ad1349",
    ])
    .mode("lch")
    .colors(mod)[(index * jump) % mod];
};
