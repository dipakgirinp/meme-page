document.getElementById("uploadForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const apiKey = "51dfd3859a36b25a22aaa31a074d222d"; // Replace with your actual API key
  const imageFile = document.getElementById("image").files[0];
  const memeTitle = document.getElementById("title").value.trim();
  const memeGrid = document.getElementById("memeGrid");

  if (!imageFile) {
    alert("Please select an image to upload!");
    return;
  }
  if (!memeTitle) {
    alert("Please enter a title for your meme!");
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
      const currentDate = new Date().toISOString().split("T")[0]; // Get the current date
      const memeId = result.data.id; // Unique identifier from imgbb

      // Save meme ID in localStorage
      const uploadedMemes = JSON.parse(localStorage.getItem("uploadedMemes")) || [];
      uploadedMemes.push(memeId);
      localStorage.setItem("uploadedMemes", JSON.stringify(uploadedMemes));

      // Create a new meme card
      const memeCard = document.createElement("div");
      memeCard.className = "container lc";
      memeCard.setAttribute("data-id", memeId); // Assign meme ID to the container
      memeCard.innerHTML = `
        <div class="meme">
          <img src="${imageUrl}" alt="${memeTitle}">
        </div>
        <div class="info">
          <p class="title">${memeTitle}</p>
          <p class="date">${currentDate}</p>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      // Attach delete functionality to the button
      memeCard.querySelector(".delete-btn").addEventListener("click", function () {
        deleteMeme(memeCard, memeId);
      });

      // Add the new meme card to the grid
      memeGrid.prepend(memeCard);

      // Clear the upload form
      document.getElementById("uploadForm").reset();
    } else {
      alert("Image upload failed. Please try again.");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("An error occurred. Please try again.");
  }
});

// Function to delete a meme
function deleteMeme(memeCard, memeId) {
  const uploadedMemes = JSON.parse(localStorage.getItem("uploadedMemes")) || [];
  if (uploadedMemes.includes(memeId)) {
    memeCard.remove(); // Remove meme from the grid

    // Update localStorage
    const updatedMemes = uploadedMemes.filter(id => id !== memeId);
    localStorage.setItem("uploadedMemes", JSON.stringify(updatedMemes));
  } else {
    alert("You can only delete memes you uploaded.");
  }
}

// Check existing memes and show delete button only for user-uploaded ones
document.querySelectorAll(".container").forEach(memeCard => {
  const memeId = memeCard.getAttribute("data-id");
  const uploadedMemes = JSON.parse(localStorage.getItem("uploadedMemes")) || [];
  
  // Skip memes without a valid data-id or those not uploaded by the user
  if (memeId && uploadedMemes.includes(memeId)) {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteMeme(memeCard, memeId);
    });
    memeCard.querySelector(".info").appendChild(deleteBtn);
  }
});




