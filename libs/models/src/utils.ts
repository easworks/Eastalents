export interface RecordList<K extends string | number | symbol, T> {
  record: Record<K, T>;
  list: T[];
}
