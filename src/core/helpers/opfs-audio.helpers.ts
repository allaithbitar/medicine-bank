// Helper functions for saving, reading, listing and deleting audio files in OPFS
// Uses the File System Access API / navigator.storage.getDirectory()

type SaveOptions = {
  dir?: string; // sub-directory inside OPFS (default: "audio")
  mimeType?: string; // used when data is ArrayBuffer
};

function ensureOpfs() {
  const storage: any = (navigator as any).storage;
  if (!storage || typeof storage.getDirectory !== 'function') {
    throw new Error('OPFS is not available in this browser');
  }
  return storage;
}

async function getDirectoryHandle(dir = 'audio') {
  const storage: any = ensureOpfs();
  const root: any = await storage.getDirectory();
  // create directory if it doesn't exist
  return await root.getDirectoryHandle(dir, { create: true });
}

export async function saveAudioFile(name: string, data: Blob | ArrayBuffer, options?: SaveOptions): Promise<void> {
  const dirHandle: any = await getDirectoryHandle(options?.dir);
  const fileHandle: any = await dirHandle.getFileHandle(name, { create: true });
  const writable: any = await fileHandle.createWritable();
  try {
    const blob = data instanceof Blob ? data : new Blob([data], { type: options?.mimeType || 'audio/webm' });
    // Write blob to file
    await writable.write(blob);
  } finally {
    await writable.close();
  }
}

export async function readAudioFile(name: string, dir = 'audio'): Promise<Blob | null> {
  try {
    const dirHandle: any = await getDirectoryHandle(dir);
    const fileHandle: any = await dirHandle.getFileHandle(name);
    const file: File = await fileHandle.getFile();
    return file;
  } catch (err: any) {
    // If file/dir not found, return null
    if (err && (err.name === 'NotFoundError' || err.code === DOMException.NOT_FOUND_ERR)) return null;
    // Some browsers throw different errors — if name contains "No such file" treat as not found
    if (err && /not found/i.test(String(err.message))) return null;
    throw err;
  }
}

export async function listAudioFiles(dir = 'audio'): Promise<string[]> {
  const dirHandle: any = await getDirectoryHandle(dir);
  const names: string[] = [];
  // entries() is an async iterator of [name, handle]
  for await (const entry of (dirHandle as any).entries()) {
    // entry may be [name, handle] or {0:name,1:handle} depending on shim; normalize
    const pair = Array.isArray(entry) ? entry : [entry[0], entry[1]];
    const name = pair[0];
    const handle = pair[1];
    if (handle && handle.kind === 'file') names.push(name);
  }
  return names;
}

export async function deleteAudioFile(name: string, dir = 'audio'): Promise<boolean> {
  try {
    const dirHandle: any = await getDirectoryHandle(dir);
    // removeEntry is available on DirectoryHandle in engines that support OPFS
    if (typeof dirHandle.removeEntry === 'function') {
      await dirHandle.removeEntry(name);
      return true;
    }
    // Fall back: try to get handle then createWritable with length 0 (not a real delete)
    // If we reach here, deletion is not supported
    throw new Error('removeEntry is not supported in this environment');
  } catch (err: any) {
    if (err && (err.name === 'NotFoundError' || /not found/i.test(String(err.message)))) return false;
    throw err;
  }
}

export function isOpfsAvailable(): boolean {
  const storage: any = (navigator as any).storage;
  return !!(storage && typeof storage.getDirectory === 'function');
}
