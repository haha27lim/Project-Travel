export const getLastViewedTimestamp = (tripId: number): number => {
    const viewedTrips = JSON.parse(localStorage.getItem('lastViewedTrips') || '{}');
    return viewedTrips[tripId] || 0;
};

export const setLastViewedTimestamp = (tripId: number) => {
    const viewedTrips = JSON.parse(localStorage.getItem('lastViewedTrips') || '{}');
    viewedTrips[tripId] = Date.now();
    localStorage.setItem('lastViewedTrips', JSON.stringify(viewedTrips));
};