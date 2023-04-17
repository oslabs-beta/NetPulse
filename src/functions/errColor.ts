export default function errColor(contentLength: number, statusCode: number): string {
  if (!statusCode) return 'red';
  const strStatus: string = statusCode.toString();
  if (contentLength > 1 && strStatus[0] === '2') return 'green';
  if (strStatus[0] === '3') return '#34dbeb';
  if (strStatus[0] === '4') return 'red';
  if (strStatus[0] === '5') return 'red';
  return 'red';
}
