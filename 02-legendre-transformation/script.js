const PLOT_RANGE = {
    xMin: -4,
    xMax: 4,
    yMin: -6,
    yMax: 10
};

const functions = {
    quadratic: {
        name: '二次函数',
        latex: 'f(x) = x^2',
        f: x => x * x,
        df: x => 2 * x,
        g: p => p * p / 4,
        displayX: [-3, 3],
        displayY: [0, 10],
        pRange: [-6, 6],
        gRange: [0, 10]
    },
    cubic: {
        name: '三次函数',
        latex: 'f(x) = \\frac{x^3}{3}',
        f: x => (x * x * x) / 3,
        df: x => x * x,
        g: p => (2 / 3) * Math.pow(Math.abs(p), 3/2) * Math.sign(p),
        displayX: [-2.5, 2.5],
        displayY: [-4, 4],
        pRange: [0, 6],
        gRange: [0, 5]
    },
    exponential: {
        name: '指数函数',
        latex: 'f(x) = e^x',
        f: x => Math.exp(x),
        df: x => Math.exp(x),
        g: p => p * Math.log(p) - p,
        displayX: [-2, 3],
        displayY: [0, 20],
        pRange: [0.1, 20],
        gRange: [-5, 15]
    },
    logarithm: {
        name: '对数函数',
        latex: 'f(x) = x\\ln x - x',
        f: x => x > 0 ? x * Math.log(x) - x : 0,
        df: x => x > 0 ? Math.log(x) : 0,
        g: p => Math.exp(p),
        displayX: [0.1, 4],
        displayY: [-3, 3],
        pRange: [-3, 2],
        gRange: [0, 8]
    }
};

const originalCanvas = document.getElementById('originalCanvas');
const transformCanvas = document.getElementById('transformCanvas');
const ctx1 = originalCanvas.getContext('2d');
const ctx2 = transformCanvas.getContext('2d');

const functionSelect = document.getElementById('functionSelect');
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('resetBtn');
const showTangentCluster = document.getElementById('showTangentCluster');
const showProcessLines = document.getElementById('showProcessLines');
const animationSlider = document.getElementById('animationSlider');
const animationPercent = document.getElementById('animationPercent');

const currentXEl = document.getElementById('currentX');
const currentFxEl = document.getElementById('currentFx');
const currentPEl = document.getElementById('currentP');
const currentInterceptEl = document.getElementById('currentIntercept');
const currentGEl = document.getElementById('currentG');

let currentFunc = functions.quadratic;
let currentXValue = -2;
let isPlaying = false;
let animationId = null;
let animationSpeed = 0.015;

function toCanvasX(canvas, x) {
    return (x - PLOT_RANGE.xMin) / (PLOT_RANGE.xMax - PLOT_RANGE.xMin) * canvas.width;
}

function toCanvasY(canvas, y) {
    return canvas.height - (y - PLOT_RANGE.yMin) / (PLOT_RANGE.yMax - PLOT_RANGE.yMin) * canvas.height;
}

function fromCanvasX(canvas, px) {
    return PLOT_RANGE.xMin + px / canvas.width * (PLOT_RANGE.xMax - PLOT_RANGE.xMin);
}

function drawGrid(ctx, canvas, xRange = null, yRange = null) {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let x = Math.ceil(PLOT_RANGE.xMin); x <= PLOT_RANGE.xMax; x++) {
        const px = toCanvasX(canvas, x);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, canvas.height);
        ctx.stroke();
    }
    
    for (let y = Math.ceil(PLOT_RANGE.yMin); y <= PLOT_RANGE.yMax; y++) {
        const py = toCanvasY(canvas, y);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(canvas.width, py);
        ctx.stroke();
    }
    
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    
    const y0 = toCanvasY(canvas, 0);
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(canvas.width, y0);
    ctx.stroke();
    
    const x0 = toCanvasX(canvas, 0);
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, canvas.height);
    ctx.stroke();
    
    ctx.fillStyle = '#888';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    for (let x = Math.ceil(PLOT_RANGE.xMin); x <= PLOT_RANGE.xMax; x++) {
        const px = toCanvasX(canvas, x);
        ctx.fillText(x.toString(), px, y0 + 20);
    }
    
    ctx.textAlign = 'right';
    for (let y = Math.ceil(PLOT_RANGE.yMin); y <= PLOT_RANGE.yMax; y++) {
        const py = toCanvasY(canvas, y);
        ctx.fillText(y.toString(), x0 - 8, py + 4);
    }
}

function drawFunction(ctx, canvas, func, xRange) {
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    
    const [xMin, xMax] = xRange;
    const steps = 500;
    const dx = (xMax - xMin) / steps;
    let started = false;
    
    for (let i = 0; i <= steps; i++) {
        const x = xMin + i * dx;
        const y = func(x);
        
        if (!isFinite(y) || y < PLOT_RANGE.yMin - 10 || y > PLOT_RANGE.yMax + 10) {
            started = false;
            continue;
        }
        
        const px = toCanvasX(canvas, x);
        const py = toCanvasY(canvas, y);
        
        if (!started) {
            ctx.moveTo(px, py);
            started = true;
        } else {
            ctx.lineTo(px, py);
        }
    }
    
    ctx.stroke();
}

function drawTangentLine(ctx, canvas, x, func, df, color = '#e74c3c', lineWidth = 2, alpha = 1) {
    if (typeof func !== 'function' || typeof df !== 'function') {
        return { x: 0, y: 0, p: 0, yIntercept: 0 };
    }
    
    const y = func(x);
    const p = df(x);
    
    const x1 = PLOT_RANGE.xMin - 1;
    const x2 = PLOT_RANGE.xMax + 1;
    const y1 = y + p * (x1 - x);
    const y2 = y + p * (x2 - x);
    
    const px1 = toCanvasX(canvas, x1);
    const py1 = toCanvasY(canvas, y1);
    const px2 = toCanvasX(canvas, x2);
    const py2 = toCanvasY(canvas, y2);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = alpha;
    ctx.setLineDash([6, 4]);
    
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, py2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    
    return { x, y, p, yIntercept: y - p * x };
}

function drawTangentPoint(ctx, canvas, x, func, isActive = false) {
    const y = func(x);
    const px = toCanvasX(canvas, x);
    const py = toCanvasY(canvas, y);
    
    ctx.beginPath();
    ctx.arc(px, py, isActive ? 10 : 6, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? '#ff6b6b' : '#c0392b';
    ctx.fill();
    
    if (isActive) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isActive ? 'x' : '', px, py);
}

function drawYIntercept(ctx, canvas, yIntercept, isActive = false) {
    if (yIntercept < PLOT_RANGE.yMin - 2 || yIntercept > PLOT_RANGE.yMax + 2) return;
    
    const x0 = toCanvasX(canvas, 0);
    const interceptY = toCanvasY(canvas, yIntercept);
    
    ctx.beginPath();
    ctx.arc(x0, interceptY, isActive ? 8 : 5, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? '#9b59b6' : '#8e44ad';
    ctx.fill();
    
    if (isActive) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('-g(p)', x0 + 15, interceptY);
    }
}

function drawTransformPoint(ctx, canvas, p, g, isActive = false) {
    if (p < PLOT_RANGE.xMin - 1 || p > PLOT_RANGE.xMax + 1) return;
    if (g < PLOT_RANGE.yMin - 2 || g > PLOT_RANGE.yMax + 2) return;
    
    const px = toCanvasX(canvas, p);
    const py = toCanvasY(canvas, g);
    
    ctx.beginPath();
    ctx.arc(px, py, isActive ? 10 : 5, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? '#2ecc71' : '#27ae60';
    ctx.fill();
    
    if (isActive) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#27ae60';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`g(${p.toFixed(1)})`, px + 15, py - 10);
    }
}

function drawTransformCurve(ctx, canvas, func) {
    if (!func || !func.pRange || !Array.isArray(func.pRange)) {
        return;
    }
    
    ctx.strokeStyle = 'rgba(46, 204, 113, 0.4)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    
    const pRange = func.pRange;
    const [pMin, pMax] = pRange;
    
    if (!isFinite(pMin) || !isFinite(pMax) || pMin >= pMax) {
        return;
    }
    
    const steps = 200;
    const dp = (pMax - pMin) / steps;
    let started = false;
    
    for (let i = 0; i <= steps; i++) {
        const pVal = pMin + i * dp;
        const gVal = func.g(pVal);
        
        if (!isFinite(gVal) || gVal < PLOT_RANGE.yMin - 5 || gVal > PLOT_RANGE.yMax + 5) {
            started = false;
            continue;
        }
        
        const px = toCanvasX(canvas, pVal);
        const py = toCanvasY(canvas, gVal);
        
        if (!started) {
            ctx.moveTo(px, py);
            started = true;
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.stroke();
}

function drawProcessLine(ctx, canvas1, canvas2, x, func, df) {
    if (typeof func !== 'function' || typeof df !== 'function') {
        return;
    }
    
    const y = func(x);
    const p = df(x);
    const g = x * p - y;
    
    const px1 = toCanvasX(canvas1, x);
    const py1 = toCanvasY(canvas1, y);
    const px2 = toCanvasX(canvas2, p);
    const py2 = toCanvasY(canvas2, g);
    
    const midX = (px1 + px2) / 2;
    
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.moveTo(px1 + 60, py1);
    ctx.quadraticCurveTo(midX, py1, midX, (py1 + py2) / 2);
    ctx.quadraticCurveTo(midX, py2, px2 - 60, py2);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#e74c3c';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    
    const arrowMidX = midX + 30;
    ctx.fillText('x', px1 + 45, py1 - 10);
    ctx.fillText('→', px1 + 60, py1);
    ctx.fillText(`p=${p.toFixed(1)}`, arrowMidX, (py1 + py2) / 2 - 10);
    ctx.fillText('→', arrowMidX + 15, (py1 + py2) / 2);
    ctx.fillText(`g=${g.toFixed(1)}`, px2 - 45, py2 - 10);
}

function drawTangentCluster(ctx, canvas, func, df, activeX, xRange) {
    if (typeof func !== 'function' || typeof df !== 'function' || !Array.isArray(xRange)) {
        return;
    }
    
    const [xMin, xMax] = xRange;
    const numTangents = 20;
    const dx = (xMax - xMin) / numTangents;
    
    for (let i = 0; i <= numTangents; i++) {
        const x = xMin + i * dx;
        const isActive = Math.abs(x - activeX) < dx * 0.5;
        drawTangentLine(ctx, canvas, x, func, df, isActive ? '#e74c3c' : 'rgba(231, 76, 60, 0.15)', isActive ? 2 : 1, isActive ? 1 : 0.3);
    }
}

function drawActiveElements(ctx1, ctx2, x, func, df) {
    if (typeof func !== 'function' || typeof df !== 'function') {
        return;
    }
    
    const y = func(x);
    const p = df(x);
    const g = x * p - y;
    const yIntercept = -g;
    
    drawTangentLine(ctx1, originalCanvas, x, func, df, '#e74c3c', 3);
    drawTangentPoint(ctx1, originalCanvas, x, func, true);
    drawYIntercept(ctx1, originalCanvas, yIntercept, true);
    
    drawTransformCurve(ctx2, transformCanvas, func);
    drawTransformPoint(ctx2, transformCanvas, p, g, true);
    
    if (showProcessLines && showProcessLines.checked) {
        drawProcessLine(ctx1, ctx2, x, func, df);
    }
    
    ctx1.fillStyle = '#e74c3c';
    ctx1.font = 'bold 14px Arial';
    ctx1.textAlign = 'left';
    const labelX = toCanvasX(originalCanvas, x) + 15;
    const labelY = toCanvasY(originalCanvas, y) - 20;
    ctx1.fillText(`x = ${x.toFixed(2)}`, labelX, labelY);
    ctx1.fillText(`f(x) = ${y.toFixed(2)}`, labelX, labelY + 18);
    ctx1.fillText(`p = ${p.toFixed(2)}`, labelX, labelY + 36);
    
    ctx2.fillStyle = '#27ae60';
    ctx2.font = 'bold 14px Arial';
    ctx2.textAlign = 'left';
    ctx2.fillText(`g(p) = ${g.toFixed(2)}`, toCanvasX(transformCanvas, p) + 15, toCanvasY(transformCanvas, g) + 25);
    
    updateInfo(x, y, p, g);
}

function updateInfo(x, fx, p, g) {
    currentXEl.textContent = x.toFixed(3);
    currentFxEl.textContent = fx.toFixed(3);
    currentPEl.textContent = p.toFixed(3);
    currentGEl.textContent = g.toFixed(3);
    currentInterceptEl.textContent = (-g).toFixed(3);
}

function render() {
    if (!ctx1 || !ctx2 || !currentFunc) {
        return;
    }
    
    ctx1.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
    ctx2.clearRect(0, 0, transformCanvas.width, transformCanvas.height);
    
    drawGrid(ctx1, originalCanvas);
    drawGrid(ctx2, transformCanvas);
    
    drawFunction(ctx1, originalCanvas, currentFunc.f, currentFunc.displayX);
    
    if (showTangentCluster && showTangentCluster.checked) {
        drawTangentCluster(ctx1, originalCanvas, currentFunc.f, currentFunc.df, currentXValue, currentFunc.displayX);
    }
    
    drawActiveElements(ctx1, ctx2, currentXValue, currentFunc.f, currentFunc.df);
    
    if (currentFunc.displayX && Array.isArray(currentFunc.displayX)) {
        const progress = (currentXValue - currentFunc.displayX[0]) / (currentFunc.displayX[1] - currentFunc.displayX[0]);
        if (animationSlider) animationSlider.value = progress * 100;
        if (animationPercent) animationPercent.textContent = Math.round(progress * 100) + '%';
    }
}

function animate() {
    if (!isPlaying) return;
    
    const [xMin, xMax] = currentFunc.displayX;
    currentXValue += animationSpeed;
    
    if (currentXValue >= xMax) {
        currentXValue = xMax;
        isPlaying = false;
        playBtn.textContent = '▶ 播放动画';
        cancelAnimationFrame(animationId);
        return;
    }
    
    render();
    animationId = requestAnimationFrame(animate);
}

function handleMouseMove(e) {
    const rect = originalCanvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let x = fromCanvasX(originalCanvas, px);
    
    const [xMin, xMax] = currentFunc.displayX;
    x = Math.max(xMin + 0.01, Math.min(xMax - 0.01, x));
    
    currentXValue = x;
    render();
}

function handleSliderChange(e) {
    const progress = e.target.value / 100;
    const [xMin, xMax] = currentFunc.displayX;
    currentXValue = xMin + progress * (xMax - xMin);
    render();
}

function init() {
    render();
    
    originalCanvas.addEventListener('mousemove', handleMouseMove);
    
    originalCanvas.addEventListener('mousedown', (e) => {
        handleMouseMove(e);
    });
    
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            isPlaying = false;
            playBtn.textContent = '▶ 播放动画';
            cancelAnimationFrame(animationId);
        } else {
            if (currentXValue >= currentFunc.displayX[1]) {
                currentXValue = currentFunc.displayX[0];
            }
            isPlaying = true;
            playBtn.textContent = '⏸ 暂停';
            animate();
        }
    });
    
    resetBtn.addEventListener('click', () => {
        isPlaying = false;
        playBtn.textContent = '▶ 播放动画';
        cancelAnimationFrame(animationId);
        currentXValue = currentFunc.displayX[0];
        render();
    });
    
    animationSlider.addEventListener('input', handleSliderChange);
    
    showTangentCluster.addEventListener('change', render);
    showProcessLines.addEventListener('change', render);
    
    functionSelect.addEventListener('change', (e) => {
        currentFunc = functions[e.target.value];
        currentXValue = currentFunc.displayX[0];
        isPlaying = false;
        playBtn.textContent = '▶ 播放动画';
        cancelAnimationFrame(animationId);
        render();
    });
    
    originalCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = originalCanvas.getBoundingClientRect();
        const px = touch.clientX - rect.left;
        let x = fromCanvasX(originalCanvas, px);
        const [xMin, xMax] = currentFunc.displayX;
        x = Math.max(xMin + 0.01, Math.min(xMax - 0.01, x));
        currentXValue = x;
        render();
    });
    
    originalCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = originalCanvas.getBoundingClientRect();
        const px = touch.clientX - rect.left;
        let x = fromCanvasX(originalCanvas, px);
        const [xMin, xMax] = currentFunc.displayX;
        x = Math.max(xMin + 0.01, Math.min(xMax - 0.01, x));
        currentXValue = x;
        render();
    });
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', render);
