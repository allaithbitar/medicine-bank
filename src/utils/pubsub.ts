export interface Pubsub<Events extends Record<string, any>> {
  _events: { [K in keyof Events]?: K };
  _subs: { [K in keyof Events]?: Array<(data: Events[K]) => void> };
  publish<K extends keyof Events>(event: K, data: Events[K]): void;
  subscribe<K extends keyof Events>(
    event: K,
    cb: (data: Events[K]) => void
  ): () => void;
}

export const createPubsub = <
  Events extends Record<string, any>
>(): Pubsub<Events> => {
  const pubsub: Pubsub<Events> = {
    _events: {},
    _subs: {},

    publish(event, data) {
      if (!this._events[event]) {
        this._events[event] = event;
      }

      (this._subs[event] || []).forEach((cb) => cb(data));
    },

    subscribe(event, cb) {
      if (!this._subs[event]) {
        this._subs[event] = [];
      }
      this._subs[event]!.push(cb);

      return () => {
        if (this._subs[event]) {
          this._subs[event] = this._subs[event]!.filter((f) => f !== cb);
          if (this._subs[event]!.length === 0) {
            delete this._subs[event];
            delete this._events[event];
          }
        }
      };
    },
  };
  return pubsub;
};
