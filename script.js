const dogSlider = document.getElementById("numberOfDogs");
const dogNumberSpan = document.getElementById("dogNumberDisplay")
const dogURL = "https://dog.ceo/api/breeds/image/random/"
const doggyDiv = document.getElementById("doggy-pics");
const form = document.querySelector("form");
const loadGif = document.querySelector("#loading");

function generateImage (url){
    return new Promise((resolve,reject)=>{
        let image = new Image();
        image.src = url;
        image.addEventListener("load",()=>{
            resolve(image)
        })
        image.addEventListener("error",()=>{
            reject(false)
        })
    })
}

function handleSlider (e){
    let num = parseInt(this.value);
    dogNumberSpan.textContent = 
    num === 50
    ? "50! So many good dogs 🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕!!!"
    : num === 0
    ? "0 What kind of monster wants zero good dogs?"
    : num;
}

async function getDogs(num){
    try{
        doggyDiv.innerHTML = "";
        hideError();
        loadGif.classList.remove("hide")
        let response = await fetch(dogURL+num);
        if (!response.ok) throw new Error(response.statusText)
        let data = await response.json();
        let imgArray = await Promise.all(data.message.map(url=>generateImage(url)))
        imgArray.forEach(image=>{
           if (image) doggyDiv.appendChild(image)
        })
        loadGif.classList.add("hide")
        console.log("All dogs present and accounted for")
    } 
    catch (error){
        loadGif.classList.add("hide")
        showError();
        console.log(error)
    }

}

function showError(){
    document.querySelectorAll(".error").forEach(e=>e.classList.remove("hide"))
}

function hideError(){
    document.querySelectorAll(".error").forEach(e=>e.classList.add("hide"))
}

function handleSubmit(e){
    e.preventDefault();
    console.log("Getting good boys")
    getDogs(dogSlider.value)
}

function handleLoad (){
    dogSlider.addEventListener("input",handleSlider)
    form.addEventListener("submit", handleSubmit)
}


window.onload = handleLoad;

