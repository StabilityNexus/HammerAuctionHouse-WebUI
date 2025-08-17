"use client";
enum AuctionProtocol {
  AllPay = '1',
  English = '2',
  Linear = '3',
  Logarithmic = '4',
  Exponential = '5',
  Vickrey = '6',
}

// Read raw string (comma‑separated fixed codes) from localStorage
function _read(storage: string) {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(storage) || '';
}

export function generateCode(protocol: keyof typeof AuctionProtocol, id: string) {
  // Generate a fixed-width code based on protocol and id
  // Example: "1000001" for AllPayAuction
  return `${AuctionProtocol[protocol]}${id.padStart(6, '0')}`;
}

function _write(storage: string, raw: string) {
  if (typeof window === 'undefined') return '';
  try {
    localStorage.setItem(storage, raw)
  } catch {
    console.error('Failed to save wishlist to localStorage:', raw);
  }
}

export function append(storage: string, protocol: keyof typeof AuctionProtocol, id: string) {
  const existing = _read(storage);
  const raw = generateCode(protocol, id);
  const list = existing ? existing.split(',') : [];
  if (!list.includes(raw)) list.push(raw);
  const newRaw = list.join(',');
  _write(storage, newRaw);
}

export function remove(storage: string, protocol: keyof typeof AuctionProtocol, id: string) {
  const existing = _read(storage);
  const raw = generateCode(protocol, id);
  const newRaw = existing
    .split(',')
    .filter(code => code !== raw)
    .join(',');
  _write(storage, newRaw);
}

export function decode(code: string) {
  // Decode a fixed-width code into auction name and id
  const protocolValue = code.slice(0, 1);
  // Find the enum key (auction name) for this protocol value
  const protocolName = (Object.entries(AuctionProtocol).find(([, val]) => val === protocolValue)?.[0]) as keyof typeof AuctionProtocol;
  const id = code.slice(1);
  return { protocol: protocolName, id };
}

export function isPresent(storage: string, protocol: keyof typeof AuctionProtocol, id: string) {
  const raw = _read(storage);
  if (!raw) return false;
  const code = generateCode(protocol, id);
  return raw.split(',').includes(code);
}


// Read into array of codes
export function loadList(storage: string) {
  const raw = _read(storage)
  if (!raw) return []
  return raw.split(',').filter(code => code.length > 0)
}
