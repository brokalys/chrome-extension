import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

Bugsnag.start({
  apiKey: process.env.REACT_APP_BUGSNAG_KEY!,
  plugins: [new BugsnagPluginReact()],
  autoTrackSessions: false,
  collectUserIp: false,
});
