const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const startButton = document.getElementById('start-btn');
const beepSound = document.getElementById('beep-sound');
const roundCounter = document.getElementById('round-counter');

let countdown;
let intervalCount = 0;
let isRunning = false;
let inFastPhase = true;
let startTime, expectedEndTime;
let wakeLock = null; // Variável para a Wake Lock API

// Definindo os tempos para os intervalos
const warmUpTime = 5 * 60; // 5 minutos
const highSpeedTime = 70; // 1 minuto e 10 segundos
const lowSpeedTime = 70; // 1 minuto e 10 segundos
let currentTime = warmUpTime;

startButton.addEventListener('click', startWorkout);

async function startWorkout() {
  if (!isRunning) {
    isRunning = true;
    startButton.disabled = true;
    statusDisplay.textContent = 'Aquecimento';
    await requestWakeLock(); // Solicita o bloqueio de tela
    startTimer(warmUpTime, handleWarmUpEnd);
    timerDisplay.classList.remove('fast-phase', 'slow-phase'); // Limpa classes durante o aquecimento
  }
}

function startTimer(seconds, callback) {
  currentTime = seconds;
  startTime = Date.now();
  expectedEndTime = startTime + seconds * 1000;
  
  updateDisplay();
  countdown = setInterval(() => {
    const now = Date.now();
    currentTime = Math.round((expectedEndTime - now) / 1000);

    if (currentTime <= 0) {
      clearInterval(countdown);
      callback();
    }
    
    updateDisplay();
  }, 1000);
}

function updateDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function handleWarmUpEnd() {
  beepSound.play(); // Sinal sonoro para início do treino
  statusDisplay.textContent = 'Corrida Rápida';
  intervalCount = 0;
  updateRoundCounter();
  startInterval();
}

function startInterval() {
  if (intervalCount < 15) {
    if (inFastPhase) {
      statusDisplay.textContent = 'Corrida Rápida';
      timerDisplay.style.backgroundColor = '#ff4c4c';
      startTimer(highSpeedTime, handleHighSpeedEnd);
    } else {
      statusDisplay.textContent = 'Corrida Lenta';
      timerDisplay.style.backgroundColor = '#4c92ff';
      startTimer(lowSpeedTime, handleLowSpeedEnd);
    }
  } else {
    statusDisplay.textContent = 'Treino Concluído';
    startButton.disabled = false;
    isRunning = false;
    releaseWakeLock(); // Libera o bloqueio de tela após o treino
  }
}

function handleHighSpeedEnd() {
  beepSound.play();
  inFastPhase = false;
  startInterval();
}

function handleLowSpeedEnd() {
  beepSound.play();
  intervalCount++;
  inFastPhase = true;
  updateRoundCounter();
  startInterval();
}

function updateRoundCounter() {
  roundCounter.textContent = `Rodada: ${intervalCount + 1} de 15`;
}

// Função para solicitar o bloqueio de tela (Wake Lock)
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock ativo');
    } else {
      console.log('Wake Lock API não suportada');
    }
  } catch (err) {
    console.error(`Erro ao ativar Wake Lock: ${err.name}, ${err.message}`);
  }
}

// Função para liberar o bloqueio de tela
function releaseWakeLock() {
  if (wakeLock !== null) {
    wakeLock.release().then(() => {
      wakeLock = null;
      console.log('Wake Lock liberado');
    });
  }
}
