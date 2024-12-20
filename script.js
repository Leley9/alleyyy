mapboxgl.accessToken = 'pk.eyJ1Ijoid2FsbGVsZSIsImEiOiJjbTRjMDhtNjkwNW9kMmtzOGIxbjJoY2YyIn0.epw_clbHNtGowUjqvtbKiw'; // token Mapbox valide

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [5.484289, 51.438174],
  zoom: 12.29
});

const markerSVG = `
<svg width="27" height="36" viewBox="0 0 27 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.2 35.3232C12.643 35.3158 12.0957 35.1764 11.6031 34.9163C11.1105 34.6562 10.6867 34.283 10.3664 33.8272C9.944 33.264 0 20.2224 0 13.2C0 9.69914 1.39071 6.34167 3.86619 3.86619C6.34167 1.39071 9.69914 0 13.2 0C16.7009 0 20.0583 1.39071 22.5338 3.86619C25.0093 6.34167 26.4 9.69914 26.4 13.2C26.4 20.24 16.456 33.264 16.0336 33.8272C15.7133 34.283 15.2895 34.6562 14.7969 34.9163C14.3043 35.1764 13.757 35.3158 13.2 35.3232ZM13.2 1.76C10.1674 1.76465 7.26025 2.97143 5.11584 5.11584C2.97143 7.26025 1.76465 10.1674 1.76 13.2C1.76 19.624 11.6512 32.56 11.7568 32.7536C11.919 32.986 12.1349 33.1757 12.3862 33.3068C12.6374 33.4378 12.9166 33.5062 13.2 33.5062C13.4834 33.5062 13.7626 33.4378 14.0138 33.3068C14.2651 33.1757 14.481 32.986 14.6432 32.7536C14.7488 32.6128 24.64 19.624 24.64 13.2C24.6353 10.1674 23.4286 7.26025 21.2842 5.11584C19.1398 2.97143 16.2326 1.76465 13.2 1.76Z" fill="#FFF200"/>
<path d="M13.1991 19.36C11.9807 19.36 10.7898 18.9988 9.77675 18.3219C8.76375 17.645 7.9742 16.683 7.50797 15.5574C7.04173 14.4318 6.91974 13.1932 7.15743 11.9983C7.39511 10.8034 7.9818 9.70576 8.84329 8.84426C9.70478 7.98277 10.8024 7.39609 11.9973 7.1584C13.1922 6.92072 14.4308 7.04271 15.5564 7.50894C16.682 7.97518 17.644 8.76472 18.3209 9.77773C18.9978 10.7907 19.3591 11.9817 19.3591 13.2C19.3591 14.8338 18.7101 16.4006 17.5548 17.5558C16.3996 18.711 14.8328 19.36 13.1991 19.36ZM13.1991 8.80004C12.3288 8.80004 11.4781 9.0581 10.7546 9.54158C10.031 10.0251 9.46702 10.7122 9.134 11.5162C8.80097 12.3202 8.71384 13.2049 8.88361 14.0584C9.05339 14.912 9.47245 15.696 10.0878 16.3113C10.7031 16.9267 11.4872 17.3457 12.3407 17.5155C13.1942 17.6853 14.0789 17.5981 14.8829 17.2651C15.6869 16.9321 16.3741 16.3681 16.8575 15.6446C17.341 14.921 17.5991 14.0703 17.5991 13.2C17.5991 12.0331 17.1355 10.9139 16.3103 10.0888C15.4852 9.26361 14.366 8.80004 13.1991 8.80004Z" fill="#FFF200"/>
</svg>
`;

let activeMarkers = [];

function getMarkersFromStorage() {
  const markers = JSON.parse(localStorage.getItem('markers'));
  return markers ? markers : [];
}

function saveMarkersToStorage(markers) {
  localStorage.setItem('markers', JSON.stringify(markers));
}

function getCategoriesFromStorage() {
  const categories = JSON.parse(localStorage.getItem('categories'));
  return categories ? categories : [];
}

function saveCategoriesToStorage(categories) {
  localStorage.setItem('categories', JSON.stringify(categories));
}

    function loadMarkers() {
      const savedMarkers = getMarkersFromStorage();
      savedMarkers.forEach(markerData => {
        const markerElement = document.createElement('div');
        markerElement.innerHTML = markerSVG;
    
        // Utilise markerData.title, markerData.description, markerData.category au lieu de title, description, category
        const popupHTML = `
          <div class="popup-content">
            <h3>${markerData.title}</h3>
            <p class="popup-category"><strong>Catégorie:</strong> ${markerData.category}</p>
            <p class="popup-description">${markerData.description}</p>
            <button class="delete-marker" aria-label="Delete Marker">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>
        `;
    
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([markerData.lng, markerData.lat])
          .setPopup(new mapboxgl.Popup().setHTML(popupHTML))
          .addTo(map);
    
        marker.getPopup().on('open', () => {
          const deleteButton = marker.getPopup().getElement().querySelector('.delete-marker');
          deleteButton.addEventListener('click', () => {
            marker.remove();
            const updatedMarkers = getMarkersFromStorage().filter(m => m.lat !== markerData.lat || m.lng !== markerData.lng);
            saveMarkersToStorage(updatedMarkers);
          });
        });
    
        activeMarkers.push(marker);
      });
    }
    
    

function loadCategories() {
  const dropdownItems = document.querySelectorAll('#dropdownMenu .dropdown-item');
  const categories = [...dropdownItems].map(item => item.getAttribute('data-category'));
  saveCategoriesToStorage(categories);
}

function populateCategoryDropdown() {
  const categorySelect = document.getElementById('category');
  if (!categorySelect) return;
  categorySelect.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select a category <3';
  categorySelect.appendChild(defaultOption);

  const categories = getCategoriesFromStorage();
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function filterMarkersByCategory(category) {
  activeMarkers.forEach(marker => marker.remove());
  activeMarkers = [];

  const savedMarkers = getMarkersFromStorage();
  savedMarkers
    .filter(marker => marker.category === category)
    .forEach(markerData => {
      const markerElement = document.createElement('div');
      markerElement.innerHTML = markerSVG;

      const popupHTML = `
        <div class="popup-content">
          <h3>${markerData.title}</h3>
          <p>${markerData.description}</p>
          <p><strong>Catégorie:</strong> ${markerData.category}</p>
          <button class="delete-marker" aria-label="Delete Marker">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      `;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([markerData.lng, markerData.lat])
        .setPopup(new mapboxgl.Popup().setHTML(popupHTML))
        .addTo(map);

      activeMarkers.push(marker);
    });
}

function attachCategoryFilterEvents() {
  const dropdownItems = document.querySelectorAll('#dropdownMenu .dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      const selectedCategory = item.getAttribute('data-category');
      filterMarkersByCategory(selectedCategory);
      document.getElementById('dropdownMenu').classList.add('hidden');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');          // Modal d'ajout de marqueur
  const profileModal = document.getElementById('profileModal'); // Modal profil
  const addMarkerBtn = document.getElementById('addMarkerBtn');
  const closeBtn = document.getElementById('closeBtn');
  const menuButton = document.getElementById('menuButton');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const topLeftControls = document.getElementById('topLeftControls');
  const topRightControls = document.getElementById('topRightControls');
  const menuButtonContainer = document.getElementById('menuButtonContainer');

  const form = document.getElementById('placeForm');
  const profileButton = document.getElementById('profileButton');
  const closeProfileModal = document.getElementById('closeProfileModal');
  const profileForm = document.getElementById('profileForm');

  // Fonction pour forcer l'affichage des contrôles sur mobile
  function restoreControlsOnMobile() {
    if (window.innerWidth <= 480) {
      if (topLeftControls) {
        topLeftControls.style.display = 'flex';
        topLeftControls.style.zIndex = '9999';
      }
      if (topRightControls) topRightControls.style.display = 'flex';
      if (addMarkerBtn) addMarkerBtn.style.display = 'block';
      if (profileButton) profileButton.style.display = 'block';
      if (menuButton) menuButton.style.display = 'inline-block';

      const profileFilterBtn = document.getElementById('profileFilterBtn');
      if (profileFilterBtn) profileFilterBtn.style.display = 'inline-block';
    }
  }

  // Charge les catégories, liste, et événements
  loadCategories();
  populateCategoryDropdown();
  attachCategoryFilterEvents();

  if (menuButton && dropdownMenu) {
    menuButton.addEventListener('click', () => {
      dropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (event) => {
      if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });
  }

  map.on('load', () => {
    if (addMarkerBtn) {
      addMarkerBtn.style.display = 'block';
    }
    loadMarkers();
  });

  // Affichage/masquage du modal d'ajout de marker
  if (addMarkerBtn && modal) {
    addMarkerBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  // Soumission du formulaire d'ajout de marker
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const category = document.getElementById('category').value;
      let address = document.getElementById('address').value.trim();

      address = address + ", Eindhoven, Netherlands";

      if (!address) {
        alert("Veuillez entrer une adresse.");
        return;
      }

      const encodedAddress = encodeURIComponent(address);
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

      fetch(nominatimUrl)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            if (isNaN(lat) || isNaN(lon)) {
              alert("Coordonnées invalides. Essayez une autre adresse.");
              return;
            }

            const markerElement = document.createElement('div');
            markerElement.innerHTML = markerSVG; 

            const popupHTML = `
              <div class="popup-content">
                <h3>${title}</h3>
                <p>${description}</p>
                <p><strong>Catégorie:</strong> ${category}</p>
                <button class="delete-marker" aria-label="Delete Marker">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                       viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            `;

            const marker = new mapboxgl.Marker(markerElement)
              .setLngLat([lon, lat])
              .setPopup(new mapboxgl.Popup().setHTML(popupHTML))
              .addTo(map);

            activeMarkers.push(marker);
            marker.category = category;

            marker.getPopup().on('open', () => {
              const deleteButton = marker.getPopup().getElement().querySelector('.delete-marker');
              deleteButton.addEventListener('click', () => {
                marker.remove();
                const savedMarkers = getMarkersFromStorage();
                const updatedMarkers = savedMarkers.filter(m => m.lat !== lat || m.lng !== lon);
                saveMarkersToStorage(updatedMarkers);
              });
            });

            const savedMarkers = getMarkersFromStorage();
            savedMarkers.push({ title, description, lat, lng: lon, category });
            saveMarkersToStorage(savedMarkers);

            modal.classList.add('hidden');
            form.reset();

            // Rétablir l'affichage des boutons
            if (topLeftControls) {
              topLeftControls.style.display = 'flex';
              topLeftControls.style.zIndex = '9999';
            }
            if (addMarkerBtn) addMarkerBtn.style.display = 'block';
            if (menuButton) menuButton.style.display = 'inline-block';

            // Forcer le rétablissement des contrôles sur mobile
            restoreControlsOnMobile();

          } else {
            alert("Aucun résultat trouvé pour cette adresse.");
          }
        })
        .catch(err => {
          console.error("Erreur géocodage Nominatim:", err);
          alert("Erreur lors de la récupération des coordonnées.");
        });
    });
  }

  // Gestion du profil (conversion image en base64)
  if (profileButton && profileModal) {
    profileButton.addEventListener('click', () => {
      profileModal.classList.remove('hidden');
    });
  }

  if (closeProfileModal && profileModal) {
    closeProfileModal.addEventListener('click', () => {
      profileModal.classList.add('hidden');
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName').value.trim();
      const description = document.getElementById('userDescription').value.trim();
      const photo = document.getElementById('profilePhoto').files[0];

      const profiles = JSON.parse(localStorage.getItem('profiles')) || [];

      if (photo) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result; 
          profiles.push({
            name,
            description,
            photo: dataUrl
          });

          localStorage.setItem('profiles', JSON.stringify(profiles));

          alert('Profile saved !');
          profileForm.reset();
          profileModal.classList.add('hidden');

          // Forcer le rétablissement des contrôles sur mobile
          restoreControlsOnMobile();
        };
        reader.readAsDataURL(photo);
      } else {
        profiles.push({
          name,
          description,
          photo: null
        });
        localStorage.setItem('profiles', JSON.stringify(profiles));

        alert('Profile saved !');
        profileForm.reset();
        profileModal.classList.add('hidden');

        // Forcer le rétablissement des contrôles sur mobile
        restoreControlsOnMobile();
      }
    });
  }

  // Affichage des informations de profils (liste) + Suppression
  const profileFilterBtn = document.getElementById('profileFilterBtn');
  const profileInfoModal = document.getElementById('profileInfoModal');
  const closeProfileInfoModal = document.getElementById('closeProfileInfoModal');

  if (profileFilterBtn) {
    profileFilterBtn.addEventListener('click', () => {
      const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
      const profileInfoContainer = document.getElementById('profileInfoContainer');
      profileInfoContainer.innerHTML = '';

      if (profiles.length > 0) {
        profiles.forEach((profileData, index) => {
          const { name, description, photo } = profileData;

          const singleProfileContainer = document.createElement('div');
          singleProfileContainer.style.border = '1px solid #ccc';
          singleProfileContainer.style.borderRadius = '5px';
          singleProfileContainer.style.padding = '10px';
          singleProfileContainer.style.marginBottom = '10px';
          singleProfileContainer.style.display = 'flex';
          singleProfileContainer.style.alignItems = 'center';
          singleProfileContainer.style.gap = '10px';

          // Photo de profil
          if (photo) {
            const img = document.createElement('img');
            img.src = photo;
            img.alt = 'Photo de profil';
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '50%';
            singleProfileContainer.appendChild(img);
          }

          const textContainer = document.createElement('div');
          const nameEl = document.createElement('h4');
          nameEl.textContent = name;
          nameEl.style.margin = '0';

          const descEl = document.createElement('p');
          descEl.textContent = description;
          descEl.style.margin = '0';

          textContainer.appendChild(nameEl);
          textContainer.appendChild(descEl);

          singleProfileContainer.appendChild(textContainer);

          // Ajout du bouton de suppression
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.style.marginLeft = 'auto';
          deleteBtn.setAttribute('data-index', index);
          singleProfileContainer.appendChild(deleteBtn);

          profileInfoContainer.appendChild(singleProfileContainer);

          // Événement de suppression
          deleteBtn.addEventListener('click', () => {
            const updatedProfiles = JSON.parse(localStorage.getItem('profiles')) || [];
            updatedProfiles.splice(index, 1); // Supprime le profil correspondant
            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

            // Re-render de la liste des profils
            profileFilterBtn.click();
          });
        });
      } else {
        const noProfileEl = document.createElement('p');
        noProfileEl.textContent = "Aucun profil n'a été enregistré.";
        profileInfoContainer.appendChild(noProfileEl);
      }

      // Affiche la modal
      profileInfoModal.classList.remove('hidden');
    });
  }

  if (closeProfileInfoModal) {
    closeProfileInfoModal.addEventListener('click', () => {
      profileInfoModal.classList.add('hidden');
    });
  }

});
