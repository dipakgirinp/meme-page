// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVddiVTBwWU3Yh4d5tl5oulZQrfOby3to",
  authDomain: "meme-page-9669a.firebaseapp.com",
  projectId: "meme-page-9669a",
  storageBucket: "meme-page-9669a.firebasestorage.app",
  messagingSenderId: "889982386712",
  appId: "1:889982386712:web:338ef22bb46af8f865b96d",
  measurementId: "G-N52JJTVGE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Function to load memes from Firestore
async function loadMemes() {
  const memeGrid = document.getElementById("memeGrid");

  try {
    const querySnapshot = await db.collection("memes").get();
    querySnapshot.forEach((doc) => {
      const meme = doc.data();

      const memeCard = document.createElement("div");
      memeCard.className = "container lc";
      memeCard.innerHTML = `
        <div class="meme">
          <img src="${meme.url}" alt="${meme.title}">
        </div>
        <div class="info">
          <p class="title">${meme.title}</p>
          <p class="date">${meme.date}</p>
        </div>
      `;
      memeGrid.appendChild(memeCard);
    });
  } catch (error) {
    console.error("Error loading memes:", error);
  }
}

// Call loadMemes when the page loads
window.onload = loadMemes;

// Function to upload a new meme
document.getElementById("uploadForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const apiKey = "51dfd3859a36b25a22aaa31a074d222d"; // Replace with your actual API key
  const imageFile = document.getElementById("image").files[0];
  const memeTitle = document.getElementById("title").value.trim();
  const memeGrid = document.getElementById("memeGrid");

  if (!imageFile || !memeTitle) {
    alert("Please select an image and enter a title!");
    return;
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (result.success) {
      const imageUrl = result.data.url;
      const currentDate = new Date().toISOString().split("T")[0];

      // Save to Firestore
      await db.collection("memes").add({
        title: memeTitle,
        url: imageUrl,
        date: currentDate,
      });

      // Add the new meme to the grid
      const memeCard = document.createElement("div");
      memeCard.className = "container lc";
      memeCard.innerHTML = `
        <div class="meme">
          <img src="${imageUrl}" alt="${memeTitle}">
        </div>
        <div class="info">
          <p class="title">${memeTitle}</p>
          <p class="date">${currentDate}</p>
        </div>
      `;
      memeGrid.prepend(memeCard);

      // Clear the form
      document.getElementById("uploadForm").reset();
    } else {
      alert("Image upload failed. Please try again.");
    }
  } catch (error) {
    console.error("Error uploading meme:", error);
    alert("An error occurred. Please try again.");
  }
});



