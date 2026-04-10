const apiUrl = "https://www.googleapis.com/books/v1/volumes";

const input = document.getElementById("search");
const authorInput = document.getElementById("authorSearch");
const yearInput = document.getElementById("yearSearch");
const btn = document.getElementById("btn");
const filterButton = document.getElementById("filterbutton");
const list = document.getElementById("main");
const darkToggle = document.getElementById("darkToggle");
const loginBtn = document.getElementById("loginBtn");
const loginOverlay = document.getElementById("loginOverlay");
const closeModal = document.getElementById("closeModal");

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    darkToggle.innerText = "☀️";
  } else {
    darkToggle.innerText = "🌙";
  }
});

loginBtn.addEventListener("click", () => {
  loginOverlay.classList.add("show");
});

closeModal.addEventListener("click", () => {
  loginOverlay.classList.remove("show");
});

loginOverlay.addEventListener("click", (e) => {
  if (e.target === loginOverlay) {
    loginOverlay.classList.remove("show");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  getBooks("scifi");
});

function handleSearch() {
  let query = "";
  const topic = input ? input.value.trim() : "";
  const author = authorInput.value.trim();
  const year = yearInput.value.trim();

  if (topic) {
    query += topic;
  } else if (!author && !year) {
    query += "scifi";
  }

  if (author) {
    query += `+inauthor:"${author}"`;
  }

  if (year) {
    query += `+${year}`;
  }

  if (query.startsWith("+")) {
    query = query.substring(1);
  }

  getBooks(query, year);
}

btn.addEventListener("click", handleSearch);
filterButton.addEventListener("click", handleSearch);

async function getBooks(q, targetYear = "") {
  list.innerHTML = "<h2>Searching books...</h2>";

  try {
    const res = await fetch(`${apiUrl}?q=${encodeURIComponent(q)}&maxResults=40`);
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();
    
    if (!data.items) {
      list.innerHTML = "<h2>No results found.</h2>";
      return;
    }

    let items = data.items;

    if (targetYear !== "") {
      items = items.filter(book => {
         const info = book.volumeInfo;
         const pubYear = info.publishedDate ? info.publishedDate.split('-')[0] : "";
         return pubYear === targetYear;
      });
    }

    displayBooks(items);

  } catch (err) {
    list.innerHTML = "<h2>Error loading data</h2>";
    console.error(err);
  }
}

function displayBooks(books) {
  list.innerHTML = "";

  if (books.length === 0) {
    list.innerHTML = "<h2>No books matched your criteria.</h2>";
    return;
  }

  books.forEach(book => {
    const info = book.volumeInfo;

    const container = document.createElement("div");
    container.classList.add("card-container");

    const card = document.createElement("div");
    card.classList.add("bookListCard");

    const front = document.createElement("div");
    front.classList.add("card-front");

    const img = document.createElement("img");
    const title = document.createElement("h3");
    const authorText = document.createElement("p");
    const yearText = document.createElement("p");

    img.src = info.imageLinks?.thumbnail || "https://via.placeholder.com/150";
    title.innerText = info.title || "No Title";
    authorText.innerText = info.authors ? info.authors.join(", ") : "Unknown Author";
    
    const pubYear = info.publishedDate ? info.publishedDate.split('-')[0] : "Unknown Year";
    yearText.innerText = `Year: ${pubYear}`;
    yearText.style.color = "gray"; 
    yearText.style.fontSize = "14px";

    front.appendChild(img);
    front.appendChild(title);
    front.appendChild(authorText);
    front.appendChild(yearText);

    const back = document.createElement("div");
    back.classList.add("card-back");

    const backTitle = document.createElement("h3");
    backTitle.innerText = info.title || "No Title";

    const summary = document.createElement("p");
    if (info.description) {
      summary.innerText = info.description.length > 300
        ? info.description.substring(0, 300) + "..."
        : info.description;
    } else {
      summary.innerText = "No summary available.";
    }

    back.appendChild(backTitle);
    back.appendChild(summary);

    card.appendChild(front);
    card.appendChild(back);
    container.appendChild(card);
    list.appendChild(container);
  });
}