const GB_API = "https://www.googleapis.com/books/v1/volumes";

const input = document.getElementById("search");
const authorInput = document.getElementById("authorSearch");
const yearInput = document.getElementById("yearSearch");
const btn = document.getElementById("btn");
const filterButton = document.getElementById("filterbutton");
const bookList = document.getElementById("main");
const darkToggle = document.getElementById("darkToggle");
const loginBtn = document.getElementById("loginBtn");
const loginOverlay = document.getElementById("loginOverlay");
const closeModal = document.getElementById("closeModal");

// dark mode toggle
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    darkToggle.innerText = "☀️";
  } else {
    darkToggle.innerText = "🌙";
  }
});

// login modal open/close
loginBtn.addEventListener("click", () => {
  loginOverlay.classList.add("show");
});

closeModal.addEventListener("click", () => {
  loginOverlay.classList.remove("show");
});

// close modal when clicking outside
loginOverlay.addEventListener("click", (e) => {
  if (e.target === loginOverlay) {
    loginOverlay.classList.remove("show");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  searchGoogleBooks("programming");
});

function handleSearchRequest() {
  let apiQuery = "";
  const mainTopic = input ? input.value.trim() : "";
  const author = authorInput.value.trim();
  const year = yearInput.value.trim();

  if (mainTopic) {
    apiQuery += mainTopic;
  } else if (!author && !year) {
    apiQuery += "programming";
  }

  if (author) {
    apiQuery += `+inauthor:"${author}"`;
  }

  if (year) {
    apiQuery += `+${year}`;
  }

  if (apiQuery.startsWith("+")) {
    apiQuery = apiQuery.substring(1);
  }

  searchGoogleBooks(apiQuery, year);
}

btn.addEventListener("click", handleSearchRequest);
filterButton.addEventListener("click", handleSearchRequest);

async function searchGoogleBooks(query, targetYear = "") {
  bookList.innerHTML = "<h2>Searching Google's entire database...</h2>";

  try {
    const res = await fetch(`${GB_API}?q=${encodeURIComponent(query)}&maxResults=40`);
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();
    
    if (!data.items) {
      bookList.innerHTML = "<h2>No results found in the global database.</h2>";
      return;
    }

    let fetchedBooks = data.items;

    if (targetYear !== "") {
      fetchedBooks = fetchedBooks.filter(book => {
         const info = book.volumeInfo;
         const pubYear = info.publishedDate ? info.publishedDate.split('-')[0] : "";
         return pubYear === targetYear;
      });
    }

    renderBooks(fetchedBooks);

  } catch (err) {
    bookList.innerHTML = "<h2>Error fetching data</h2>";
    console.error(err);
  }
}

function renderBooks(books) {
  bookList.innerHTML = "";

  if (books.length === 0) {
    bookList.innerHTML = "<h2>No books perfectly matched your strict year/author criteria.</h2>";
    return;
  }

  books.forEach(book => {
    const info = book.volumeInfo;

    // outer container for flip effect
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const bookListCard = document.createElement("div");
    bookListCard.classList.add("bookListCard");

    // front side
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

    // back side - summary
    const back = document.createElement("div");
    back.classList.add("card-back");

    const backTitle = document.createElement("h3");
    backTitle.innerText = info.title || "No Title";

    const summary = document.createElement("p");
    if (info.description) {
      // show first 300 characters of description
      summary.innerText = info.description.length > 300
        ? info.description.substring(0, 300) + "..."
        : info.description;
    } else {
      summary.innerText = "No summary available for this book.";
    }

    back.appendChild(backTitle);
    back.appendChild(summary);

    // put it all together
    bookListCard.appendChild(front);
    bookListCard.appendChild(back);
    cardContainer.appendChild(bookListCard);
    bookList.appendChild(cardContainer);
  });
}