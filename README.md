# URL Shortener Service

> **Note**: This project was created using Mission Control Pane (MCP) GitHub server integration, demonstrating automated repository management and code deployment capabilities.

A modern URL shortening service built with Node.js, Express, and MongoDB. This service allows users to create shortened URLs with optional custom slugs, tracks click analytics, and provides QR codes for easy sharing.

## Features

- Shorten long URLs to manageable links
- Custom slug support for personalized short URLs
- QR code generation for each shortened URL
- Click tracking and analytics
- Modern, responsive web interface
- URL validation and error handling
- Clipboard support for easy URL copying

## Project Structure

```
.
├── src/
│   ├── index.js                 # Application entry point
│   ├── models/
│   │   └── url.model.js        # URL database schema and model
│   ├── routes/
│   │   └── url.routes.js       # API route handlers
│   ├── middleware/
│   │   └── error.middleware.js # Error handling middleware
│   └── utils/
│       └── logger.js           # Logging configuration
├── public/
│   └── index.html              # Frontend UI
├── package.json                # Project dependencies and scripts
└── .env.example               # Example environment variables
```

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Additional Features**:
  - QR Code Generation
  - Click Analytics
  - Custom URL Slugs
  - Error Logging
  - Input Validation

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/barathraju-43/mcp-tryout.git
   cd mcp-tryout
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   BASE_URL=http://localhost:3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/shorten`: Create a shortened URL
  - Body: `{ "originalUrl": "https://example.com", "customSlug": "optional-custom-slug" }`

- `GET /api/:shortCode`: Redirect to original URL

- `GET /api/analytics/:shortCode`: Get URL analytics
  - Returns clicks, creation date, and expiration info

## Environment Variables

| Variable     | Description                | Default               |
|-------------|----------------------------|----------------------|
| PORT        | Server port                | 3000                 |
| MONGODB_URI | MongoDB connection string  | -                    |
| BASE_URL    | Base URL for short links   | http://localhost:3000|

## Contributing

Feel free to open issues and pull requests for any improvements you want to add.

## License

MIT License