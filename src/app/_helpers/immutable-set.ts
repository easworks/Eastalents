export class ImmutableSet {
  static add<T>(state: Set<T>, value: T) {
    const s = new Set(state.values())
    s.add(value);
    return s;
  }

  static delete<T>(state: Set<T>, value: T) {
    const s = new Set(state.values());
    s.delete(value);
    return s;
  }
}
