let quotes = [];

const API_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const fetchedQuotes = data.map((item) => ({
      text: item.title,
      category: "General",
    }));
    updateLocalQuotes(fetchedQuotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

function updateLocalQuotes(fetchedQuotes) {
  const existingQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  fetchedQuotes.forEach((fetchedQuote) => {
    const existingIndex = existingQuotes.findIndex(
      (q) => q.text === fetchedQuote.text
    );
    if (existingIndex === -1) {
      existingQuotes.push(fetchedQuote);
      notifyUser("New quote added from server: " + fetchedQuote.text);
    } else {
      existingQuotes[existingIndex] = fetchedQuote;
      notifyUser("Quote updated from server: " + fetchedQuote.text);
    }
  });

  localStorage.setItem("quotes", JSON.stringify(existingQuotes));
  populateCategories();
}

function notifyUser(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 5000);
}

setInterval(fetchQuotesFromServer, 60000);

function showRandomQuote() {
  if (quotes.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
        <p>"${randomQuote.text}"</p>
        <p><strong>Category:</strong> ${randomQuote.category}</p>
    `;
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");

  quoteDisplay.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  filteredQuotes.forEach((quote) => {
    const quoteText = document.createElement("p");
    const quoteCategory = document.createElement("p");
    quoteText.textContent = `"\${quote.text}"`;
    quoteCategory.innerHTML = `<strong>Category:</strong> ${quote.category}`;
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  });

  localStorage.setItem("selectedCategory", selectedCategory);
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];

  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
    showRandomQuote();
  } else {
    alert("Please enter both quote text and category.");
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

window.onload = function () {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
  populateCategories();
  showRandomQuote();
};

setInterval(fetchQuotesFromServer, 60000);
