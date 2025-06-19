
const STORAGE_KEY = 'hahWishlist'
enum AuctionProtocol {
  AllPay = '1',
  English = '2',
  Linear = '3',
  Logarithmic = '4',
  Exponential = '5',
  Vickrey = '6',
}

// Read raw string (comma‑separated fixed codes) from localStorage
function _read() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY) || '';
}

// Example: "1123456" for AllPayAuction
function _generateCode(protocol: keyof typeof AuctionProtocol, id: string) {
  return `${AuctionProtocol[protocol]}${id.padStart(6, '0')}`;
}

function _write(raw: string) {
  if (typeof window === 'undefined') return '';
  try {
    localStorage.setItem(STORAGE_KEY, raw)
  } catch {
    console.error('Failed to save wishlist to localStorage:', raw);
  }
}

export function append(protocol: keyof typeof AuctionProtocol, id: string) {
  const existing = _read();
  const raw = _generateCode(protocol, id);
  const list = existing ? existing.split(',') : [];
  if (!list.includes(raw)) list.push(raw);
  const newRaw = list.join(',');
  _write(newRaw);
}

export function remove(protocol: keyof typeof AuctionProtocol, id: string) {
  const existing = _read();
  const raw = _generateCode(protocol, id);
  const newRaw = existing
    .split(',')
    .filter(code => code !== raw)
    .join(',');
  _write(newRaw);
}

export function decodeCode(code: string) {
  // Decode a fixed-width code into protocol and id
  type ValueOf<T> = T[keyof T];
  const protocol = Object.values(AuctionProtocol).find(p => p === code.slice(0, 1)) as ValueOf<typeof AuctionProtocol>;
  const id = code.slice(1);
  return { protocol, id };
}


// Read into array of codes
export function loadWishlist() {
  const raw = _read()
  if (!raw) return []
  return raw.split(',').filter(code => code.length > 0)
}
