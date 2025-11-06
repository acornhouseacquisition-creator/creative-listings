let listings = [];

async function loadListings() {
  const res = await fetch("data.json");
  listings = await res.json();

  const container = document.getElementById("listings");
  const map = L.map("map").setView([37.8, -96], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  container.innerHTML = "";

  listings.forEach((listing) => {
    const card = document.createElement("div");
    card.className = "listing-card";
    card.innerHTML = `
      <img src="${listing.image}" alt="${listing.title}">
      <h3>${listing.title}</h3>
      <p>${listing.city}</p>
      <p><strong>Price:</strong> ${listing.price}</p>
      <a href="listing.html?id=${listing.id}" class="view-btn">View Details</a>
    `;
    container.appendChild(card);

    const marker = L.marker(listing.coords).addTo(map);
    marker.bindPopup(`<b>${listing.title}</b><br>${listing.city}`);
  });
}

function filterListings(type) {
  const filtered =
    type === "all" ? listings : listings.filter((l) => l.type === type);
  renderFiltered(filtered);
}

function renderFiltered(data) {
  const container = document.getElementById("listings");
  container.innerHTML = "";
  data.forEach((listing) => {
    const card = document.createElement("div");
    card.className = "listing-card";
    card.innerHTML = `
      <img src="${listing.image}" alt="${listing.title}">
      <h3>${listing.title}</h3>
      <p>${listing.city}</p>
      <p><strong>Price:</strong> ${listing.price}</p>
      <a href="listing.html?id=${listing.id}" class="view-btn">View Details</a>
    `;
    container.appendChild(card);
  });
}

function loadPropertyDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      const property = data.find((p) => p.id === id);
      document.title = property.title;
      document.getElementById("propertyTitle").innerText = property.title;
      document.getElementById("images").innerHTML = `
        <img src="${property.image}" alt="${property.title}">
      `;
      document.getElementById("details").innerHTML = `
        <h3>Price: ${property.price}</h3>
        <p>${property.bedrooms} Beds | ${property.bathrooms} Baths</p>
        <p><strong>Down Payment:</strong> ${property.down}</p>
        <p><strong>Monthly Payment:</strong> ${property.monthly}</p>
        <p><strong>Type:</strong> ${property.type}</p>
      `;
    });
}

if (window.location.pathname.endsWith("index.html")) {
  loadListings();
}
