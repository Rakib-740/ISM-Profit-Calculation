// ---------------------------------------------------------------------------
// All form fields start empty / zeroed on every page load.
// No pre-filled data is restored after a browser refresh.
// ---------------------------------------------------------------------------

export const INITIAL_PROJECT_DATA = {
  projectNumber: '',
  projectName: '',
  product: '',
  startDate: '',
  duration: '',
  numberOfReturns: '',
  endDate: ''
};

// Investor list starts empty; users add entries manually or via Bulk Input.
export const INITIAL_INVESTORS = [];

export const INITIAL_RETURNS_DATA = [
  {
    id: 'ret-1',
    returnNumber: 1,
    returnDate: '',
    daysTaken: '',
    totalInvestment: '',
    totalProfit: '',
    passivePercentage: 50,
    investors: []
  }
];

// Next-return day range: kept as structural defaults (not user-entered form data).
export const INITIAL_NEXT_RETURN = {
  minDays: '45',
  maxDays: '50'
};
