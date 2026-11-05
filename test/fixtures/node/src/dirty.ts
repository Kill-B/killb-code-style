import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';

type Status = 'ok' | 'failed' | 'pending';

export async function save(value: string | null, status: Status): Promise<void> {
  if (value == 'x') return;
  writeFile('out.txt', value ?? '');
  console.log(status);
  switch (status) {
    case 'ok':
      return;
  }
}
