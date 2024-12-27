const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoUri = "mongodb+srv://MongAPI:Password1111@project.n3wri.mongodb.net/?retryWrites=true&w=majority&appName=Project"; // Update: to be discussed in TA Hr -- as confused abt this step
const mongoClient = new MongoClient(mongoUri);

async function connectMongoDB() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectMongoDB();

// MySQL Connection
const mysqlConnection = mysql.createConnection({
  host: '34.57.160.216',
  user: 'APIServer',
  password: 'Password1111',
  database: 'sakila'
});

mysqlConnection.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



//*********************************************************************************/
// Get all colors
app.get('/api/v1/colors', async (req, res) => {
    try {
      const db = mongoClient.db('cs480-project2');
      const colors = await db.collection('colors').find().toArray();
      res.status(200).json(colors);
    } catch (err) {
      res.status(500).json(["An error has occurred."]);
    }
  });

  // Add a new color
  app.post('/api/v1/colors', async (req, res) => {
    try {
      const db = mongoClient.db('cs480-project2');
      const result = await db.collection('colors').insertOne(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json(["An error has occurred."]);
    }
  });

  const { ObjectId } = require('mongodb');

  // Get a specific color
  app.get('/api/v1/colors/:id', async (req, res) => {
    try {
      const db = mongoClient.db('cs480-project2');
      const color = await db.collection('colors').findOne({ _id: new ObjectId(req.params.id) });
      if (!color) {
        res.status(404).json([]);
      } else {
        res.status(200).json(color);
      }
    } catch (err) {
      res.status(500).json(["An error has occurred."]);
    }
  });

  // Update a specific color
  app.put('/api/v1/colors/:id', async (req, res) => {
    try {
      const db = mongoClient.db('cs480-project2');
      const result = await db.collection('colors').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(["An error has occurred."]);
    }
  });

  // Delete a specific color
  app.delete('/api/v1/colors/:id', async (req, res) => {
    try {
      const db = mongoClient.db('cs480-project2');
      const result = await db.collection('colors').deleteOne({ _id: new ObjectId(req.params.id) });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(["An error has occurred."]);
    }
  });


// For SQL Workbench

//1
app.get('/api/v1/actors', (req, res) => {
  mysqlConnection.query('SELECT * FROM actor', (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Return all actors as an array
  });
});

app.get('/api/v1/films', (req, res) => {
  const searchQuery = req.query.query;

  // If a query parameter exists, perform a case-insensitive search
  const sqlQuery = searchQuery
    ? 'SELECT * FROM film WHERE LOWER(title) LIKE ?'
    : 'SELECT * FROM film';

  const queryParams = searchQuery ? [`%${searchQuery.toLowerCase()}%`] : [];

  mysqlConnection.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]); // Handle SQL errors
      return;
    }
    res.status(200).json(results); // Return all matching films as an array
  });
});

app.get('/api/v1/customers', (req, res) => {
  mysqlConnection.query('SELECT * FROM customer', (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Return all customers as an array
  });
});

app.get('/api/v1/stores', (req, res) => {
  mysqlConnection.query('SELECT * FROM store', (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Return all stores as an array
  });
});


//2

app.get('/api/v1/actors/:id', (req, res) => {
  const actorId = req.params.id; // Extract the actor ID from the route parameter
  mysqlConnection.query('SELECT * FROM actor WHERE actor_id = ?', [actorId], (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Always return the result as an array
  });
});

app.get('/api/v1/films/:id', (req, res) => {
  const filmId = req.params.id; // Extract the film ID from the route parameter
  mysqlConnection.query('SELECT * FROM film WHERE film_id = ?', [filmId], (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Always return the result as an array
  });
});

app.get('/api/v1/stores/:id', (req, res) => {
  const storeId = req.params.id; // Extract the store ID from the route parameter
  mysqlConnection.query('SELECT * FROM store WHERE store_id = ?', [storeId], (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Always return the result as an array
  });
});

app.get('/api/v1/customers/:id', (req, res) => {
  const customerId = req.params.id; // Extract the customer ID from the route parameter
  mysqlConnection.query('SELECT * FROM customer WHERE customer_id = ?', [customerId], (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Always return the result as an array
  });
});


//3

app.get('/api/v1/actors/:id/films', (req, res) => {
  const actorId = req.params.id;

  const sqlQuery = `
    SELECT film.* 
    FROM film 
    JOIN film_actor ON film.film_id = film_actor.film_id
    WHERE film_actor.actor_id = ?`;

  mysqlConnection.query(sqlQuery, [actorId], (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Return all films for the actor as an array
  });
});


//4
app.get('/api/v1/films/:id/actors', (req, res) => {
  const filmId = req.params.id;

  const sqlQuery = `
    SELECT actor.* 
    FROM actor 
    JOIN film_actor ON actor.actor_id = film_actor.actor_id
    WHERE film_actor.film_id = ?`;

  mysqlConnection.query(sqlQuery, [filmId], (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Return all actors for the film as an array
  });
});



//5
app.get('/api/v1/films/:id/detail', (req, res) => {
  const filmId = req.params.id; // Extract the film ID from the route parameter
  mysqlConnection.query('SELECT * FROM film_list WHERE FID = ?', [filmId], (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Always return the result as an array
  });
});

//6
app.get('/api/v1/customers/:id/detail', (req, res) => {
  const customerId = req.params.id; // Extract the customer ID from the route parameter
  mysqlConnection.query('SELECT * FROM customer_list WHERE ID = ?', [customerId], (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Always return the result as an array
  });
});


//7
app.get('/api/v1/actors/:id/detail', (req, res) => {
  const actorId = req.params.id; // Extract the actor ID from the route parameter
  mysqlConnection.query('SELECT * FROM actor_info WHERE actor_id = ?', [actorId], (err, results) => {
    if (err) {
      res.status(500).json(["An error has occurred."]);
      return;
    }
    res.status(200).json(results); // Always return the result as an array
  });
});

//8
app.get('/api/v1/inventory-in-stock/:film_id/:store_id', (req, res) => {
  const { film_id, store_id } = req.params;

  // Log parameters for debugging
  console.log("Fetching inventory for film_id:", film_id, "and store_id:", store_id);

  const sqlQuery = 'CALL film_in_stock(?, ?, @film_count)';

  // Execute the stored procedure
  mysqlConnection.query(sqlQuery, [film_id, store_id], (err, results) => {
    if (err) {
      console.error("SQL error for /inventory-in-stock:", err.message); // Log SQL error
      res.status(500).json(["An error has occurred."]);
      return;
    }

    // Check if the result set is empty
    if (!results[0] || results[0].length === 0) {
      console.log("No inventory found for the provided film_id and store_id.");
      res.status(200).json([]); // Return an empty array if no results are found
      return;
    }

    // Return the inventory IDs as an array
    res.status(200).json(results[0]);
  });
});


//9
app.get('/api/v1/movies', async (req, res) => {
  try {
    const db = mongoClient.db('sample_mflix');
    const collection = db.collection('movies');

    // Build filter based on query parameters
    const filter = {};
    if (req.query.genre) filter.genre = req.query.genre;
    if (req.query.year) filter.year = parseInt(req.query.year); // Ensure the year is an integer
    if (req.query.director) filter.director = req.query.director;

    // Query the collection with a limit of 10 documents
    const movies = await collection.find(filter).limit(10).toArray();

    res.status(200).json(movies); // Return the movies as an array
  } catch (err) {
    res.status(500).json(["An error has occurred."]); // Handle MongoDB errors
  }
});