// Bengali digit dictionary
const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts English digits (0-9) in any string or number to Bengali digits (০-৯).
 */
export function toBengaliDigits(input) {
  if (input === null || input === undefined || input === '') return '';
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)]);
}

/**
 * Rounds a number to max decimals without unnecessary trailing zeros.
 */
export function roundNumber(val, maxDecimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return 0;
  const num = Number(val);
  const factor = Math.pow(10, maxDecimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Formats a number with standard commas (South Asian / International standard) using Bengali digits.
 * Preserves decimal part if present.
 * Example: 54276 -> "৫৪,২৭৬", 5511.6 -> "৫,৫১১.৬"
 */
export function formatBengaliNumberWithCommas(val) {
  if (val === null || val === undefined || val === '' || isNaN(val)) return '০';
  
  const rounded = roundNumber(val, 2);
  const parts = rounded.toString().split('.');
  
  // Format integer part with commas (Indian/South Asian style: 1,23,456 or standard 123,456)
  // Let's check user example: 5511.6 -> 5,511.6, 54276 -> 54,276.
  const intPart = parseInt(parts[0], 10).toLocaleString('en-US');
  const bengaliInt = toBengaliDigits(intPart);
  
  if (parts.length > 1 && parts[1]) {
    const bengaliDec = toBengaliDigits(parts[1]);
    return `${bengaliInt}.${bengaliDec}`;
  }
  
  return bengaliInt;
}

/**
 * Formats monetary amounts into Bengali Lakhs/Thousands format.
 * Rules:
 * 3900000 -> ৩ ৯ লক্ষ টাকা
 * 429904.8 -> ৪ লক্ষ ২৯ হাজার ৯০ ৪.৮ টাকা
 * 214952.4 -> ২ লক্ষ ১৪ হাজার ৯৫২.৪ টাকা
 * 5511.6 -> ৫,৫১১.৬ টাকা (amount < 100,000 uses standard comma formatted Bengali digits)
 * 100000 -> ১ লক্ষ টাকা
 */
export function formatBengaliAmountWords(amount) {
  if (amount === null || amount === undefined || amount === '' || isNaN(amount)) {
    return '০ টাকা';
  }

  const num = roundNumber(amount, 2);
  
  if (num < 100000) {
    return `${formatBengaliNumberWithCommas(num)} টাকা`;
  }

  const lakhs = Math.floor(num / 100000);
  const rem1 = roundNumber(num % 100000, 2);
  const thousands = Math.floor(rem1 / 1000);
  const rem2 = roundNumber(rem1 % 1000, 2);

  const parts = [];

  if (lakhs > 0) {
    parts.push(`${toBengaliDigits(lakhs)} লক্ষ`);
  }
  
  if (thousands > 0) {
    parts.push(`${toBengaliDigits(thousands)} হাজার`);
  }
  
  if (rem2 > 0) {
    parts.push(formatBengaliNumberWithCommas(rem2));
  }

  return `${parts.join(' ')} টাকা`;
}

/**
 * Formats investor investment (given in Lacs) to Bengali string.
 * Example: 10 -> "১০ লক্ষ টাকা", 1 -> "১ লক্ষ টাকা"
 */
export function formatInvestorInvestment(lacs) {
  if (!lacs && lacs !== 0) return '০ লক্ষ টাকা';
  return `${toBengaliDigits(lacs)} লক্ষ টাকা`;
}

/**
 * Returns Bengali ordinal representation for return numbers.
 * 1 -> ১ ম
 * 2 -> ২ য়
 * 3 -> ৩ য়
 * 4 -> ৪ র্থ
 * ...
 */
export function getBengaliOrdinal(num) {
  const n = parseInt(num, 10);
  if (isNaN(n)) return `${toBengaliDigits(num)}ম`;
  
  const ordinals = {
    1: '১ম',
    2: '২য়',
    3: '৩য়',
    4: '৪র্থ',
    5: '৫ম',
    6: '৬ষ্ঠ',
    7: '৭ম',
    8: '৮ম',
    9: '৯ম',
    10: '১০ম',
  };

  return ordinals[n] || `${toBengaliDigits(n)}ম`;
}
