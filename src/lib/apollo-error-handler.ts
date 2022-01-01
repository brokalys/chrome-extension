import Bugsnag from '@bugsnag/js';

export default function apolloErrorHandler(err: Error): void {
  Bugsnag.notify(err);
}
