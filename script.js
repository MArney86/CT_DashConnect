// Function to display error messages to the user when API calls fail
const displayError = (api,error, outputDiv) => {
  console.log(`${api}API Error: ${error}`);
  const errorMessage = document.createElement('p');
    errorMessage.className = "error-message";
    errorMessage.innerHTML = `${api} API Error: ${error}`;
    outputDiv.innerHTML = '';
    outputDiv.appendChild(errorMessage);
}

// Function to show loading spinner while waiting for API responses
const showLoading = (outputDiv) => {
  outputDiv.innerHTML = '<div class="loading-container"><div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
}

// Fetches a random dog image from the Dog CEO API
const getDogImage = async () => {
  const dogOutput = document.getElementById("dog-output");
  showLoading(dogOutput); // Show loading spinner
  
  try {
    // Make API call to get random dog image
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    if (!response.ok) {
      displayError('Dog', response.status, dogOutput);
      return;
    }
    const data = await response.json();
    console.log(data);
    
    // Clear loading spinner and create image element
    dogOutput.innerHTML = '';
    const dogImage = document.createElement('img');
    dogImage.setAttribute('src', data.message); // Set image source from API response
    dogImage.className = 'dog-image';
    dogImage.alt = 'Random dog image';
    dogOutput.appendChild(dogImage);
  } catch (error) {
    displayError('Dog', 'Network error', dogOutput);
  }
}

// Fetches a random cat image from The Cat API
const getCatImage = async () => {
  const catOutput = document.getElementById("cat-output");
  showLoading(catOutput); // Show loading spinner
  
  try {
    // Make API call to get random cat image
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    if(!response.ok) {
      displayError('Cat', response.status, catOutput);
      return;
    }
    const data = await response.json();
    console.log(data);
    
    // Clear loading spinner and create image element
    catOutput.innerHTML = '';
    const catImage = document.createElement('img');
    catImage.setAttribute('src', data[0].url); // Cat API returns array, use first element
    catImage.className = 'cat-image';
    catImage.alt = 'Random cat image';
    catOutput.appendChild(catImage);
  } catch (error) {
    displayError('Cat', 'Network error', catOutput);
  }
}

// Fetches weather data for a specified city and state using Open-Meteo API
const getWeather = () => {
  const weatherOutput = document.getElementById("weather-output");
  const location = {
    city: "",
    state:"",
  }
  // Weather condition codes mapping for user-friendly display
  const weatherCodes = {"0": "Clear sky","1": "Mainly clear","2": "Partly cloudy","3":"Overcast","45":"Fog","48":"Depositing rime fog","51":"Light Drizzle","53":"Moderate Drizzle","55":"Dense Drizzle","56":"Light Freezing Drizzle","57":"Dense Freezing Drizzle","61":"Slight Rain","63":"Moderate Rain","65":"Dense Rain","66":"Light Freezing Rain","67":"Heavy Freezing Rain","71":"Slight Snow Fall","73":"Moderate Snow Fall","75":"Heavy Snow Fall","77":"Snow Grains","80":"Slight Rain Showers","82":"Violent Rain Showers","85":"Slight Snow Showers","86":"Heavy Snow Showers","95":"Thunderstorm","96":"Thunderstorm with Slight Hail","99": "Thunderstorm with Heavy Hail",
  }
  
  // Initialize or get the div for displaying received data
  let recievedDiv = null;
  if(!document.getElementById('recieved-div')) {
    recievedDiv = document.createElement('div');
    recievedDiv.id = 'recieved-div';
    weatherOutput.appendChild(recievedDiv);
  } else {
    recievedDiv = document.getElementById('recieved-div');
  }
  
  // Handle user input for city and state
  const handleInput = (e) => {
    if (e.target.id === "city-input") {
      location.city = e.target.value;
    } else if (e.target.id === "state-input") {
      location.state = e.target.value;
    }
  }
  
  // Get geographic coordinates for the specified city using geocoding API
  const getCityCoord = async () => {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location.city}&count=10&language=en&format=json`);
    if (!response.ok) {
      displayError('GeoCoding', response.status, recievedDiv);
      return;
    }
    const data = await response.json();
    if (data.results.length === 0) {
      recievedDiv.innerHTML = `<p class="error-message">No results found for the specified city.</p>`;
      return;
    }
    // Filter results to match both city and state
    const filtered = data.results.filter((result) => {
      return result.name === location.city && result.admin1 === location.state;
    });
    if (filtered.length === 0) {
      recievedDiv.innerHTML = `<p class="error-message">No results found for the specified city and state.</p>`;
      return;
    }
    if (filtered.length === 1) {
      // Single match found - proceed with weather data
      const cityCoord = {
        latitude: filtered[0].latitude,
        longitude: filtered[0].longitude
      };
      getWeatherData(cityCoord);
    } else {
      // Multiple matches - let user choose
      recievedDiv.innerHTML = `<label for='choose-city'>Choose a city:</label>
                            <select id='choose-city' name='choose-city'>
                            ${filtered.map((result) => {
                            return `<option value="${result.name}">${result.name}</option>`;
                            }).join('')} </select>`;
      document.getElementById('choose-city').addEventListener("change", (e) => {
        const selectedCity = filtered.find(result => result.name === e.target.value);
        if (selectedCity) {
          const cityCoord = {
            latitude: selectedCity.latitude,
            longitude: selectedCity.longitude
          };
          getWeatherData(cityCoord);
        }
      });
    }
  }
  
  // Fetch actual weather data using coordinates
  const getWeatherData = async (cityCoord) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${cityCoord.latitude}&longitude=${cityCoord.longitude}&current=temperature_2m,is_day,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m,surface_pressure,wind_gusts_10m,weather_code&timezone=auto&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`);
    if (!response.ok) {
      displayError('Weather', response.status, recievedDiv);
      return;
    }
    const data = await response.json();
    console.log(data);
    // Create and display weather results
    const weatherResults = document.createElement('div');
    weatherResults.className = "weather-results";
    weatherResults.innerHTML = `<h3>Current Weather for ${location.city}, ${location.state}</h3>
    <p>Temperature: ${data.current.temperature_2m}${data.current_units.temperature_2m}</p>
    <p>Conditions: ${weatherCodes[data.current.weather_code]}</p>
    <p>Cloud Cover: ${data.current.cloud_cover}${data.current_units.cloud_cover}</p>
    <p>Precipitation: ${data.current.precipitation}${data.current_units.precipitation}</p>
    <p>Pressure: ${data.current.surface_pressure}${data.current_units.surface_pressure}</p>
    <p>Wind Speed: ${data.current.wind_speed_10m}${data.current_units.wind_speed_10m}</p>
    <p>Wind Gusts: ${data.current.wind_gusts_10m}${data.current_units.wind_gusts_10m}</p>`;
    document.getElementById('weather-input').remove(); // Remove input form after getting results
    recievedDiv.innerHTML = ``;
    recievedDiv.appendChild(weatherResults);
  }
  
  // Create input form for city and state entry
  if(!document.getElementById("weather-input")) {
    const weatherInput = document.createElement('div');
    weatherInput.id = "weather-input";
    weatherInput.innerHTML = `<label for="city-input">City</label>
    <input class="city-input" id="city-input" name="city-input" type="text">
    <label for="state-input">State</label>
    <input class="state-input" id="state-input" name="state-input" type="text">
    <button type="button" id="weather-submit-btn">&#128269;</button>`;
    weatherOutput.appendChild(weatherInput);
    // Add event listeners for input handling and form submission
    document.getElementById('city-input').addEventListener("change", handleInput);
    document.getElementById('state-input').addEventListener("change", handleInput);
    document.getElementById('weather-submit-btn').addEventListener("click", getCityCoord);
  }
}

// Fetches current USD to EUR exchange rate from ExchangeRate-API
const getExchangeRates = async () => {
  const currencyOutput = document.getElementById('currency-output');
  showLoading(currencyOutput); // Show loading spinner
  
  try {
    // Make API call to get exchange rates (USD base currency)
    const response = await fetch('https://v6.exchangerate-api.com/v6/7482ac5438c71c73413b1009/latest/USD');
    if (!response.ok) {
      currencyOutput.innerHTML = '';
      displayError('ExchangeRate', response.status, currencyOutput);
      return;
    }
    const data = await response.json();
    console.log(data)
    
    // Clear loading and display USD to EUR exchange rate with styled formatting
    currencyOutput.innerHTML = '';
    let currencyResponse = document.createElement('div');
    currencyResponse.id = 'currency-response';
    currencyResponse.innerHTML = `<h1><span class='red-text'>U</span><span class='white-text'>S</span><span class='blue-text'>D</span> - <span class='blue-text'>E</span><span class='gold-text'>U</span><span class='gray-text'>R</span></h1>
    <p>Exchange Rate: 1 USD = ${data.conversion_rates.EUR} EUR</p>`;
    currencyOutput.appendChild(currencyResponse);
  } catch (error) {
    displayError('ExchangeRate', 'Network error', currencyOutput);
  }
}

// Fetches popular movies from The Movie Database (TMDB) API
const getMovies = async () => {
  const movieOutput = document.getElementById('movies-output');
  if (!movieOutput) {
    console.error("Element with id 'movies_output' not found");
    return;
  }
  
  showLoading(movieOutput); // Show loading spinner
  
  try {
    // Step 1: Fetch popular movies data
    let url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
    let options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2IyNzcwZjQxZmJkZTljYzIxN2I3NzNhZTNkMGRlMSIsIm5iZiI6MTc1NDQxODU4NS42NjgsInN1YiI6IjY4OTI0ZDk5ZWU0NGViYzU1Nzk5MTY2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Rc6B-O88ysF_y51HpMtqTJLlVmr6_BAkHEAA0Sp3JJA'
      }};
    let response = await fetch(url, options) 
    if (!response.ok) {
      displayError("TMDB", response.status, movieOutput);
      return;
    }
    let data = await response.json();
    const movies = data.results; // Extract movies array
    console.log(movies);
    
    // Step 2: Fetch genre list to map genre IDs to names
    url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
    response = await fetch(url, options);
    if (!response.ok) {
        displayError("TMDB", response.status, movieOutput)
        return
    }
    data = await response.json();
    // Create a genres lookup object for quick ID-to-name conversion
    const genres = {};
    data.genres.forEach((genre) => {
      genres[genre.id] =  genre.name;
    });
    console.log(genres)
    
    // Step 3: Create and display movie information
    movieOutput.innerHTML = '';
    const moviesInfo = document.createElement('div');
    moviesInfo.className = 'movies-info';
    moviesInfo.innerHTML = `<h3>Movies Currently Popular:</h3>`;
    const moviesList = document.createElement('ol');
    // Loop through each movie and create display elements
    movies.forEach((movie) => {
      // Map genre IDs to genre names for each movie
      const movieGenres = movie.genre_ids.map((genre) => {
        return genres[genre];
      });
      console.log(movieGenres)
      // Create detailed movie information HTML
      const movieDetails = `<p><b>${movie.title}</b></p>
                            <img src="${'https://image.tmdb.org/t/p/w300' + movie.poster_path}" alt="${movie.title} Poster">
                            <p>Released: ${movie.release_date.split('-').join('/')}</p>
                            <p>Genres: ${movieGenres.join(', ')}</p>
                            <p>${movie.overview}</p>
                            <p>Popularity: ${movie.popularity}</p>
                            <p>Avg Votes: ${movie.vote_average} with ${movie.vote_count} votes</p>`
      const movieItem = document.createElement('li')
      movieItem.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`; // Set backdrop image
      movieItem.innerHTML = movieDetails;
      moviesList.appendChild(movieItem);
      });
      moviesInfo.appendChild(moviesList);
      movieOutput.appendChild(moviesInfo);
  } catch (error) {
    displayError('TMDB', 'Network error', movieOutput);
  }
}

// Fetches GitHub user profile information using GitHub API
const getGitHubUser = async () => {
  let userName = '';
  const GitHubAPIURI = "https://api.github.com/users/";
  const gitHubOutput = document.getElementById("github-output");
  
  // Handle username input changes
  const handleUserNameInput = (e) => {
    userName = e.target.value;
  }
  
  // Fetch and display GitHub user profile data
  const getUserProfile = async () => {
    if (!userName.trim()) {
      profileDiv.innerHTML = '<p class="error-message">Please enter a username</p>';
      return;
    }
    
    showLoading(profileDiv); // Show loading spinner
    
    try {
      // Make API call to GitHub users endpoint
      const response = await fetch(GitHubAPIURI + userName);
      if (!response.ok) {
        displayError("GitHub", response.status, profileDiv);
        return;
      }
      const data = await response.json();
      // Display comprehensive user profile information
      profileDiv.innerHTML = `<img src="${data.avatar_url}" alt="${data.login}'s avatar" width="150">
                              <h2>${data.login}</h2>
                              <p>${data.bio || "No bio available"}</p>
                              <a href="${data.html_url}" target="_blank">View Profile on GitHub</a>
                              <p><strong>Name:</strong> ${data.name || "No name available"}</p>
                              <p><strong>Email:</strong> ${data.email || "No email available"}</p>
                              <p><strong>Public Repos:</strong> ${data.public_repos || 0}</p>
                              <p><strong>Public Gists:</strong> ${data.public_gists || 0}</p>
                              <p><strong>Followers:</strong> ${data.followers || 0}</p>
                              <p><strong>Following:</strong> ${data.following || 0}</p>`;
    } catch (error) {
      displayError('GitHub', 'Network error', profileDiv);
    }
  }
  
  // Create input form for GitHub username entry (if not already exists)
  if(!document.getElementById("github-input")) {
    const githubInputDiv = document.createElement('div');
    githubInputDiv.id = "github-input";
    
    const uNameLabel = document.createElement('label');
    uNameLabel.setAttribute('for', "github-input-field");
    uNameLabel.textContent = "Username to lookup:";
    
    const userNameInput = document.createElement('input');
    userNameInput.className = "github-input-field";
    userNameInput.id = "github-input-field";
    userNameInput.setAttribute('name', "github-input");
    userNameInput.setAttribute('type', 'text');
    userNameInput.setAttribute('placeholder', 'Enter GitHub username');
    userNameInput.addEventListener("input", handleUserNameInput);
    
    const submitUserNameBtn = document.createElement('button');
    submitUserNameBtn.id = "gh-submit-btn"
    submitUserNameBtn.setAttribute('type', "button");
    submitUserNameBtn.innerHTML = "&#128269;"; // Search icon
    submitUserNameBtn.addEventListener("click", getUserProfile);
    
    githubInputDiv.appendChild(uNameLabel);
    githubInputDiv.appendChild(userNameInput);
    githubInputDiv.appendChild(submitUserNameBtn);
    gitHubOutput.appendChild(githubInputDiv);
  }
  
  // Initialize or get profile display div
  let profileDiv = document.getElementById('profile-div')
  if(!profileDiv) {
    profileDiv = document.createElement('div');
    profileDiv.id = 'profile-div';
    gitHubOutput.appendChild(profileDiv);
  }
}

// Fetches random jokes from JokeAPI with content filtering
const getJoke = async () => {
  const jokeOutput = document.getElementById('joke-output');
  showLoading(jokeOutput); // Show loading spinner
  
  try {
    // Fetch joke with blacklist filters for inappropriate content
    const response = await fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
    if (!response.ok) {
      displayError('Joke', response.status, jokeOutput);
      return
    }
    
    const data = await response.json();
    console.log(data);
    jokeOutput.innerHTML = "";
    
    // Check if API returned a valid joke (no error)
    if (!data.error) {
      let jokeElement = document.createElement('div');
      jokeElement.id = "joke-div"
      
      // Handle single-part jokes
      if (data.type === 'single'){
       jokeElement.innerHTML = `<h3>A ${data.category} joke for you:</h3>
       <p class='joke'>${data.joke}</p>`
      } 
      // Handle two-part jokes (setup + delivery)
      else if (data.type === 'twopart'){
        jokeElement.innerHTML = `<h3>A ${data.category} joke for you:</h3>
        <p><b>${data.setup}</b></p>
        <p>${data.delivery}</p>`
      }
      jokeOutput.appendChild(jokeElement);
    } else {
      // Handle API errors with detailed error information
      console.log(`ERROR: ${data.internalError ? 'Internal Error:' : ''} ${data.message}, Possible Cause: ${data.causedBy.join(', ')}; Additional Information: ${data.additionalInfo}`)
      const errorElement = document.createElement('div');
      errorElement.className = "error-message";
      errorElement.innerHTML = `<h3>JokeAPI ERROR: ${data.internalError ? 'Internal ERROR:' : ''}</h3>
      <p>${data.message}</p>
      <p>Possible Causes: ${data.causedBy.join(', ')}</p>
      <p>Additional Information: ${data.additionalInfo}</p>`
      jokeOutput.appendChild(errorElement);
    }
  } catch (error) {
    displayError('Joke', 'Network error', jokeOutput);
  }
}

// Validates phone numbers using NumVerify API service
const getPublicApiInfo = async () => {
  const publicAPIOutput = document.getElementById('publicapi-output');
  
  // Handle form submission and phone number validation
  const submitNumber = async (e) => {
    e.preventDefault();
    const phoneNumber = document.getElementById('numverify-phone').value;
    
    // Validate input before making API call
    if (!phoneNumber.trim()) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = 'Please enter a phone number';
      publicAPIOutput.appendChild(errorDiv);
      return;
    }
    
    // Create or get results display div
    const resultsDiv = document.getElementById('numverify-results') || (() => {
      const div = document.createElement('div');
      div.id = 'numverify-results';
      publicAPIOutput.appendChild(div);
      return div;
    })();
    
    showLoading(resultsDiv); // Show loading spinner
    console.log(`Verifying phone number: ${phoneNumber}`);
    
    try {
      // Make API call to NumVerify service with access key
      const accessKey = "d626a3de522e81b6cf9733f77538ee26";
      const response = await fetch(`https://apilayer.net/api/validate?access_key=${accessKey}&number=${phoneNumber}`);
      if(!response.ok) {
        displayError('NumVerify', response.status, resultsDiv);
        return;
      }
      const data = await response.json();
      console.log(data);
      
      // Clear loading and create styled results display
      resultsDiv.innerHTML = '';
      const numverifyOutput = document.createElement('div');
      numverifyOutput.style.padding = '1rem';
      numverifyOutput.style.backgroundColor = '#f8f9fa';
      numverifyOutput.style.borderRadius = '8px';
      numverifyOutput.style.marginTop = '0.5rem';
      
      // Check if API returned an error
      if (!data.error) {
        if (data.valid) {
        // Display detailed information for valid numbers
        numverifyOutput.innerHTML = `<h4 style="color: #28a745; margin-bottom: 0.5rem;">✓ Valid Phone Number</h4>
                                     <p><strong>Number:</strong> ${data.local_format}</p>
                                     <p><strong>Carrier:</strong> ${data.carrier}</p>
                                     <p><strong>Line Type:</strong> ${data.line_type}</p>
                                     <p><strong>Location:</strong> ${data.location}</p>
                                     <p><strong>Country:</strong> ${data.country_name}</p>`;
        } else {
          // Display invalid number message
          numverifyOutput.innerHTML = `<h4 style="color: #dc3545; margin-bottom: 0.5rem;">✗ Invalid Phone Number</h4>
                                       <p>Phone number ${data.local_format} is invalid.</p>`;
        }
      } else {
        // Display API error information
        numverifyOutput.innerHTML = `<div class="error-message">
                                     <h4>NumVerify API ERROR: ${data.error.code}</h4>
                                     <p><strong>${data.error.type}:</strong></p>
                                     <p>${data.error.info}</p>
                                     </div>`;
      }
      resultsDiv.appendChild(numverifyOutput);
    } catch (error) {
      displayError('NumVerify', 'Network error', resultsDiv);
    }
  }
  
  // Create phone number input form (if not already exists)
  if (!document.getElementById('numverify-input')) {
    const numVerifyInput = document.createElement('form');
    numVerifyInput.id = "numverify-input";
    numVerifyInput.innerHTML = `<label for='numverify-phone'>Phone Number:</label>
    <input type='tel' id='numverify-phone' name='numverify-phone' placeholder='Enter phone number (e.g., +1234567890)' pattern='^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$'>
    <button type='submit' id='numverify-submit'>Verify Number</button>`;
    numVerifyInput.addEventListener('submit', submitNumber);
    publicAPIOutput.appendChild(numVerifyInput);
  }
}