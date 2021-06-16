let currentImg = 0;
let numImages = 5;

function display(){
    document.getElementById("intro-modal-img").src = `assets/intro/${currentImg}.png`;
}

function next(){
    currentImg += 1;
    if (currentImg < numImages){
        display();
    }
    else{
        window.location.href = "main.html";
    }
    document.getElementById("audio-place").play();
}

display();
localStorage.setItem("geometry_current_level",0);