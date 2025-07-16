import type { ProtocolSetup } from '../../types/types';

export function loadProtocol(): ProtocolSetup | undefined {
  try {
    const data = localStorage.getItem('guru-protocol');
    return data ? JSON.parse(data) : undefined;
  } catch (e) {
    console.error('Failed to load protocol:', e);
    return undefined;
  }
}
