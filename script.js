const dogSlider = document.getElementById("numberOfDogs");
const dogNumberSpan = document.getElementById("dogNumberDisplay")
const doggyList = document.querySelector("ul");
const randomForm = document.querySelector("#randomDogs");
const breedForm = document.querySelector("#dogsByBreed")
const loadGif = document.querySelector("#loading");
const boneNav = document.querySelectorAll(".bone");
const randomDogURL = "https://dog.ceo/api/breeds/image/random/";

// return a promise that resolves to the image once loaded. 
// reject returns false
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
        // clear picture area. remove error pic/text if present
        doggyList.innerHTML = "";
        hideError();
        // show loading dog
        loadGif.classList.remove("hide")
        
        // fetch n dog urls
        let response = await fetch(randomDogURL + num);

        // convert response to usable object
        let data = await response.json();
        // throw error
        if (!response.ok) throw new Error(`${data.code}: ${data.message}`)
        // Assignment requirement 1 ✓
        console.log(data); 
        // wait for all the images to load
        let imgArray = await Promise.all(data.message.map(url => generateImage(url)))
        // abstract equality comparison! num is string
        if (num == 1) {
            // if one pup place directly for bigger format
            doggyList.innerHTML = imgArray[0].outerHTML;
        }
        else {
            // display images in list to facilitate layout
            doggyList.innerHTML = imgArray.map(image => {
                if (image) return `<li>${image.outerHTML}</li>`
            }).join("") + "<li></li>" //prevent last photo from stretching;
        }
        // hide loading dog
        loadGif.classList.add("hide")
    }
    catch (error) {
        // show error pup on failure
        loadGif.classList.add("hide")
        showError();
        console.log(error)
    }
    
}

async function getDogByBreed(breed){
    try{
        //hide error message/image
        hideError();
        //show loading gif
        loadGif.classList.remove("hide")
        //clear images
        doggyList.innerHTML = "";
        // fetch dogs by breed
        let response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
        // parse into javascript object
        let data = await response.json();
        // if error throw error details
        if (!response.ok) {throw new Error(`${data.code}: ${data.message}`)}
        // load image
        let image = await generateImage(data.message);
        // display image
        doggyList.innerHTML = image.outerHTML
        // hide loading pup
        loadGif.classList.add("hide")
    }
    catch (e) {
        // show error pup on failure
        showError();
        // hide loading pup
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

// # of random dogs form submit
function handleRandomSubmit(e) {
    e.preventDefault();
    console.log("Getting good boys")
    getRandomDogs(dogSlider.value)
}

// dog by breed form submit
function handleBreedSubmit(e) {
    e.preventDefault();
    let breed = this.querySelector("input[type=text]").value.toLowerCase();
    getDogByBreed(breed);
    console.log(breed);
}

// practicing cascading ternary operators
function handleRangeSlider(e) {
    let num = parseInt(this.value);
    dogNumberSpan.textContent =
        num === 50
            ? "50! So many good dogs 🐕!!!"
            : num === 1
            ? "1. Really? Just one good dog?"
            : num;
}

// handling navigation
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

// initialize event handlers on page load
function handleLoad() {
    dogSlider.addEventListener("input", handleRangeSlider)
    randomForm.addEventListener("submit", handleRandomSubmit)
    breedForm.addEventListener("submit", handleBreedSubmit)
    boneNav.forEach(bone => {
        bone.addEventListener("click", handleBoneClick)
    })
}


window.onload = handleLoad;

