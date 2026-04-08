const GB_API = "https://www.googleapis.com/books/v1/volumes";

const input = document.getElementById("search");
const authorInput = document.getElementById("authorSearch");
const yearInput = document.getElementById("yearSearch");
const btn = document.getElementById("btn");
const filterButton = document.getElementById("filterbutton");
const bookList = document.getElementById("main");

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

    const bookListCard = document.createElement("div");
    bookListCard.classList.add("bookListCard");

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

    bookListCard.appendChild(img);
    bookListCard.appendChild(title);
    bookListCard.appendChild(authorText);
    bookListCard.appendChild(yearText);

    bookList.appendChild(bookListCard);
  });
}