import { readFile } from 'node:fs/promises';

type Status = 'ok' | 'failed';

export async function load(path: string, status: Status): Promise<string> {
  switch (status) {
    case 'ok':
      return readFile(path, 'utf8');
    case 'failed':
      throw new Error('failed');
  }
}
