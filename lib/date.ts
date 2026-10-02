const postDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatPostDate(date: string): string {
  return postDateFormatter.format(new Date(date));
}
