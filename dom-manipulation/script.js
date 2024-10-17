let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories

  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem('selectedCategory');
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');

  quoteDisplay.innerHTML = '';

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  filteredQuotes.forEach(quote => {
    const quoteText = document.createElement('p');
    const quoteCategory = document.createElement('p');
    quoteText.textContent = `"${quote.text}"`;
    quoteCategory.innerHTML = `<strong>Category:</strong> ${quote.category}`;
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  });

  localStorage.setItem('selectedCategory', selectedCategory);
}

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    saveQuotes();

    populateCategories();

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    alert('New quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes(); 
        populateCategories(); 
        alert('Quotes imported successfully!');
        filterQuotes(); 
      } else {
        alert('Invalid JSON format.');
      }
    } catch (error) {
      alert('Error parsing the file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

window.onload = function() {
  populateCategories();  
  filterQuotes();        

  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) {
    const parsedQuote = JSON.parse(lastViewedQuote);
    alert(`Last viewed quote: "${parsedQuote.text}" - Category: ${parsedQuote.category}`);
  }
};
