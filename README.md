 CS480 API Project - CRUD Operations and Database Integration

This project is an API built using Node.js, Express, MongoDB, and MySQL. It demonstrates CRUD operations, integration with relational and NoSQL databases, and includes a variety of endpoints to handle different queries.

---

 Project Structure

 Files and Their Purpose

1. index.js:
   - The main file of the project that initializes the Express server.
   - Connects to both MongoDB and MySQL databases.
   - Implements all API endpoints for managing resources like `colors`, `actors`, `films`, `customers`, and more.
   - Handles error scenarios, supports query parameters, and integrates stored procedures.

   Key Features in `index.js`:
   - MongoDB Operations: CRUD functionality for the `colors` collection.
   - MySQL Operations: Retrieve, update, and query data from the Sakila database.
   - Stored Procedures: Executes stored procedures such as `film_in_stock`.
   - Edge Case Handling: Ensures consistent responses, even for empty datasets.

2. package.json:
   - Manages project dependencies and metadata.
   - Ensures the required Node.js packages are installed for the project to run.

   Dependencies in `package.json`:
   - express: For building the API server.
   - cors: To handle Cross-Origin Resource Sharing.
   - mongodb: For connecting to MongoDB and performing database operations.
   - mysql2: For connecting to MySQL and executing queries.

---

 How to Run the Project

 Prerequisites
1. Install [Node.js](https://nodejs.org/).
2. Have access to:
   - A MongoDB database (e.g., via MongoDB Atlas - https://www.mongodb.com/products/platform/atlas-database ).
   - A MySQL database (e.g., MySQL Workbench with the Sakila schema).
3. Replit - https://replit.com/
