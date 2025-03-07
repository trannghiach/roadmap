
// chucaobuon: 
// lilsadfoqs: Special utilities to get some constant Date type variable
export const oneYearFromNow = () => 
    new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
    );


export const thirtyDaysFromNow = () =>
    new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
    );

export const fifteenMinutesFromNow = () => 
    new Date(
        Date.now() + 15 * 60 * 1000
    );

export const ONE_DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;