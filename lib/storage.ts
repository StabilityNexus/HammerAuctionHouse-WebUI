
const STORAGE_KEY = 'hahWishlist'
enum AuctionProtocol {
    AllPay = '000',
    English = '100',
    Linear = '010',
    Logarithmic = '110',
    Exponential = '001',
    Vickrey = '101',
}


// Read raw string (comma‑separated fixed codes) from localStorage
function _read() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

function _generateCode(protocol: keyof typeof AuctionProtocol, id: string){
    // Generate a fixed-width code based on protocol and id
    // Example: "000123456" for AllPayAuction
    return `${AuctionProtocol[protocol]}${id.padStart(6, '0')}`;
}

function _write(raw: string) {
  try {
    localStorage.setItem(STORAGE_KEY, raw)
  } catch {
    console.error('Failed to save wishlist to localStorage:', raw);
  }
}

export function append(protocol: keyof typeof AuctionProtocol, id: string){
    const existing = _read();
    const raw = _generateCode(protocol, id);
    const newRaw = existing ? `${existing},${raw}` : raw;
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

export function decodeCode(code: string){
    // Decode a fixed-width code into protocol and id
    type ValueOf<T> = T[keyof T];
    const protocol = Object.values(AuctionProtocol).find(p => p === code.slice(0, 3)) as ValueOf<typeof AuctionProtocol>;
    const id = code.slice(3);
    return { protocol , id };
}


// Read into array of codes
export function loadWishlist() {
  const raw = _read()
  if (!raw) return []
  return raw.split(',').filter(code => code.length > 0)
}
