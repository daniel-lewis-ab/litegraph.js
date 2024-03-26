// @TODO: Add second instead of seconds if 1
function timeSince(date: string, format: 'ago' | 'short'): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 180) {
    return 'just now';
  }

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + (format === 'ago' ? 'y ago' : ' years');
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + (format === 'ago' ? ' m ago' : ' mths');
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + (format === 'ago' ? ' d ago' : ' days');
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + (format === 'ago' ? ' h ago' : ' hours');
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + (format === 'ago' ? ' min ago' : ' mins');
  }
  return Math.floor(seconds) + (format === 'ago' ? ' s ago' : ' secs');
}

type TimeSinceProps = {
  time: string;
  format?: 'ago' | 'short';
};

export const TimeSince = ({ time, format }: TimeSinceProps) => <>{timeSince(time, format ?? 'ago')}</>;
