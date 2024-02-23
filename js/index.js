document.addEventListener('DOMContentLoaded', function () {
    const moviesList = document.getElementById('moviesList');
    const searchInput = document.getElementById('searchInput');
    const yearFilter = document.getElementById('yearFilter');
    const addMovieForm = document.getElementById('addMovieForm');
    const imageInput = document.getElementById('imageInput');
    
    let movies = [
      { title: 'Titanic', description: 'Romance', year: 1997 },
      { title: 'Inception', description: 'Ciencia ficción', year: 2009 },
      { title: 'Avatar', description: 'Acción / Ciencia ficción', year: 2010 },
      { title: 'Avengers: Endgame', description: 'Acción / Ciencia ficción', year: 2019 },
      { title: 'El juego de Ender', description: 'Acción / Ciencia ficción', year: 2010 },
      { title: 'Sueño de fuga', description: 'Suspenso / Crimen', year: 1994 }
    ];
    
    function renderMovies(moviesArray) {
        moviesList.innerHTML = '';
        moviesArray.forEach(movie => {
          const movieElement = document.createElement('div');
          movieElement.classList.add('movie');
          movieElement.innerHTML = `
            <h2>${movie.title}</h2>
            <img src="${movie.image}" alt="${movie.title}">
            <p><strong>Description:</strong> ${movie.description}</p>
            <p><strong>Year:</strong> ${movie.year}</p>
          `;
          moviesList.appendChild(movieElement);
        });
      }
      
      function filterMovies() {
        let filteredMovies = movies;
        
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
          filteredMovies = filteredMovies.filter(movie => movie.title.toLowerCase().includes(searchTerm));
        }
        
        const selectedYear = yearFilter.value;
        if (selectedYear) {
          filteredMovies = filteredMovies.filter(movie => movie.year === parseInt(selectedYear));
        }
        
        if (filteredMovies.length === 0) {
          moviesList.innerHTML = '<p>No se encontraron películas que coincidan con la búsqueda.</p>';
        } else {
          renderMovies(filteredMovies);
        }
    
        updateURL(searchTerm, selectedYear);
      }
      
      function updateURL(searchTerm, selectedYear) {
        const searchParams = new URLSearchParams();
        searchParams.set('search', searchTerm);
        searchParams.set('year', selectedYear);
        const queryString = searchParams.toString();
        history.pushState(null, '', `?${queryString}`);
      }
      
      function populateYearFilter() {
        const years = movies.map(movie => movie.year);
        const uniqueYears = [...new Set(years)];
        uniqueYears.sort((a, b) => b - a);
        yearFilter.innerHTML += uniqueYears.map(year => `<option value="${year}">${year}</option>`).join('');
      }
      
      function parseQueryString() {
        const queryString = window.location.search;
        const searchParams = new URLSearchParams(queryString);
        const searchTerm = searchParams.get('search') || '';
        const yearFilterValue = searchParams.get('year') || '';
        
        searchInput.value = searchTerm;
        yearFilter.value = yearFilterValue;
    
        filterMovies(); // Aplicar el filtro al cargar la página según los parámetros de la URL
      }
    
      // Manejar los eventos de búsqueda y filtrado
      searchInput.addEventListener('input', filterMovies);
      yearFilter.addEventListener('change', filterMovies);
    
      // Manejar el evento de envío del formulario para agregar una nueva película
      addMovieForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const title = document.getElementById('titleInput').value;
        const description = document.getElementById('descriptionInput').value;
        const year = parseInt(document.getElementById('yearInput').value);
        const imageFile = imageInput.files[0];
        
        if (title && description && year && imageFile) {
          const reader = new FileReader();
          reader.onload = function(event) {
            const imageSrc = event.target.result;
            movies.push({ title, description, year, image: imageSrc });
            renderMovies(movies);
            populateYearFilter();
            addMovieForm.reset();
          };
          reader.readAsDataURL(imageFile);
        } else {
          alert('Por favor complete todos los campos y seleccione una imagen.');
        }
      });
    
      // Al cargar la página, renderizar las películas y parsear la consulta de la URL
      renderMovies(movies);
      populateYearFilter();
      parseQueryString();
    });