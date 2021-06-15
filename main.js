let car = document.getElementById("car");
let img = document.getElementById("problem-image");
let option_div = document.getElementById("options");

let car_angle; // initial angle of car.
let chosen_angle; // angle chosen by user.
let angle; // correct angle.

let timeouts = []; // stores the timeouts that have been set, so they can be cleared on restart

let seconds = 10; // how many seconds you have to answer the question

let start;
let intersect;

let lost = false;

let currentLevel = parseInt(localStorage.getItem("geometry_current_level"));
if (currentLevel == null){
    currentLevel = 0;
}
if (currentLevel > problems.length-1){
    window.location.href = "final.html";
}

function setup(problem){
    // Disable car movement
    car.style.transition = "";

    // Set image
    img.src = `assets/problems/${problem.img}`;
    document.getElementById("lose-modal").style.display = "none";

    // Set car position and angle
    start = problem.car;
    intersect = problem.intersect;
    car.style.opacity = 1;
    
    let slope = ((1000-start[1])-(1000-intersect[1]))/(start[0]-intersect[0]);
    car_angle = -180/Math.PI*Math.atan(slope);
    car.style.transform = `translate(-50%, -50%) rotateZ(${car_angle}deg)`;
    
    car.style.left = `${start[0]/10}%`;
    car.style.top = `${start[1]/10}%`;

    // Get car moving
    setTimeout(function(){
        car.style.left = `${intersect[0]/10}%`;
        car.style.top = `${intersect[1]/10}%`;
    },0);

    // Make car turn user angle after 10s
    setTimeout(function(){
        if (chosen_angle == 0){
            lose();
        }
        else{
            car.style.transform = `translate(-50%, -50%) rotateZ(${car_angle+chosen_angle}deg)`;            
        }
    },seconds*1000);

    // Make car move forward after turning
    setTimeout(function(){
        car.style.left = `${intersect[0]/10 + 50 * Math.cos((car_angle+chosen_angle) * Math.PI / 180)}%`;
        car.style.top = `${intersect[1]/10 + 50 * Math.sin((car_angle+chosen_angle) * Math.PI / 180)}%`;
        car.style.opacity = 0;
    },seconds*1000+1000);

    // Check whether angle is correct after turning
    setTimeout(function(){
        if (angle == chosen_angle){
            win();
        }
        else{
            lose();
        }
    },seconds*1000+4000);

    // Set options on street sign
    angle = problem.angle;
    chosen_angle = 0;
    document.getElementById("statement-blank").innerHTML = "&nbsp";
    option_div.innerHTML = "";
    for (let option of problem.choices){
        option_div.innerHTML += `<div onclick="setAngle(${option})">${option}</div>`;
    }

    // Set intersection marker
    document.getElementById("intersection").style.left = `${problem.intersect[0]/10}%`;
    document.getElementById("intersection").style.top = `${problem.intersect[1]/10}%`;

    // Set level name
    document.getElementById("problem-name").innerHTML = problem.name;

    // enable car movement
    car.style.transition = `${seconds}s top linear, ${seconds}s left linear, 1s transform, 5s opacity`;
}

function setAngle(a){
    chosen_angle = a;
    document.getElementById("statement-blank").innerHTML = a;
    option_div.innerHTML = "";
    document.getElementById("audio-place").play();
}

function lose(){
    if (!lost){
        for (let timeout of timeouts){
            clearTimeout(timeout);
        }
        let num_images = 3;
        let image = Math.floor(Math.random()*(num_images-1));
        document.getElementById("lose-modal").style.display = "block";
        document.getElementById("lose-modal-img").src = `assets/crash/${image}.png`;        
    }
    lost = true;
    document.getElementById("audio-crash").play();
}

function win(){
    localStorage.setItem("geometry_current_level",currentLevel+1);
    document.getElementById("audio-complete").play();
    setTimeout(function(){
        restart();
    },1000);
}

function restart(){
    window.location = window.location;
}

setup(problems[currentLevel]);