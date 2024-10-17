let quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Motivation",
  },
  {
    text: "Life is 10% what happens to us and 90% how we react to it.",
    category: "Life",
  },
  {
    text: "Success is not the key to happiness. Happiness is the key to success.",
    category: "Success",
  },
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><strong>Category:</strong> ${randomQuote.category}</p>`;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("New quote added successfully!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

document.getElementById("addQuoteButton").addEventListener("click", addQuote);

window.onload = showRandomQuote;
