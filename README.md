# BlogApp Backend
For Frontend :https://github.com/sattvikdwivedi/BlogApp

This is the backend service for the BlogApp project. It provides APIs for managing blog posts, user authentication, and other related functionalities.

## Features



- User authentication and authorization
- CRUD operations for blog posts
- Commenting system
- RESTful API design

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/BlogApp-Backend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd BlogApp-Backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Usage

1. Create a `.env` file in the root directory and configure the following variables:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

2. Start the development server:
    ```bash
    npm run dev
    ```

3. Access the API at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /api/posts       | Get all blog posts       |
| POST   | /api/posts       | Create a new blog post   |
| PUT    | /api/posts/:id   | Update a blog post       |
| DELETE | /api/posts/:id   | Delete a blog post       |

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.