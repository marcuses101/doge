const dogSlider = document.getElementById("numberOfDogs");
const dogNumberSpan = document.getElementById("dogNumberDisplay")
const dogURL = "https://dog.ceo/api/breeds/image/random/"
const doggyDiv = document.getElementById("doggy-pics");
const doggyList = doggyDiv.querySelector("ul");
const randomForm = document.querySelector("#randomDogs");
const breedForm = document.querySelector("#dogsByBreed")
const loadGif = document.querySelector("#loading");
const boneNav = document.querySelectorAll(".bone");


function generateImage(url) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.src = url;
        image.addEventListener("load", () => {
            resolve(image)
        })
        image.addEventListener("error", () => {
            reject(false)
        })
    })
}


async function getRandomDogs(num) {
    try {
        if (!parseInt(num)) {
            dogNumberSpan.textContent = "Come on! You must want at least one dog!"
            return
        }
        doggyList.innerHTML = "";
        hideError();
        loadGif.classList.remove("hide")
        let response = await fetch(dogURL + num);
        if (!response.ok) throw new Error(response.statusText)
        let data = await response.json();
        console.log(data); // Assingment requirement 1
        let imgArray = await Promise.all(data.message.map(url => generateImage(url)))
        doggyList.innerHTML = imgArray.map(image => {
            if (image) return `<li>${image.outerHTML}</li>`
        }).join("") + "<li></li>";
        loadGif.classList.add("hide")
        console.log("All dogs present and accounted for")
    }
    catch (error) {
        loadGif.classList.add("hide")
        showError();
        console.log(error)
    }
    
}

async function getDogByBreed(breed){
    try{
        hideError();
        loadGif.classList.remove("hide")
        doggyList.innerHTML = "";
        let response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
        console.log(response);
        if (!response.ok) throw new Error(response.status);
        let data = await response.json();
        let image = await generateImage(data.message);
        doggyList.innerHTML = image.outerHTML
        loadGif.classList.add("hide")
    }
    catch (e) {
        showError();
        loadGif.classList.add("hide")
        console.log(e)
    }
    
}

function showError() {
    document.querySelectorAll(".error").forEach(e => e.classList.remove("hide"))
}

function hideError() {
    document.querySelectorAll(".error").forEach(e => e.classList.add("hide"))
}

//Event Handlers
function handleRandomSubmit(e) {
    e.preventDefault();
    console.log("Getting good boys")
    getRandomDogs(dogSlider.value)
}

function handleSlider(e) {
    let num = parseInt(this.value);
    dogNumberSpan.textContent =
        num === 50
            ? "50! So many good dogs 🐕!!!"
            : num === 0
                ? "0. What kind of monster wants zero good dogs?"
                : num;
}

function handleBreedSubmit(e) {
    e.preventDefault();
    let breed = this.querySelector("input[type=text]").value.toLowerCase();
    getDogByBreed(breed);
    console.log(breed);
}

function handleBoneClick(e) {
    boneNav.forEach(bone=>{
        if (bone === this) {
            bone.classList.add("active")
        } else{
            bone.classList.remove("active")
        }
    })
    document.querySelectorAll("form").forEach(form => {
        form.classList.add("hide")
    })
    document.querySelector(this.dataset.show).classList.remove("hide")
}

function handleLoad() {
    dogSlider.addEventListener("input", handleSlider)
    randomForm.addEventListener("submit", handleRandomSubmit)
    breedForm.addEventListener("submit", handleBreedSubmit)
    boneNav.forEach(bone => {
        bone.addEventListener("click", handleBoneClick)
    })
}


window.onload = handleLoad;

