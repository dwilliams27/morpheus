// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ============================================
// Interactive Neuron Demo
// ============================================
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const input1Val = document.getElementById('input1-val');
const input2Val = document.getElementById('input2-val');
const neuronOutput = document.getElementById('neuron-output');
const neuronCanvas = document.getElementById('neuron-canvas');
const neuronCtx = neuronCanvas.getContext('2d');

// Weights and bias for the neuron
const w1 = 0.7;
const w2 = 0.3;
const bias = -0.2;

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function updateNeuron() {
    const x1 = parseFloat(input1.value);
    const x2 = parseFloat(input2.value);

    input1Val.textContent = x1.toFixed(2);
    input2Val.textContent = x2.toFixed(2);

    // Calculate output
    const weighted_sum = w1 * x1 + w2 * x2 + bias;
    const output = sigmoid(weighted_sum);

    neuronOutput.textContent = output.toFixed(2);

    // Draw visualization
    drawNeuron(x1, x2, output);
}

function drawNeuron(x1, x2, output) {
    const canvas = neuronCanvas;
    const ctx = neuronCtx;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Colors
    const nodeColor = '#6366f1';
    const outputColor = output > 0.5 ? '#10b981' : '#8b5cf6';

    // Positions
    const input1Pos = { x: 50, y: 60 };
    const input2Pos = { x: 50, y: 140 };
    const neuronPos = { x: 200, y: 100 };

    // Draw connections
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;

    // Input 1 connection
    ctx.beginPath();
    ctx.moveTo(input1Pos.x, input1Pos.y);
    ctx.lineTo(neuronPos.x - 20, neuronPos.y);
    ctx.stroke();

    // Input 2 connection
    ctx.beginPath();
    ctx.moveTo(input2Pos.x, input2Pos.y);
    ctx.lineTo(neuronPos.x - 20, neuronPos.y);
    ctx.stroke();

    // Draw input nodes
    ctx.fillStyle = nodeColor;
    ctx.beginPath();
    ctx.arc(input1Pos.x, input1Pos.y, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(input2Pos.x, input2Pos.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw neuron
    ctx.fillStyle = outputColor;
    ctx.beginPath();
    ctx.arc(neuronPos.x, neuronPos.y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Draw output line
    ctx.strokeStyle = outputColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(neuronPos.x + 25, neuronPos.y);
    ctx.lineTo(neuronPos.x + 60, neuronPos.y);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(x1.toFixed(1), input1Pos.x - 25, input1Pos.y + 5);
    ctx.fillText(x2.toFixed(1), input2Pos.x - 25, input2Pos.y + 5);

    ctx.textAlign = 'left';
    ctx.fillText(output.toFixed(2), neuronPos.x + 70, neuronPos.y + 5);

    // Draw weight labels
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('w=' + w1, 100, 50);
    ctx.fillText('w=' + w2, 100, 150);
}

input1.addEventListener('input', updateNeuron);
input2.addEventListener('input', updateNeuron);

// Initialize
updateNeuron();

// ============================================
// Activation Functions Demo
// ============================================
const activationCanvas = document.getElementById('activation-canvas');
const activationCtx = activationCanvas.getContext('2d');
const activationButtons = document.querySelectorAll('#activation-demo button');

let currentActivation = 'relu';

function relu(x) {
    return Math.max(0, x);
}

function tanh(x) {
    return Math.tanh(x);
}

function drawActivationFunction(fn) {
    const canvas = activationCanvas;
    const ctx = activationCtx;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;

    // X axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Draw function
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const xRange = 4; // -4 to 4
    const yRange = fn === 'relu' ? 4 : 1.5;

    for (let px = 0; px < width; px++) {
        const x = (px / width) * (xRange * 2) - xRange;
        let y;

        if (fn === 'relu') {
            y = relu(x);
        } else if (fn === 'sigmoid') {
            y = sigmoid(x);
        } else if (fn === 'tanh') {
            y = tanh(x);
        }

        const py = height / 2 - (y / yRange) * (height / 2);

        if (px === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(fn.toUpperCase(), width / 2, 20);

    // Draw axis labels
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('0', width / 2 + 10, height / 2 - 5);
}

activationButtons.forEach(button => {
    button.addEventListener('click', () => {
        activationButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        currentActivation = button.dataset.fn;
        drawActivationFunction(currentActivation);
    });
});

// Initialize
drawActivationFunction('relu');

// ============================================
// Gradient Descent Demo
// ============================================
const gdCanvas = document.getElementById('gd-canvas');
const gdCtx = gdCanvas.getContext('2d');
const gdStepBtn = document.getElementById('gd-step');
const gdRunBtn = document.getElementById('gd-run');
const gdResetBtn = document.getElementById('gd-reset');
const lrSlider = document.getElementById('lr');
const lrVal = document.getElementById('lr-val');

let gdX = -2.5;
let gdRunning = false;
let gdInterval = null;

// Simple quadratic function
function loss(x) {
    return (x - 0.5) * (x - 0.5) + 0.3;
}

function lossDerivative(x) {
    return 2 * (x - 0.5);
}

function drawGradientDescent() {
    const canvas = gdCanvas;
    const ctx = gdCtx;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw loss curve
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const xRange = 3;
    const yRange = 7;

    for (let px = 0; px < width; px++) {
        const x = (px / width) * (xRange * 2) - xRange;
        const y = loss(x);
        const py = height - 20 - (y / yRange) * (height - 40);

        if (px === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.stroke();

    // Draw current position
    const currentX = (gdX + xRange) / (xRange * 2) * width;
    const currentY = height - 20 - (loss(gdX) / yRange) * (height - 40);

    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw gradient arrow
    const gradient = lossDerivative(gdX);
    const arrowLength = Math.min(Math.abs(gradient) * 20, 50);
    const arrowDirection = gradient > 0 ? -1 : 1;

    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX + arrowDirection * arrowLength, currentY);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(currentX + arrowDirection * arrowLength, currentY);
    ctx.lineTo(currentX + arrowDirection * arrowLength - arrowDirection * 8, currentY - 5);
    ctx.lineTo(currentX + arrowDirection * arrowLength - arrowDirection * 8, currentY + 5);
    ctx.closePath();
    ctx.fill();

    // Draw labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`x = ${gdX.toFixed(2)}`, width / 2, height - 5);
    ctx.fillText(`loss = ${loss(gdX).toFixed(2)}`, width / 2, 20);
}

function stepGradientDescent() {
    const lr = parseFloat(lrSlider.value);
    const gradient = lossDerivative(gdX);
    gdX = gdX - lr * gradient;

    // Clamp to visible range
    gdX = Math.max(-3, Math.min(3, gdX));

    drawGradientDescent();

    // Stop if converged
    if (Math.abs(gradient) < 0.01) {
        stopGradientDescent();
    }
}

function runGradientDescent() {
    if (gdRunning) {
        stopGradientDescent();
    } else {
        gdRunning = true;
        gdRunBtn.textContent = 'Stop';
        gdInterval = setInterval(stepGradientDescent, 200);
    }
}

function stopGradientDescent() {
    gdRunning = false;
    gdRunBtn.textContent = 'Run';
    if (gdInterval) {
        clearInterval(gdInterval);
        gdInterval = null;
    }
}

function resetGradientDescent() {
    stopGradientDescent();
    gdX = -2.5;
    drawGradientDescent();
}

gdStepBtn.addEventListener('click', stepGradientDescent);
gdRunBtn.addEventListener('click', runGradientDescent);
gdResetBtn.addEventListener('click', resetGradientDescent);

lrSlider.addEventListener('input', () => {
    lrVal.textContent = parseFloat(lrSlider.value).toFixed(2);
});

// Initialize
drawGradientDescent();

// ============================================
// Smooth scroll highlight
// ============================================
const sections = document.querySelectorAll('.chapter');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.background = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.background = 'var(--primary)';
        }
    });
});
