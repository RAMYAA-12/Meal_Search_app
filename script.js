async function searchMeal() {
    console.log("searchMeal called");
    
    const mealName = document.getElementById("mealName").value.trim();
    const mealDetails = document.getElementById("mealDetails");

    if (!mealName) {
        mealDetails.innerHTML = "<p>Please enter a meal name.</p>";
        return;
    }

    try {
        console.log("Calling backend...");
        const res = await fetch(`http://localhost:5000/api/meal?name=${mealName}`);
        const data = await res.json();

        console.log("Backend Response:", data);
        displayMeal(data.meal);
    } catch (err) {
        mealDetails.innerHTML = "<p>Error fetching meal. Check backend.</p>";
        console.error(err);
    }
}

function displayMeal(meal) {
    console.log("Displaying meal:", meal);

    const mealContainer = document.getElementById("mealDetails");

    if (!meal) {
        mealContainer.innerHTML = "<p>No meal found.</p>";
        return;
    }

    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            ingredients += `<li>${ingredient} - ${measure}</li>`;
        }
    }

    mealContainer.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>

        <h3>Ingredients:</h3>
        <ul>${ingredients}</ul>

        <h3>Instructions:</h3>
        <p>${meal.strInstructions.substring(0, 400)}...</p>
    `;
}
