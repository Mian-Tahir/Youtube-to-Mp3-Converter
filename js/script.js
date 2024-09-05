const urlForm = document.getElementById("url-form");
const urlInput = document.getElementById("url-input");
const videoInfo = document.getElementById("video-info");

urlForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const videoUrl = urlInput.value;

  try {
    const response = await fetch(
      `https://youtube-video-and-shorts-downloader1.p.rapidapi.com/api/getYTVideo?url=${encodeURIComponent(
        videoUrl
      )}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "8ea872bc54mshdeafdae687e97ebp114b19jsn304ccc609619",
          "x-rapidapi-host":
            "youtube-video-and-shorts-downloader1.p.rapidapi.com",
        },
      }
    );

    const data = await response.json();

    if (data.description && data.author.name) {
      videoInfo.innerHTML = `
        <div class="container">
          <div class="thumbnail-container">
            <img src="${data.stats.thumbnails[3].url}" alt="${data.description}" class="thumbnail" />
            <h2 class="video-title">${data.description}</h2>
          </div>
          <div class="table-container">
            <table class="conversion-table">
              <thead>
                <tr>
                  <th>Quality</th>
                  <th>File Size</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>(.mp3) 128Kbps</td>
                  <td>5 MB</td>
                  <td><button class="convert-btn" data-link="${data.links[0].link}">Convert</button></td>
                </tr>
                <tr>
                  <td>(.mp3) 256Kbps</td>
                  <td>3 MB</td>
                  <td><button class="convert-btn" data-link="${data.links[0].link}">Convert</button></td>
                </tr>
                <tr>
                  <td>(.mp3) 320Kbps</td>
                  <td>1 MB</td>
                  <td><button class="convert-btn" data-link="${data.links[0].link}">Convert</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
      urlInput.value = "";

      // Add event listeners to all convert buttons
      const convertButtons = document.querySelectorAll(".convert-btn");
      convertButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
          const btn = e.target;
          btn.textContent = "Processing...";
          btn.disabled = true;

          // Simulate conversion process with a delay
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate 3s delay for conversion

          // After conversion, update button to 'Download'
          btn.textContent = "Download";
          btn.classList.remove("convert-btn");
          btn.classList.add("download-btn");
          btn.disabled = false;

          // Add download link to the button
          btn.addEventListener("click", () => {
            window.location.href = btn.getAttribute("data-link");
          });
        });
      });
    } else {
      alert("Failed to fetch video details.");
    }
  } catch (error) {
    console.error(error.message);
    alert("An error occurred while fetching video information.");
  }
});
