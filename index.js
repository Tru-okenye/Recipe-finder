const apiKey = "f5d2d628da624b1d85ef97f930d211ba";
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
     const query = searchInput.value.trim();

     if(query !=="") {
        fetchRecipes(query);
     }
});

function fetchRecipes(query) {
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=10`;
    fetch(url).then((response)=>response.json()).then((data)=>{
        displayRecipes(data.results);
    }).catch((error)=>{

        console.error("error fetching data", error)
    }) 
}

function displayRecipes(recipes) {
    let output = "";
    recipes.forEach((recipe) => {
        const recipeCard = `
        <div class="col-md-4 mb-4"> 
            <div class="card">
                <img src="${recipe.image}" alt="recipe image" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <button class="btn btn-primary view-recipe-btn"
                        data-id="${recipe.id}" data-bs-toggle="modal" data-bs-target="#recipeModal">View Recipe</button>
                </div>
            </div>
        </div>`;
        output += recipeCard;
    });
    resultsContainer.innerHTML = output;
}

// Event delegation for 'View Recipe' buttons
resultsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('view-recipe-btn')) {
        const recipeId = event.target.dataset.id;
        fetchRecipeDetails(recipeId);
    }
});


function fetchRecipeDetails(recipeId){
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    fetch(url)
    .then((response)=>response.json())
    .then((data)=> {
        displayRecipeDetails(data)
    })
    .catch((error) => {
        console.error("error fetching recipe details", error);
    })
}
function displayRecipeDetails(recipe){
const recipeModalBody = document.getElementById("recipeModalBody");

const recipeDetails = `

<h3>${recipe.title}</h3>
<img src="${recipe.image}" alt="recipe image" class="img-fluid mb-3">
<h5>Ingredients: </h5>
<ul>${recipe.extendedIngredients.map((ingredient) => `<li>${ingredient.original}</li>`)
.join("")
}
</ul>
<h5>Instructions: </h5>
<p>${recipe.instructions || "instructions not available"}</p>

`;
recipeModalBody.innerHTML = recipeDetails;
}

// // Listen for modal close event and clear modal content
// $('#recipeModal').on('hidden.bs.modal', function (e) {
//     const recipeModalBody = document.getElementById("recipeModalBody");
//     recipeModalBody.innerHTML = ''; // Clear modal content
// });
