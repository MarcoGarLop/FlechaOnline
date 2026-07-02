const arrow = document.getElementById('arrow-btn');
const roundCounter = document.getElementById('round-counter');
const modal = document.getElementById('modal');
const restartBtn = document.getElementById('restart-btn');

let currentRound = 0;
const maxRounds = 10;
let currentRotation = 0;
let isSpinning = false;

arrow.addEventListener('click', () => {
    // Si ya está girando o llegamos al límite de rondas, ignorar clic
    if (isSpinning || currentRound >= maxRounds) return;
    
    isSpinning = true;
    currentRound++;
    
    roundCounter.innerText = `Ronda: ${currentRound} / ${maxRounds}`;
    
    // 50% de probabilidad de caer EXACTAMENTE en el sureste (135 grados)
    // El otro 50% es completamente aleatorio (0 a 359)
    let finalDegree;
    if (Math.random() < 0.5) {
        finalDegree = 135; // Sureste auténtico
        console.log("Truco activado: Sureste");
    } else {
        finalDegree = Math.floor(Math.random() * 360);
        console.log("Giro natural");
    }
    
    // Queremos que dé entre 5 y 8 vueltas completas de forma aleatoria
    const extraSpins = Math.floor(Math.random() * 4) + 5; 
    const baseSpins = 360 * extraSpins;
    
    // Normalizamos la rotación actual para calcular el siguiente destino
    const currentModulo = currentRotation % 360;
    
    // Calculamos cuánto falta para llegar a los grados objetivo en esta vuelta
    let degreesToAdd = finalDegree - currentModulo;
    if (degreesToAdd < 0) degreesToAdd += 360; // Forzamos a que sea positivo
    
    // Actualizamos la rotación total que se aplicará en el CSS
    currentRotation += baseSpins + degreesToAdd;
    
    // Aplicamos el giro
    arrow.style.transform = `rotate(${currentRotation}deg)`;
});

arrow.addEventListener('transitionend', () => {
    // Verificamos que este evento provenga de haber terminado de girar
    if (!isSpinning) return;
    isSpinning = false;
    
    // Si llegamos a la ronda 10, mostramos el cartel después de un pequeño respiro
    if (currentRound === maxRounds) {
        setTimeout(() => {
            modal.classList.remove('hidden');
        }, 400);
    }
});

restartBtn.addEventListener('click', () => {
    // Reiniciar las variables
    currentRound = 0;
    roundCounter.innerText = `Ronda: 0 / ${maxRounds}`;
    
    // Ocultar modal
    modal.classList.add('hidden');
    
    // Quitar la transición para resetear la flecha al instante sin que dé vueltas hacia atrás
    arrow.style.transition = 'none';
    currentRotation = 0;
    arrow.style.transform = `rotate(0deg)`;
    
    // Forzar el repintado del navegador para que el cambio sin transición aplique ya
    void arrow.offsetWidth;
    
    // Restaurar la transición para los próximos giros
    arrow.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
});
