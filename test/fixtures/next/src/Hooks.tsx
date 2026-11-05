import { useEffect, useState } from 'react';

export function Counter({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = String(count);
  }, []);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
