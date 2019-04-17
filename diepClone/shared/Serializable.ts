/** Represents a TypeScript object that can be converted to/from JSON. 
 *
 * There is no serialize method because we can just use the TypeScript object itself.
 */
export interface Serializable<T> {
  /** Takes the form of jsonObj. */
  deserialize(jsonObj: Object);
}
