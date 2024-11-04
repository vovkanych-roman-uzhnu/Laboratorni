document.addEventListener('DOMContentLoaded', () => {
    const petContainer = document.getElementById('pet-cards');
    const modal = document.getElementById('modal');
    const modalInfo = document.getElementById('modal-info');
    const searchInput = document.getElementById('search');
    const speciesFilter = document.getElementById('species-filter');
    const genderFilter = document.getElementById('gender-filter');
    const adoptionFilter = document.getElementById('adoption-filter');
  
    async function fetchPets() {
      try {
        const response = await fetch('shelter.json');
        if (!response.ok) throw new Error('Не вдалося завантажити дані');
        const pets = await response.json();
        displayPets(pets);
      } catch (error) {
        petContainer.innerHTML = `<p>${error.message}</p>`;
      }
    }
  
    function displayPets(pets) {
      petContainer.innerHTML = '';
      const filteredPets = pets
        .filter(pet => {
          const matchesSearch = pet.name.toLowerCase().includes(searchInput.value.toLowerCase()) || 
                               pet.breed.toLowerCase().includes(searchInput.value.toLowerCase());
          const matchesSpecies = speciesFilter.value === '' || pet.species === speciesFilter.value;
          const matchesGender = genderFilter.value === '' || pet.gender === genderFilter.value;
          const matchesAdoption = !adoptionFilter.checked || !pet.adopted;
          return matchesSearch && matchesSpecies && matchesGender && matchesAdoption;
        });
  
      if (filteredPets.length === 0) {
        petContainer.innerHTML = '<p>Нічого не знайдено</p>';
        return;
      }
  
      filteredPets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = `pet-card ${pet.adopted ? 'adopted' : ''}`;
        petCard.innerHTML = `
          ${pet.adopted ? '<span class="adopted-badge">Усиновлено</span>' : ''}
          <h2>${pet.name}</h2>
          <p>Вид: ${pet.species}</p>
          <p>Порода: ${pet.breed}</p>
          <p>Вік: ${pet.age} років</p>
          <p>Стать: ${pet.gender}</p>
          <p>${pet.description}</p>
        `;
        petCard.addEventListener('click', () => showModal(pet));
        petContainer.appendChild(petCard);
      });
    }
  
    function showModal(pet) {
      modalInfo.innerHTML = `
        <h2>${pet.name}</h2>
        <p>Вид: ${pet.species}</p>
        <p>Порода: ${pet.breed}</p>
        <p>Вік: ${pet.age} років</p>
        <p>Стать: ${pet.gender}</p>
        <p>Опис: ${pet.description}</p>
        <p>Дата прибуття: ${pet.arrivalDate}</p>
        <p>Статус усиновлення: ${pet.adopted ? 'Усиновлено' : 'Доступний'}</p>
      `;
      modal.classList.remove('hidden');
    }
  
    function closeModal() {
      modal.classList.add('hidden');
    }
  
    searchInput.addEventListener('input', () => fetchPets());
    speciesFilter.addEventListener('change', () => fetchPets());
    genderFilter.addEventListener('change', () => fetchPets());
    adoptionFilter.addEventListener('change', () => fetchPets());
    window.onclick = event => { if (event.target === modal) closeModal(); };
  
    fetchPets();
  });
  
