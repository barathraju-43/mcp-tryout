# URL Shortener Service

A modern, efficient URL shortener service built with Node.js, Express, and MongoDB.

## Features

- Shorten long URLs to compact, shareable links
- Custom URL slugs (optional)
- Click tracking and analytics
- API rate limiting
- Expiration dates for links
- QR code generation for shortened URLs

## Tech Stack

- Node.js & Express.js
- MongoDB for data persistence
- Redis for caching
- Docker support
- Jest for testing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis (optional, for caching)
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/barathraju-43/mcp-tryout.git
cd mcp-tryout
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Start the service:
```bash
npm run dev
```

### Docker Setup

```bash
docker-compose up -d
```

## API Endpoints

### Shorten URL
```http
POST /api/shorten
Content-Type: application/json

{
  "originalUrl": "https://very-long-url.com/with/many/parameters",
  "customSlug": "mylink" (optional)
}
```

### Get URL Analytics
```http
GET /api/analytics/:shortCode
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT