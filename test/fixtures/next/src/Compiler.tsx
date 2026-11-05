import { useEffect, useState } from 'react';

export function Mirror({ value }: { value: string }) {
  const [copy, setCopy] = useState(value);
  useEffect(() => {
    setCopy(value);
  }, [value]);
  return <span>{copy}</span>;
}
