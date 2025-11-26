# CT_DashConnect

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

A modern, interactive API dashboard that demonstrates real-time data integration from multiple public APIs. This single-page application features a responsive grid layout where each cell functions as an independent mini-application, fetching and displaying data from different real-world API services.

## 🚀 Features

- **Random Dog Images** - Fetches random dog photos from Dog CEO API
- **Random Cat Images** - Displays random cat images from The Cat API
- **Weather Information** - Real-time weather data with geocoding support via Open-Meteo API
- **Currency Exchange Rates** - Live USD to EUR conversion rates from ExchangeRate-API
- **Trending Movies** - Popular movies with detailed information from TMDB API
- **GitHub User Profiles** - Search and display GitHub user information
- **Random Jokes** - Clean, filtered jokes from JokeAPI
- **Phone Number Validation** - Verify phone numbers using NumVerify API

## 🎯 Demo

The application provides an intuitive interface with individual action buttons for each API service. Each mini-app includes error handling, loading indicators, and responsive design for optimal user experience across devices.

## 📋 Prerequisites

Before running this project, ensure you have:

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection for API requests
- Basic understanding of HTML, CSS, and JavaScript (for customization)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MArney86/CT_DashConnect.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd CT_DashConnect
   ```

3. **Open in your browser**

   - Simply open `index.html` in your preferred web browser
   - Or use a local development server:

     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server
     ```

## 💻 Usage

### Basic Operation

1. Open the application in your web browser
2. Click any "Get [Data]" button to fetch data from the corresponding API
3. View the results displayed in each grid cell

### Specific Features

#### Weather Search

- Enter a city name and state
- Click the search button (🔍)
- View detailed weather information including temperature, conditions, and wind data

#### GitHub User Lookup

- Enter a GitHub username
- Click search to view profile information, repositories, and follower counts

#### Phone Number Validation

- Enter a phone number (e.g., +1234567890)
- Click "Verify Number" to validate and get carrier information

## 📁 Project Structure

```text
CT_DashConnect/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # API integration and functionality
└── README.md           # Project documentation
```

## 🔌 API Integration

This project integrates with the following APIs:

| API Service | Purpose | Authentication Required |
|-------------|---------|------------------------|
| [Dog CEO API](https://dog.ceo/dog-api/) | Random dog images | No |
| [The Cat API](https://thecatapi.com/) | Random cat images | No |
| [Open-Meteo](https://open-meteo.com/) | Weather & geocoding | No |
| [ExchangeRate-API](https://www.exchangerate-api.com/) | Currency conversion | API Key (included) |
| [TMDB](https://www.themoviedb.org/) | Movie information | API Key (included) |
| [GitHub API](https://docs.github.com/en/rest) | User profiles | No |
| [JokeAPI](https://jokeapi.dev/) | Random jokes | No |
| [NumVerify](https://numverify.com/) | Phone validation | API Key (included) |

> **Note:** API keys are included in the source code for educational purposes. For production use, implement proper environment variable management and secure key storage.

## 🎨 Features Breakdown

### Error Handling

- Comprehensive error handling for network failures
- HTTP status code validation
- User-friendly error messages

### Loading States

- Animated loading spinners during API requests
- Smooth transitions between states

### Responsive Design

- Grid layout adapts to different screen sizes
- Mobile-friendly interface
- Consistent styling across all components

## 🔧 Customization

### Adding New APIs

1. Add a new grid item in `index.html`:

   ```html
   <section class="grid-item" id="your-api">
     <h2>📌 Your API Title</h2>
     <button onclick="yourFunction()">Get Data</button>
     <div class="output" id="your-output"></div>
   </section>
   ```

2. Implement the function in `script.js`:

   ```javascript
   const yourFunction = async () => {
     const output = document.getElementById("your-output");
     showLoading(output);
     try {
       const response = await fetch("YOUR_API_URL");
       const data = await response.json();
       // Display your data
     } catch (error) {
       displayError('YourAPI', error, output);
     }
   }
   ```

3. Style in `styles.css` as needed

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

### MArney86

- GitHub: [@MArney86](https://github.com/MArney86)

## 🙏 Acknowledgments

- Dog CEO API for providing free dog images
- The Cat API for cat image access
- Open-Meteo for weather data services
- TMDB for movie database access
- All other API providers for their excellent free services

## 📧 Contact

For questions or support, please open an issue in the GitHub repository.

---

**Last Updated:** November 26, 2025
