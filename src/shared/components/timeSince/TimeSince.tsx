function timeSince(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' y ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' m ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' d ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' h ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' min ago';
  }
  return Math.floor(seconds) + ' s ago';
}

type TimeSinceProps = {
  time: string;
};

export const TimeSince = ({ time }: TimeSinceProps) => <>{timeSince(time)}</>;
