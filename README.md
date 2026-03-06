# Niche Finder Pro

A comprehensive web application for discovering profitable niches and finding decision maker contacts. This MVP helps entrepreneurs, marketers, and sales teams identify market opportunities and connect with key decision makers.

## Features

### 🎯 Niche Discovery
- **Market Trend Analysis**: Identify growing niches with trend scoring
- **Niche Scoring System**: Comprehensive scoring based on trend, competition, and profitability
- **Search & Filter**: Filter niches by category, keywords, and criteria
- **Niche Categories**: Technology, Eco-Friendly, Business, Food & Beverage, Healthcare, Automotive, Fintech

### 👥 Decision Maker Finder
- **Company Research**: Identify key companies in selected niches
- **Contact Information**: Extract email, phone, job titles, and LinkedIn profiles
- **Role-Based Filtering**: Filter by job titles (CEO, CMO, VP, etc.)
- **Export Functionality**: Export contact lists to CSV format

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with real-time search
- **Interactive Dashboard**: Visual niche scoring and contact management
- **Breadcrumb Navigation**: Easy navigation between niches and contacts

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and build
- **Tailwind CSS** for modern styling
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **SQLite** for data persistence
- **Puppeteer** for web scraping capabilities
- **Axios** for API requests

### Development Tools
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality
- **Hot Reload** for fast development

## Project Structure

```
niche-finder-app/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # UI components
│   │   │   ├── NicheList.tsx
│   │   │   ├── ContactList.tsx
│   │   │   └── App.tsx
│   │   ├── services/   # API calls
│   │   │   └── api.ts
│   │   ├── styles/     # Global styles
│   │   └── utils/      # Utility functions
│   ├── public/
│   └── package.json
├── backend/            # Node.js API
│   ├── routes/         # API endpoints
│   │   ├── nicheRoutes.js
│   │   └── contactRoutes.js
│   ├── services/       # Business logic
│   │   ├── nicheService.js
│   │   └── contactService.js
│   ├── utils/          # Helper functions
│   │   └── database.js
│   ├── database/       # Database files
│   │   └── init.sql
│   ├── server.js
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd niche-finder-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../backend
   npm start
   ```
   Backend will run on `http://localhost:3001`

5. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## Usage

### Finding Niches
1. Open the application in your browser
2. Use the search bar to find niches by keyword
3. Filter by category using the dropdown
4. Click on any niche card to view detailed information
5. See companies and contacts associated with the niche

### Finding Decision Makers
1. Select a niche to view associated companies
2. Click on company names to view their decision makers
3. Use filters to narrow down by department or seniority level
4. Export contact lists to CSV for further use

### Search Features
- **Niche Search**: Search by niche name, description, or category
- **Contact Search**: Search by name, job title, company, or department
- **Real-time Filtering**: Instant results as you type
- **Export Options**: Download contact lists as CSV files

## API Endpoints

### Niche Endpoints
- `GET /api/niches` - Get all niches with scores
- `GET /api/niches/search?q=&category=` - Search niches
- `GET /api/niches/:name` - Get niche details
- `POST /api/niches/save` - Save a niche
- `GET /api/niches/saved` - Get saved niches

### Contact Endpoints
- `GET /api/contacts/niche/:nicheName` - Get contacts for a niche
- `GET /api/contacts/company/:companyName` - Get contacts for a company
- `GET /api/contacts/search?q=&company=&department=&seniority=` - Search contacts
- `POST /api/contacts/save` - Save a contact
- `GET /api/contacts` - Get all contacts

## Data Sources

### Mock Data (MVP)
For the MVP version, the application uses mock data to demonstrate functionality:
- **Niches**: 8 pre-defined niches across different categories
- **Companies**: 5 companies per niche with realistic details
- **Contacts**: 3-7 contacts per company with complete profiles

### Future Data Sources
The application is designed to integrate with real data sources:
- **Google Trends API**: For market interest data
- **LinkedIn API**: For professional data (with proper compliance)
- **Industry databases**: For company information
- **Web scraping**: For additional data collection (with rate limiting)

## Development

### Adding New Niches
1. Update the `getTrendingNiches()` method in `backend/services/nicheService.js`
2. Add new niche objects with the required properties
3. The application will automatically calculate scores and display them

### Adding New Companies
1. Update the `getMockCompanies()` method in `backend/services/contactService.js`
2. Add company objects with name, website, industry, size, location, and founded_year
3. Contacts will be automatically generated for each company

### Customizing the UI
1. Modify components in `frontend/src/components/`
2. Update styles in `frontend/src/index.css`
3. Use Tailwind CSS classes for styling

## Testing

### Backend Testing
The backend includes comprehensive API endpoints that can be tested using:
- **Postman** or **curl** for API testing
- **SQLite Browser** for database inspection

### Frontend Testing
- **Visual Testing**: Navigate through the application to test functionality
- **Responsive Testing**: Test on different screen sizes
- **Integration Testing**: Test frontend-backend communication

## Deployment

### Production Build
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the frontend with the backend:
   ```bash
   cd backend
   npm start
   ```

### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=3001
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

### Phase 2 Features
- **Real Data Integration**: Connect to Google Trends and LinkedIn APIs
- **User Authentication**: Add user accounts and saved searches
- **Advanced Analytics**: Market analysis and trend predictions
- **Bulk Operations**: Import/export large contact lists

### Phase 3 Features
- **AI-Powered Insights**: Machine learning for niche prediction
- **Competitor Analysis**: Compare niches and companies
- **Campaign Management**: Track outreach efforts
- **Integration APIs**: Connect with CRM systems

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

## Disclaimer

This application is designed for legitimate market research and business development purposes. Users must comply with all applicable laws and regulations, including:
- **GDPR** compliance for data handling
- **CAN-SPAM** regulations for email communication
- **LinkedIn Terms of Service** for professional networking
- **Respect for robots.txt** and website scraping policies

The mock data used in this MVP is for demonstration purposes only and does not represent real companies or individuals.