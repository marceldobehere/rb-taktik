let savedValue;

function showValue(x, output){
    savedValue = x;
    output.innerText= savedValue + "%";
}

function updateValue(x, output){
    savedValue = x;
    output.innerText= savedValue + "%";
}

// window.addEventListener("load", myInit, true); 

// function myInit(){  

//     showValue(document.getElementById("volumeMusicValue").value, document.getElementById("volumeMusic"));
//     showValue(document.getElementById("volumeFXValue").value, document.getElementById("volumeFX"));
// }; 
