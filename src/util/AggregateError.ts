export class AggregateError extends Error {
  constructor(readonly errors: Error[]) {
    super(errors.map(err => err.message).join("\n"));
  }
}
