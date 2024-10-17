// Existing quotes array
let quotes = [];

// Server simulation
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

// Fetching quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const fetchedQuotes = data.map(item => ({
            text: item.title, // Using title as the quote text
            category: 'General' // Placeholder category
        }));
        updateLocalQuotes(fetchedQuotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

// Syncing local quotes with the server
async function syncQuotes() {
    try {
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

        // Post local quotes to the server
        for (const quote of localQuotes) {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quote)
            });
            if (!response.ok) {
                throw new Error('Failed to sync quote: ' + quote.text);
            }
            const result = await response.json();
            console.log('Quote successfully synced with server:', result);
        }
    } catch (error) {
        console.error('Error syncing quotes with server:', error);
    }
}

// Updating local quotes from the server response
function updateLocalQuotes(fetchedQuotes) {
    const existingQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    
    fetchedQuotes.forEach(fetchedQuote => {
        const existingIndex = existingQuotes.findIndex(q => q.text === fetchedQuote.text);
        if (existingIndex === -1) {
            existingQuotes.push(fetchedQuote); // New quote from server
            notifyUser('New quote added from server: ' + fetchedQuote.text);
        } else {
            // Handle potential conflict resolution
            const existingQuote = existingQuotes[existingIndex];
            if (existingQuote.category !== fetchedQuote.category) {
                // If categories differ, keep the existing one for simplicity
                notifyUser('Conflict: Quote already exists with a different category.');
            } else {
                existingQuotes[existingIndex] = fetchedQuote; // Update existing quote
                notifyUser('Quote updated from server: ' + fetchedQuote.text);
            }
        }
    });

    localStorage.setItem('quotes', JSON.stringify(existingQuotes));
    populateCategories(); // Refresh categories in the dropdown
}

// Notify users about updates
function notifyUser(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Periodically fetch new quotes and sync local quotes with server
setInterval(() => {
    fetchQuotesFromServer();
    syncQuotes(); // Sync local quotes with server
}, 60000);

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        return; // Prevents errors if there are no quotes
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
        <p>"${randomQuote.text}"</p>
        <p><strong>Category:</strong> ${randomQuote.category}</p>
    `;
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Clear the current quote display
    quoteDisplay.innerHTML = '';

    // Filter quotes based on the selected category
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    // Display filtered quotes
    filteredQuotes.forEach(quote => {
        const quoteText = document.createElement('p');
        const quoteCategory = document.createElement('p');
        quoteText.textContent = `"${quote.text}"`;
        quoteCategory.innerHTML = `<strong>Category:</strong> ${quote.category}`;
        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
    });

    // Save the selected filter to localStorage
    localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to populate categories in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    // Clear existing options (except the "All Categories" option)
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }

    // Add unique categories to the dropdown
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Set the selected category based on the saved filter in localStorage
    const savedFilter = localStorage.getItem('selectedCategory');
    if (savedFilter) {
        categoryFilter.value = savedFilter;
        filterQuotes(); // Apply the saved filter
    }
}

// Function to add a new quote
async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        await syncQuoteWithServer(newQuote); // Sync the new quote with the server
        saveQuotes(); // Save quotes to local storage
        populateCategories(); // Update categories in the dropdown
        document.getElementById('newQuoteText').value = ''; // Clear input field
        document.getElementById('newQuoteCategory').value = ''; // Clear input field
        alert('Quote added successfully!');
        showRandomQuote(); // Show a random quote after adding a new one
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Function to sync a quote with the server
async function syncQuoteWithServer(quote) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Quote successfully posted to server:', result);
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}

// Load existing quotes from local storage on page load
window.onload = function() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    populateCategories(); // Populate categories on load
    showRandomQuote(); // Show a random quote
};

// Set an interval to fetch new quotes from the server every 60 seconds
setInterval(() => {
    fetchQuotesFromServer();
    syncQuotes(); // Sync local quotes with server
}, 60000);
