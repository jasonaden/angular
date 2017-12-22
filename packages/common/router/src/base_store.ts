
export class BaseStore<T> {
  private _nextId = 0;
  constructor(protected state: T) {}

  getState() { return this.state; }

  protected nextId() { return ++this._nextId; }
}
