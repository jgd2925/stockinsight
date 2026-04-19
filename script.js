// Updated script.js with mock data and alternative API structure

const fetchData = async () => {
    try {
        // Example of using a mock data structure
        const mockData = [{
            id: 1,
            name: 'Stock A',
            price: 100,
            change: 1.5
        }, {
            id: 2,
            name: 'Stock B',
            price: 200,
            change: -0.5
        }];

        // Simulate a fetch call for demonstration
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockData), 1000);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const displayData = async () => {
    const data = await fetchData();
    console.log(data);
    // Here you'd update your UI with the fetched data.
};

document.addEventListener('DOMContentLoaded', () => {
    displayData();
});