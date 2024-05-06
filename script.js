const play = document.querySelector(".play-btn");
const buttons = document.querySelectorAll(".button");

let gameColors = [];
let checkIndex = 0;
let isGood = true;
const winCondition = 15;
let isGameActive = false;
let timerId;
let speed = 1000;

function startTimer() {
    timerId = setTimeout(() => {
        loseAnimation();
        resetGame();
    }, 5000)
}

function resetTimer() {
    clearTimeout(timerId);
    startTimer();
}

function stopTimer() {
    clearTimeout(timerId);
}

function getNewColor() {
    const possibleColors = ["green", "red", "yellow", "blue"];
    const pickedColor = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    gameColors.push(pickedColor);
    playColorSequentially(gameColors);

}

function playColor(color) {
    buttons.forEach(button => {
        const buttonColor = button.style.getPropertyValue("--color");

        if (buttonColor === color) {
            const led = button.querySelector(".led");
            led.classList.add("active");
            playSound(buttonColor);

            setTimeout(() => {
                led.classList.remove("active")
            }, 500);
        };
    });
};

function increaseSpeedSequence(speed) {
    if (speed <= 200) {
        return speed = 200;
    } else {
        return speed -= 50;
    }
}

function playColorSequentially(colors) {
    stopTimer();
    isGameActive = false;
    let index = 0;

    function playNextColor() {
        if (index < colors.length) {
            playColor(colors[index]);
            index++;
            setTimeout(playNextColor, speed);
        } else {
            isGameActive = true;
            startTimer();
        }
    }
    playNextColor();


}

function playSound(color) {
    const colorSound = document.querySelector(`#${color}-sound`);
    colorSound.play();
}

function handleClick(e) {
    if (!isGameActive) {
        return
    }
    const pickedColor = e.target.classList[1];

    if (checkIndex < gameColors.length) {
        playColor(pickedColor);
        checkUserChoice(pickedColor, gameColors[checkIndex]);
        checkIndex++;
        resetTimer();
    }

    if (!isGood) {
        // Arrêter le jeu si le joueur a fait une erreur
        loseAnimation();
        return;
    }

    if (checkIndex === winCondition) {
        winAnimation();

        return
    }

    if (checkIndex === gameColors.length) {
        speed = increaseSpeedSequence(speed);
        //evite que la nouvelle couleur soit jouée directement
        setTimeout(() => getNewColor(), 1000);
        checkIndex = 0;
    }
}

function checkUserChoice(pickedColor, color) {
    if (pickedColor !== color) {
        isGood = false; // Le joueur a fait une erreur

    }
}

function loseAnimation() {
    buttons.forEach(btn => {
        const led = btn.querySelector(".led");

        // Fonction pour faire clignoter la LED une fois
        function blinkOnce() {
            led.classList.add("active");
            playSound("red");
            playSound("blue");
            playSound("green");
            playSound("yellow");
            setTimeout(() => {
                led.classList.remove("active");
            }, 500);
        }

        // Fonction récursive pour faire clignoter la LED deux fois
        function blinkMultipleTimes(count) {
            if (count > 0) {
                blinkOnce();
                setTimeout(() => {
                    blinkMultipleTimes(count - 1);
                }, 1000); // Délai d'une seconde avant le prochain clignotement
            }
        }

        // Lancer le clignotement deux fois
        blinkMultipleTimes(2);
    });
    resetGame();
}

function winAnimation() {
    const colors = ["green", "red", "blue", "yellow", "green", "red", "blue", "yellow", "green", "blue", "red", "yellow"];
    let index = 0;
    let intervalId; // Déclaration de intervalId en dehors de la boucle


    intervalId = setInterval(() => {
        if (index < colors.length) {
            playColor(colors[index]);
            index++;
        } else {
            clearInterval(intervalId); // Arrêter l'intervalle une fois que toutes les couleurs ont été jouées
            index = 0; // Réinitialiser l'index à zéro
        }
    }, 150);
    resetGame();

}

function resetGame() {
    gameColors = [];
    checkIndex = 0;
    isGood = true;
    isGameActive = false;
    speed = 1000;
    play.addEventListener("click", game);
    stopTimer();
}

function game() {
    isGameActive = true;
    getNewColor();
    play.removeEventListener("click", game);
    buttons.forEach(btn => {
        btn.addEventListener("click", handleClick);
    });
}

play.addEventListener("click", game);
