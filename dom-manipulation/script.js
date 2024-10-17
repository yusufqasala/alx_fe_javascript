let quotes = [
  {
    text: "The best way to predict the future is to create it.",
    category: "Inspiration",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  { text: "Get busy living or get busy dying.", category: "Life" },
  {
    text: "Success is not the key to happiness. Happiness is the key to success.",
    category: "Success",
  },
  {
    text: "If you love what you are doing, you will be successful.",
    category: "Success",
  },
  { text: "You miss 100% of the shots you don’t take.", category: "Sports" },
  {
    text: "It is not whether you get knocked down, it’s whether you get up.",
    category: "Sports",
  },
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");

  quoteText.textContent = `"${randomQuote.text}"`;
  quoteDisplay.innerHTML = `<strong>Category:</strong> ${randomQuote.category}`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
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
    quoteText.textContent = `${quote.text}`;
    quoteCategory.innerHTML = `<strong>Category:</strong> ${quote.category}`;
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  });

  localStorage.setItem("selectedCategory", selectedCategory);
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))]; // Get unique categories

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
