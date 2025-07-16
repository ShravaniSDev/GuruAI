import type { ProtocolSetup } from '../../types/types';

export function loadProtocol(): ProtocolSetup | undefined {
  try {
    const data = localStorage.getItem('guruai_target_protocol');
    if (!data) return undefined;

    const parsed = JSON.parse(data);

    // 🛠 Case 1: It's stored as an array — convert it to object
    if (Array.isArray(parsed)) {
      return {
        priority: parsed[0],
        why: parsed[1],
        actions: parsed.slice(2),
        avoid: [], // ✅ default avoid if not in array
      };
    }

    // 🛠 Case 2: It’s already an object — ensure `avoid` exists
    return {
      ...parsed,
      avoid: parsed.avoid || [], // ✅ ensure `avoid` is present
    };

  } catch (e) {
    console.error('Failed to load protocol:', e);
    return undefined;
  }
}
