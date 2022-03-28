interface Publisher<T> {
  subscribe<S extends T>(s: Subscriber<S>): void;
}

interface Subscriber<T> {
  onSubscribe(s: Subscription): void;
  onNext(t: T): void;
  onError(e: Error): void;
  onComplete(): void;
}

interface Subscription {
  request(n: number): void;
  cancel(): void;
}

interface Processor<T, R> extends Subscriber<T>, Publisher<R> {}
