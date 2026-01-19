// 统一定义坐标范围
const PLOT_RANGE = {
    xMin: -4,
    xMax: 4,
    yMin: -4,
    yMax: 8
};

// 函数定义 - 每个函数定义自己的显示范围
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
        displayY: [-3, 3],
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

// 画布和上下文
const originalCanvas = document.getElementById('originalCanvas');
const transformCanvas = document.getElementById('transformCanvas');
const ctx1 = originalCanvas.getContext('2d');
const ctx2 = transformCanvas.getContext('2d');

// UI元素
const functionSelect = document.getElementById('functionSelect');
const currentX = document.getElementById('currentX');
const currentP = document.getElementById('currentP');
const currentIntercept = document.getElementById('currentIntercept');
const currentG = document.getElementById('currentG');

// 当前状态
let currentFunc = functions.quadratic;
let currentXValue = 1;
let isDragging = false;

// 坐标转换函数 - 使用统一的坐标范围
function toCanvasX(canvas, x) {
    return (x - PLOT_RANGE.xMin) / (PLOT_RANGE.xMax - PLOT_RANGE.xMin) * canvas.width;
}

function toCanvasY(canvas, y) {
    return canvas.height - (y - PLOT_RANGE.yMin) / (PLOT_RANGE.yMax - PLOT_RANGE.yMin) * canvas.height;
}

function fromCanvasX(canvas, px) {
    return PLOT_RANGE.xMin + px / canvas.width * (PLOT_RANGE.xMax - PLOT_RANGE.xMin);
}

// 绘制坐标轴
function drawGrid(ctx, canvas, xRange, yRange) {
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // 绘制网格
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
    
    // 主坐标轴
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // x轴
    const y0 = toCanvasY(canvas, 0);
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(canvas.width, y0);
    ctx.stroke();
    
    // y轴
    const x0 = toCanvasX(canvas, 0);
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, canvas.height);
    ctx.stroke();
    
    // 刻度标签
    ctx.fillStyle = '#666';
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

// 绘制函数
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
        
        // 跳过无效值和超出范围的值
        if (!isFinite(y) || y < PLOT_RANGE.yMin - 5 || y > PLOT_RANGE.yMax + 5) {
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

// 绘制切线及其与坐标轴的关系
function drawTangent(ctx, canvas, x, func, df) {
    const y = func(x);
    const p = df(x);
    
    // 计算切线在画布范围内的两个端点
    const x1 = PLOT_RANGE.xMin - 1;
    const x2 = PLOT_RANGE.xMax + 1;
    const y1 = y + p * (x1 - x);
    const y2 = y + p * (x2 - x);
    
    const px1 = toCanvasX(canvas, x1);
    const py1 = toCanvasY(canvas, y1);
    const px2 = toCanvasX(canvas, x2);
    const py2 = toCanvasY(canvas, y2);
    
    // 绘制切线
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, py2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 绘制切点
    const px = toCanvasX(canvas, x);
    const py = toCanvasY(canvas, y);
    
    // 绘制垂线到x轴
    ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, toCanvasY(canvas, 0));
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 切点标记
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('x', px, py);
    
    // 显示切线斜率p
    ctx.fillStyle = '#e74c3c';
    ctx.font = '14px Arial';
    const pTextX = toCanvasX(canvas, x + 0.3);
    const pTextY = toCanvasY(canvas, y + 0.5);
    ctx.fillText(`p = ${p.toFixed(2)}`, pTextX, pTextY);
    
    // 绘制切线与y轴的截距
    const yIntercept = y - p * x;
    const x0 = toCanvasX(canvas, 0);
    if (yIntercept > PLOT_RANGE.yMin && yIntercept < PLOT_RANGE.yMax) {
        const interceptY = toCanvasY(canvas, yIntercept);
        ctx.fillStyle = '#9b59b6';
        ctx.beginPath();
        ctx.arc(x0, interceptY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('-g(p)', x0, interceptY);
    }
    
    return { p, y, yIntercept };
}

// 绘制勒让德变换过程图
function drawTransformProcess(ctx, canvas, x, func, df) {
    const y = func(x);
    const p = df(x);
    const g = x * p - y;
    
    // 清除并重新绘制
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas);
    
    // 绘制变换后的函数曲线
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const pRange = currentFunc.pRange;
    const [pMin, pMax] = pRange;
    const steps = 200;
    const dp = (pMax - pMin) / steps;
    let started = false;
    
    for (let i = 0; i <= steps; i++) {
        const pVal = pMin + i * dp;
        const gVal = currentFunc.g(pVal);
        
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
    
    // 绘制当前变换点
    const gx = toCanvasX(canvas, p);
    const gy = toCanvasY(canvas, g);
    
    // 从变换点到x轴的垂线
    ctx.strokeStyle = 'rgba(46, 204, 113, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, toCanvasY(canvas, 0));
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 变换点标记
    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.arc(gx, gy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('g(p)', gx, gy);
    
    // 显示坐标
    ctx.fillStyle = '#27ae60';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`p = ${p.toFixed(2)}`, gx + 15, gy - 15);
    ctx.fillText(`g(p) = ${g.toFixed(2)}`, gx + 15, gy);
    
    // 绘制变换公式说明
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`g(p) = x·p - f(x)`, canvas.width / 2, 30);
    ctx.font = '14px Arial';
    ctx.fillText(`= ${x.toFixed(2)} × ${p.toFixed(2)} - ${y.toFixed(2)} = ${g.toFixed(2)}`, canvas.width / 2, 55);
    
    return { p, g };
}

// 更新信息显示
function updateInfo(x, p, g) {
    currentX.textContent = x.toFixed(3);
    currentP.textContent = p.toFixed(3);
    currentG.textContent = g.toFixed(3);
    currentIntercept.textContent = (-g).toFixed(3);
}

// 渲染所有内容
function render() {
    // 清空画布
    ctx1.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
    
    // 绘制原函数图
    drawGrid(ctx1, originalCanvas);
    drawFunction(ctx1, originalCanvas, currentFunc.f, currentFunc.displayX);
    const { p, yIntercept } = drawTangent(ctx1, originalCanvas, currentXValue, currentFunc.f, currentFunc.df);
    
    // 绘制变换过程图
    const { g } = drawTransformProcess(ctx2, transformCanvas, currentXValue, currentFunc.f, currentFunc.df);
    
    // 更新信息
    updateInfo(currentXValue, p, g);
}

// 处理鼠标移动
function handleMouseMove(e) {
    if (!isDragging) return;
    
    const rect = originalCanvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let x = fromCanvasX(originalCanvas, px);
    
    // 限制x在当前函数的显示范围内
    const [xMin, xMax] = currentFunc.displayX;
    x = Math.max(xMin + 0.01, Math.min(xMax - 0.01, x));
    
    currentXValue = x;
    render();
}

// 初始化
function init() {
    // 初始渲染
    render();
    
    // 事件监听
    originalCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        handleMouseMove(e);
    });
    
    document.addEventListener('mousemove', handleMouseMove);
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // 触摸事件支持
    originalCanvas.addEventListener('touchstart', (e) => {
        isDragging = true;
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
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
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
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // 函数选择变化
    functionSelect.addEventListener('change', (e) => {
        currentFunc = functions[e.target.value];
        currentXValue = 1;
        render();
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

// 窗口大小变化时重新渲染
window.addEventListener('resize', render);