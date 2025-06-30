enum AuctionProtocol {
    AllPay = '1',
    English = '2',
    Linear = '3',
    Logarithmic = '4',
    Exponential = '5',
    Vickrey = '6',
}
enum Storage{
    WishList = 'Wishlist',
    CreatedAuctions = 'CreatedAuctions',
    Bids = 'Bids',
}

/**
 * Retrieves a comma-separated string of codes from localStorage for the specified storage key.
 *
 * Returns an empty string if running outside a browser environment or if no data exists for the key.
 */
function _read(storage: keyof typeof Storage) {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(Storage[storage]) || '';
}

/**
 * Generates a fixed-width auction code by combining the protocol code and a zero-padded id.
 *
 * @param protocol - The auction protocol to encode
 * @param id - The auction identifier to encode
 * @returns The generated code as a string, with the protocol code followed by the id padded to 6 digits
 */
export function generateCode(protocol: keyof typeof AuctionProtocol, id: string){
    // Generate a fixed-width code based on protocol and id
    // Example: "1000001" for AllPayAuction
    return `${AuctionProtocol[protocol]}${id.padStart(6, '0')}`;
}

/**
 * Writes a raw comma-separated string to localStorage under the specified storage key.
 *
 * If localStorage is unavailable or an error occurs during writing, the operation is silently ignored except for logging an error to the console.
 */
function _write(storage: keyof typeof Storage,raw: string) {
  if (typeof window === 'undefined') return '';
  try {
    localStorage.setItem(Storage[storage], raw)
  } catch {
    console.error('Failed to save wishlist to localStorage:', raw);
  }
}

/**
 * Adds a generated auction code to the specified storage list if it is not already present.
 *
 * If the code for the given protocol and id does not exist in the list stored under the specified storage key, it is appended to the list and the updated list is saved.
 */
export function append(storage: keyof typeof Storage,protocol: keyof typeof AuctionProtocol, id: string){
    const existing = _read(storage);
    const raw = generateCode(protocol, id);
    const list = existing ? existing.split(',') : [];
    if (!list.includes(raw)) list.push(raw);
    const newRaw = list.join(',');
    _write(storage,newRaw);
}

/**
 * Removes the specified auction code from the list stored under the given storage key.
 *
 * If the code for the provided protocol and id is present in the storage, it is removed from the comma-separated list.
 */
export function remove(storage: keyof typeof Storage,protocol: keyof typeof AuctionProtocol, id: string) {
    const existing = _read(storage);
    const raw = generateCode(protocol, id);
    const newRaw = existing
        .split(',')
        .filter(code => code !== raw)
        .join(',');
    _write(storage,newRaw);
}

/**
 * Decodes a fixed-width auction code into its protocol name and id.
 *
 * @param code - The encoded string with the protocol code as the first character and the id as the remainder
 * @returns An object containing the protocol name and id extracted from the code
 */
export function decode(code: string) {
  // Decode a fixed-width code into auction name and id
  const protocolValue = code.slice(0, 1);
  // Find the enum key (auction name) for this protocol value
  const protocolName = (Object.entries(AuctionProtocol).find(([, val]) => val === protocolValue)?.[0]) as keyof typeof AuctionProtocol;
  const id = code.slice(1);
  return { protocol: protocolName, id };
}

/**
 * Checks if a code generated from the given protocol and id exists in the specified storage list.
 *
 * @returns `true` if the code is present in the storage; otherwise, `false`.
 */
export function isPresent(storage: keyof typeof Storage,protocol: keyof typeof AuctionProtocol, id: string){
    const raw = _read(storage);
    if (!raw) return false;
    const code = generateCode(protocol, id);
    return raw.split(',').includes(code);
}


/**
 * Loads a list of codes from the specified storage key.
 *
 * @param storage - The storage key to read from
 * @returns An array of non-empty code strings stored under the given key
 */
export function loadList(storage: keyof typeof Storage) {
  const raw = _read(storage)
  if (!raw) return []
  return raw.split(',').filter(code => code.length > 0)
}
