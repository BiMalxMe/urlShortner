# ShortURL Project

This project is a simple URL shortener with a backend and frontend.

## Backend

- **Tech Stack:** Node.js, Express, Redis, TypeScript
- **Description:**  
  The backend provides a REST API to shorten URLs and redirect short URLs to their original destinations.  
  - When a user submits a URL to `/shorten`, the backend generates a unique short code using a global Redis counter and a Base62 encoder, then stores the mapping in Redis.
  - When a user visits `/:shorturlid`, the backend looks up the original URL in Redis and redirects the user.
- **Key Features:**
  - Fast and scalable with Redis as the data store.
  - Simple, stateless API.
  - Error handling for missing or invalid URLs.

## Frontend

- **Tech Stack:** Next.js, Tailwind CSS
- **Description:**  
  The frontend provides a user-friendly interface to input URLs and receive shortened links.  
  - Users can enter a long URL and receive a short URL in response.
  - Clean, modern design using Tailwind CSS.
  - Responsive and accessible UI.

## How it works

1. User enters a long URL in the frontend.
2. The frontend sends a POST request to the backend `/shorten` endpoint.
3. The backend returns a short code, which the frontend displays as a short URL.
4. When the short URL is visited, the backend redirects to the original URL.

## Getting Started

See the respective `server/` and `client/` directories for setup instructions.
