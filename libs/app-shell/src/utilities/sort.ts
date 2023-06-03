export declare type CompareFn<T> = (a: T, b: T) => number;

export const sortString: CompareFn<string> = (a, b) => {
  if (!!a && !!b) {
    return a.localeCompare(b);
  }
  else if (!!a && !b) {
    return 1;
  }
  else if (!a && !!b) {
    return -1;
  }
  else {
    return 0;
  }
};
export const sortNumber: CompareFn<number> = (a, b) => {
  return a - b;
};

export const sortDate: CompareFn<Date> = (a, b) =>
  sortNumber(a.valueOf(), b.valueOf());
