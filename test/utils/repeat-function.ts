export const repeatFunction = (x: number) => {
  return (f: () => void) => {
    if (x > 0) {
      f();
      repeatFunction(x - 1)(f);
    }
  };
};
