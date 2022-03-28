/**
 * A {@link Publisher} is a provider of a potentially unbounded number of sequenced elements, publishing them according to
 * the demand received from its {@link Subscriber}(s).
 * <p>
 * A {@link Publisher} can serve multiple {@link Subscriber}s subscribed {@link Publisher#subscribe(Subscriber)} dynamically
 * at various points in time.
 *
 * @param <T> the type of element signaled
 */
export interface Publisher<T> {
  /**
   * Request {@link Publisher} to start streaming data.
   * <p>
   * This is a "factory method" and can be called multiple times, each time starting a new {@link Subscription}.
   * <p>
   * Each {@link Subscription} will work for only a single {@link Subscriber}.
   * <p>
   * A {@link Subscriber} should only subscribe once to a single {@link Publisher}.
   * <p>
   * If the {@link Publisher} rejects the subscription attempt or otherwise fails it will
   * signal the error via {@link Subscriber#onError(Error)}.
   *
   * @param s the {@link Subscriber} that will consume signals from this {@link Publisher}
   */
  subscribe<S extends T>(s: Subscriber<S>): void;
}

/**
 * Will receive call to {@link onSubscribe(Subscription)} once after passing an instance of {@link Subscriber} to {@link Publisher#subscribe(Subscriber)}.
 * <p>
 * No further notifications will be received until {@link Subscription#request(number)} is called.
 * <p>
 * After signaling demand:
 * <ul>
 * <li>One or more invocations of {@link onNext(Object)} up to the maximum number defined by {@link Subscription#request(number)}</li>
 * <li>Single invocation of {@link onError(Error)} or {@link Subscriber#onComplete()} which signals a terminal state after which no further events will be sent.
 * </ul>
 * <p>
 * Demand can be signaled via {@link Subscription#request(number)} whenever the {@link Subscriber} instance is capable of handling more.
 *
 * @param <T> the type of element signaled
 */
export interface Subscriber<T> {
  /**
   * Invoked after calling {@link Publisher#subscribe(Subscriber)}.
   * <p>
   * No data will start flowing until {@link Subscription#request(number)} is invoked.
   * <p>
   * It is the responsibility of this {@link Subscriber} instance to call {@link Subscription#request(number)} whenever more data is wanted.
   * <p>
   * The {@link Publisher} will send notifications only in response to {@link Subscription#request(number)}.
   *
   * @param s the {@link Subscription} that allows requesting data via {@link Subscription#request(number)}
   */
  onSubscribe(s: Subscription): void;

  /**
   * Data notification sent by the {@link Publisher} in response to requests to {@link Subscription#request(number)}.
   *
   * @param t the element signaled
   */
  onNext(t: T): void;

  /**
   * Failed terminal state.
   * <p>
   * No further events will be sent even if {@link Subscription#request(number)} is invoked again.
   *
   * @param e the throwable signaled
   */
  onError(e: Error): void;

  /**
   * Successful terminal state.
   * <p>
   * No further events will be sent even if {@link Subscription#request(number)} is invoked again.
   */
  onComplete(): void;
}

/**
 * A {@link Subscription} represents a one-to-one lifecycle of a {@link Subscriber} subscribing to a {@link Publisher}.
 * <p>
 * It can only be used once by a single {@link Subscriber}.
 * <p>
 * It is used to both signal desire for data and cancel demand (and allow resource cleanup).
 */
export interface Subscription {
  /**
   * No events will be sent by a {@link Publisher} until demand is signaled via this method.
   * <p>
   *  It can be called however often and whenever needed—but if the outstanding cumulative demand ever becomes Long.MAX_VALUE or more,
   *  it may be treated by the {@link Publisher} as "effectively unbounded".
   * <p>
   * Whatever has been requested can be sent by the {@link Publisher} so only signal demand for what can be safely handled.
   * <p>
   * A {@link Publisher} can send less than is requested if the stream ends but
   * then must emit either {@link Subscriber#onError(Error)} or {@link Subscriber#onComplete()}.
   *
   * @param n the strictly positive number of elements to requests to the upstream {@link Publisher}
   */
  request(n: number): void;

  /**
   * Request the {@link Publisher} to stop sending data and clean up resources.
   * <p>
   * Data may still be sent to meet previously signalled demand after calling cancel.
   */
  cancel(): void;
}

/**
 * A {@link Processor} represents a processing stage—which is both a {@link Subscriber}
 * and a {@link Publisher} and obeys the contracts of both.
 *
 * @param <T> the type of element signaled to the {@link Subscriber}
 * @param <R> the type of element signaled by the {@link Publisher}
 */
interface Processor<T, R> extends Subscriber<T>, Publisher<R> {}
