export interface RenderDependency<T extends string | number> {
  toPrimitiveDep(): T;
}
