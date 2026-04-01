const GB_API = "https://www.googleapis.com/books/v1/volumes";

const input = document.getElementById("search");
const btn = document.getElementById("btn");

const bookList = document.getElementById("main");

btn.addEventListener("click", () => {
  // console.log("Button clicked"); 
  const query = input.value.trim();
  if (query) {
    searchBooks(query);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  searchBooks("programming");
});

async function searchBooks(query) {
  // console.log("Searching:", query); 
  bookList.innerHTML = "<h2>Loading...</h2>";

  try {
    const res = await fetch(`${GB_API}?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();
    bookList.innerHTML = "";

    if (!data.items) {
      bookList.innerHTML = "<h2>No results found</h2>";
      return;
    }

    data.items.forEach(book => {
      const info = book.volumeInfo;

      const bookListCard = document.createElement("div");
      bookListCard.classList.add("bookListCard");

      const img = document.createElement("img");
      const title = document.createElement("h3");
      const author = document.createElement("p");
      // const desc = document.createElement("p");

      
      img.src = info.imageLinks?.thumbnail || "https://via.placeholder.com/150";

      
      title.innerText = info.title || "No Title";

      // Author
      author.innerText = info.authors ? info.authors.join(", ") : "Unknown";

      // Description (short)
      // desc.innerText = info.description
      //   ? info.description.slice(0, 100) + "..."
      //   : "No description available";

      bookListCard.appendChild(img);
      bookListCard.appendChild(title);
      bookListCard.appendChild(author);
      // bookListCard.appendChild(desc);

      bookList.appendChild(bookListCard);
    });

  } catch (err) {
    bookList.innerHTML = "<h2>Error fetching data</h2>";
    console.error(err);
  }
}