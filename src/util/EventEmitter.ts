interface EventType {
  callback: Function;
}
export default class EventEmitter<T extends string = string> {
  private _events: Record<T, EventType[]> = {} as any;

  public on(evt: T, cb: (...arg: any) => void) {
    if (!this._events[evt]) {
      this._events[evt] = [];
    }
    this._events[evt].push({
      callback: cb,
    });
    return this;
  }

  public off(evt: T, cb?: Function) {
    if (!evt) {
      this._events = {} as any;
    } else {
      if (!cb) {
        delete this._events[evt];
      } else {
        const events = this._events[evt];
        for (let i = 0; i < events.length; i++) {
          const item = events[i];
          if (item.callback === cb) {
            events.splice(i, 1);
            i--;
          }
        }
        if (events.length === 0) delete this._events[evt];
      }
    }
    return this;
  }

  public emit(evt: T, ...args: any[]) {
    if (this._events[evt]) {
      this._events[evt].forEach((e) => e.callback.apply(this, args));
    }
  }
}
