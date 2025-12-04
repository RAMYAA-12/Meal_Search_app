const express = require("express");
const axios = require("axios");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/meal", async (req, res) => {
  const mealName = req.query.name;

  try {
    const result = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    );

    if (!result.data.meals) {
      return res.json({ message: "No meals found" });
    }

    const meals = result.data.meals;
    let leastMeal = null;
    let minCount = Infinity;

    meals.forEach(meal => {
      let count = 0;

      for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
          count++;
        }
      }

      if (count < minCount) {
        minCount = count;
        leastMeal = meal;
      }
    });

    res.json({ meal: leastMeal, ingredientCount: minCount });

  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.post("/api/favorite", (req, res) => {
  const { idMeal, strMeal } = req.body;

  db.run(
    "INSERT INTO favorites (idMeal, name) VALUES (?, ?)",
    [idMeal, strMeal],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Favorite added!" });
    }
  );
});

app.get("/api/favorite", (req, res) => {
  db.all("SELECT * FROM favorites", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
