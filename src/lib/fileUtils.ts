export interface ECUPlatform {
  name: string;
  eepromSize: number;
  formula: string;
}

export const ECU_PLATFORMS: Record<string, ECUPlatform> = {
  EDC17CP11: { name: 'EDC17CP11', eepromSize: 131072, formula: '128KB EEPROM' },
  EDC17CP42: { name: 'EDC17CP42', eepromSize: 131072, formula: '128KB EEPROM' },
  EDC17CP55: { name: 'EDC17CP55', eepromSize: 262144, formula: '256KB EEPROM' },
  'MEDC17.9': { name: 'MEDC17.9', eepromSize: 196608, formula: '192KB EEPROM' },
};

export function detectECUPlatform(fileSize: number): ECUPlatform | null {
  for (const platform of Object.values(ECU_PLATFORMS)) {
    if (fileSize === platform.eepromSize) {
      return platform;
    }
  }
  return null;
}

export function getPossiblePlatforms(fileSize: number): ECUPlatform[] {
  return Object.values(ECU_PLATFORMS).filter(
    platform => platform.eepromSize === fileSize
  );
}

export function validateBinFile(file: File): { valid: boolean; error?: string } {
  const validExtensions = ['.bin'];
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

  if (!validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload .bin files only (Binary ECU dumps).',
    };
  }

  if (file.size > 50 * 1024 * 1024) {
    return {
      valid: false,
      error: 'File size exceeds 50MB limit.',
    };
  }

  if (file.size < 1024) {
    return {
      valid: false,
      error: 'File size is too small to be a valid ECU file.',
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export interface VINLocation {
  vin: string;
  offset: number;
  offsetHex: string;
}

export function extractAllVINs(buffer: ArrayBuffer): VINLocation[] {
  const uint8Array = new Uint8Array(buffer);
  const foundVINs: VINLocation[] = [];
  const vinSet = new Set<string>();

  const vinOffsets = [
    0x400, 0x4F0, 0x500, 0x530, 0x550, 0x580, 0x5A0, 0x5F0,
    0x600, 0x650, 0x680, 0x6F0, 0x700, 0x750, 0x7F0,
    0x800, 0x900, 0xA00, 0xB00, 0xC00, 0xD00, 0xE00, 0xF00,
    0x1000, 0x1100, 0x1200, 0x1500, 0x1800, 0x2000, 0x2500, 0x3000,
    0x4000, 0x5000, 0x6000, 0x7000, 0x8000, 0xA000, 0xC000, 0x10000
  ];

  for (const offset of vinOffsets) {
    if (offset + 17 > uint8Array.length) continue;

    let possibleVIN = '';
    let isValid = true;

    for (let i = 0; i < 17; i++) {
      const charCode = uint8Array[offset + i];

      if (
        (charCode >= 48 && charCode <= 57) ||
        (charCode >= 65 && charCode <= 72) ||
        (charCode >= 74 && charCode <= 78) ||
        (charCode === 80) ||
        (charCode >= 82 && charCode <= 90)
      ) {
        possibleVIN += String.fromCharCode(charCode);
      } else {
        isValid = false;
        break;
      }
    }

    if (isValid && possibleVIN.length === 17 && isValidVINFormat(possibleVIN)) {
      const key = `${possibleVIN}-${offset}`;
      if (!vinSet.has(key)) {
        vinSet.add(key);
        foundVINs.push({
          vin: possibleVIN,
          offset: offset,
          offsetHex: '0x' + offset.toString(16).toUpperCase()
        });
      }
    }
  }

  for (let offset = 0; offset < uint8Array.length - 17; offset += 1) {
    let possibleVIN = '';
    let isValid = true;

    for (let i = 0; i < 17; i++) {
      const charCode = uint8Array[offset + i];

      if (
        (charCode >= 48 && charCode <= 57) ||
        (charCode >= 65 && charCode <= 72) ||
        (charCode >= 74 && charCode <= 78) ||
        (charCode === 80) ||
        (charCode >= 82 && charCode <= 90)
      ) {
        possibleVIN += String.fromCharCode(charCode);
      } else {
        isValid = false;
        break;
      }
    }

    if (isValid && possibleVIN.length === 17 && isValidVINFormat(possibleVIN)) {
      const key = `${possibleVIN}-${offset}`;
      if (!vinSet.has(key)) {
        vinSet.add(key);
        foundVINs.push({
          vin: possibleVIN,
          offset: offset,
          offsetHex: '0x' + offset.toString(16).toUpperCase()
        });
      }
    }
  }

  return foundVINs;
}

export function extractVIN(buffer: ArrayBuffer): string | null {
  const vins = extractAllVINs(buffer);
  return vins.length > 0 ? vins[0].vin : null;
}

export function writeVINToBuffer(buffer: ArrayBuffer, newVIN: string, offset: number): ArrayBuffer {
  if (newVIN.length !== 17) {
    throw new Error('VIN must be exactly 17 characters');
  }

  if (!isValidVINFormat(newVIN)) {
    throw new Error('Invalid VIN format');
  }

  const newBuffer = buffer.slice(0);
  const uint8Array = new Uint8Array(newBuffer);

  for (let i = 0; i < 17; i++) {
    uint8Array[offset + i] = newVIN.charCodeAt(i);
  }

  return newBuffer;
}

function isValidVINFormat(vin: string): boolean {
  if (vin.length !== 17) return false;

  if (vin.includes('I') || vin.includes('O') || vin.includes('Q')) return false;

  const firstChar = vin.charAt(0);
  if (!/[A-HJ-NPR-Z]/.test(firstChar)) return false;

  const digitCount = (vin.match(/[0-9]/g) || []).length;
  if (digitCount < 3 || digitCount > 10) return false;

  const repeatingPattern = /(.)\1{4,}/;
  if (repeatingPattern.test(vin)) return false;

  return true;
}

export function analyzeFile(file: File): Promise<{
  platform: ECUPlatform | null;
  possiblePlatforms: ECUPlatform[];
  size: number;
  isValid: boolean;
  vin: string | null;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const platform = detectECUPlatform(file.size);
      const possiblePlatforms = getPossiblePlatforms(file.size);
      const vin = extractVIN(buffer);

      resolve({
        platform,
        possiblePlatforms,
        size: file.size,
        isValid: possiblePlatforms.length > 0,
        vin,
      });
    };

    reader.readAsArrayBuffer(file);
  });
}
