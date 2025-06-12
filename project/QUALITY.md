# 品質

```ts
function add(a: number, b: number): number {
  return a + b;
}

test('1+2=3', () => {
  expect(add(1, 2)).toBe(3);
});
```