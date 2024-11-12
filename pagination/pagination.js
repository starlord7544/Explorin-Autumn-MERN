const container = document.querySelector('.page-container');
const content = document.querySelector('.content');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');

let recipesArray = [];
let page = 1;
let pages = [];
let pageSize = 4;
let totalDataCount = 0;
let totalPageCount = 0;


async function fetchData() {
    try {
        const res = await fetch("https://dummyjson.com/recipes?limit=1000")
        const data = await res.json();
        setDetails(data);
    }
    catch (err) {
        console.log("Error : ", err);
    }

}

function setDetails(data) {
    recipesArray = data.recipes;
    totalDataCount = recipesArray.length;
    totalPageCount = Math.ceil(totalDataCount / pageSize);
    showData();
    addPagination();
}

function showData(data) {
    content.innerHTML = "";
    const recipes = data ? data : recipesArray;
    console.log(recipes);
    const newData = recipes.slice((page - 1) * pageSize, page * pageSize)
    pushCards(newData);
    updateActive();
    updateTruncation();
}

function pushCards(data) {
    data.forEach(item => {
        const newCard = document.createElement('div');
        newCard.classList.add('card');

        const name = `<h2>${item.name}</h2>`;
        const image = `<img src="${item.image}" alt="${item.name}" class="card-image">`;
        const ingredients = `<p><strong>Ingredients:</strong> ${item.ingredients.join(", ")}</p>`;
        const instructions = `<p><strong>Instructions:</strong> ${item.instructions.join(" ")}</p>`;
        const metaData = `
            <p><strong>Prep Time:</strong> ${item.prepTimeMinutes} minutes</p>
            <p><strong>Cook Time:</strong> ${item.cookTimeMinutes} minutes</p>
            <p><strong>Servings:</strong> ${item.servings}</p>
            <p><strong>Difficulty:</strong> ${item.difficulty}</p>
            <p><strong>Cuisine:</strong> ${item.cuisine}</p>
            <p><strong>Calories per Serving:</strong> ${item.caloriesPerServing}</p>
        `;
        const rating = `
            <p><strong>Rating:</strong> ${item.rating} (${item.reviewCount} reviews)</p>
        `;
        const tags = `<p><strong>Tags:</strong> ${item.tags.join(", ")}</p>`;
        const mealType = `<p><strong>Meal Type:</strong> ${item.mealType.join(", ")}</p>`;

        newCard.innerHTML = `${image} ${name} ${ingredients} ${instructions} ${metaData} ${rating} ${tags} ${mealType}`;

        content.appendChild(newCard);
    });
}


function addPagination() {
    for (let i = 1; i <= totalPageCount; i++) {
        const newPage = document.createElement('button');
        newPage.classList.add('btn');
        newPage.innerHTML = i;
        container.appendChild(newPage);
        pages = [...pages, newPage];
    }
    addEventListeners();
    updateActive();
    updateTruncation();
}

function addEventListeners() {
    pages.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            page = Number(btn.innerHTML);
            showData();
        });
    });
    prev.addEventListener("click", (e) => {
        if (page > 1)
            page--;
        showData();
    })
    next.addEventListener("click", (e) => {
        if (page < totalPageCount)
            page++;
        showData();
    })
}

function updateActive() {
    if (pages.length > 0) {
        pages.forEach((btn) => {
            if (page === Number(btn.innerText))
                btn.classList.add('active');
            else
                btn.classList.remove('active');
        });
    }
}

function updateTruncation() {
    // let truncate 
    pages.forEach(btn => {
        let num = Number(btn.innerText);
        let shouldTruncate = 
            (num>2) && 
            (num< page-1 || num>page+1) && 
            (num<totalPageCount-1);
        let shouldNotTruncate=
            ((page<5 && num<=5 ) || 
            (page > totalPageCount-4 && num>=totalPageCount-4));
        
        if(page>4) pages[1].classList.add("truncated");
        else pages[1].classList.remove("truncated");

        if(page<totalPageCount-3) pages[totalPageCount-2].classList.add("truncated");
        else pages[totalPageCount-2].classList.remove("truncated");

        if (shouldTruncate && !shouldNotTruncate)
            btn.style.display = "none";
        else
            btn.style.display = "block";
    });
}

function runApp() {
    fetchData();
    updateActive();
}

runApp();
