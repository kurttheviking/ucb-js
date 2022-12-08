export const cloneSimpleObject = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};
