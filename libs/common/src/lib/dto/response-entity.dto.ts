export class ResonseEntity<E> {
  constructor(
    public statusCode: number,
    public message: string,
    public data: E,
  ) {}
}
