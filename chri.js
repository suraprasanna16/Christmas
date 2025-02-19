const canvas = document.getElementById('skyCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let snowflakes = [];
let santa = {
    x: width, // Début hors de l'écran
    y: height * 0.1,
    width: 150,
    height: 80,
    image: new Image(),
    time: 0 // Pour générer des mouvements sinusoïdaux
};

// Initialisation de l'image du Père Noël
santa.image.src = 'https://i.ibb.co/rbHJDQB/DALL-E-2024-12-02-23-37-removebg-preview.png';

function init() {
    resize();
    createSnowflakes();
    animate();
}

// Ajuste la taille du canvas en fonction de la fenêtre
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    santa.x = width;
    santa.y = height * 0.1;
}

window.addEventListener('resize', resize);

// Création des flocons
function createSnowflakes() {
    let count = width / 8; // Augmente légèrement le nombre de flocons
    snowflakes = [];
    for (let i = 0; i < count; i++) {
        snowflakes.push(new Snowflake());
    }
}

// Flocon de neige
function Snowflake() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 4 + 1; // Taille variable (1 à 5 pixels)
    this.speedX = Math.random() * 1 - 0.5; // Déplacement latéral aléatoire
    this.speedY = Math.random() * 3 + 1; // Vitesse de chute (1 à 4)
    this.opacity = Math.random() * 0.5 + 0.3; // Légère transparence
    this.swing = Math.random() * 2; // Mouvement en oscillation
    this.swingSpeed = Math.random() * 0.05 + 0.02; // Vitesse d'oscillation
    this.angle = Math.random() * Math.PI * 2; // Angle initial
}

Snowflake.prototype.update = function () {
    this.angle += this.swingSpeed; // Mise à jour de l'angle pour l'oscillation
    this.x += Math.cos(this.angle) * this.swing + this.speedX; // Oscillation + déplacement latéral
    this.y += this.speedY; // Chute

    // Remet le flocon au sommet s'il sort par le bas
    if (this.y > height) {
        this.y = 0;
        this.x = Math.random() * width;
    }

    // Gère les flocons sortant latéralement
    if (this.x > width) {
        this.x = 0;
    }
    if (this.x < 0) {
        this.x = width;
    }
};

Snowflake.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255,' + this.opacity + ')');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fill();
};

// Animation du Père Noël
function updateSanta() {
    santa.time += 0.05;
    santa.x -= 3; // Vitesse horizontale
    santa.y = height * 0.1+ Math.sin(santa.time) * 50; // Mouvement ondulé

    // Remet le Père Noël à droite quand il sort de l'écran
    if (santa.x + santa.width < 0) {
        santa.x = width;
    }
}

function drawSanta() {
    ctx.drawImage(santa.image, santa.x, santa.y, santa.width, santa.height);
}

// Animation principale
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Flocons de neige
    snowflakes.forEach((flake) => {
        flake.update();
        flake.draw();
    });

    // Père Noël
    updateSanta();
    drawSanta();

    requestAnimationFrame(animate);
}

init();
