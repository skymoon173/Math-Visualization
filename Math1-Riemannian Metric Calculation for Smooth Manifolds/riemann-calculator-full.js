// 黎曼度量计算器类
class RiemannCalculator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.manifolds = {
            // 2维流形
            sphere: this.sphereParametrization.bind(this),
            torus: this.torusParametrization.bind(this),
            hyperboloid: this.hyperboloidParametrization.bind(this),
            plane: this.planeParametrization.bind(this),
            cylinder: this.cylinderParametrization.bind(this),
            cone: this.coneParametrization.bind(this),
            mobius: this.mobiusParametrization.bind(this),
            klein: this.kleinParametrization.bind(this),
            paraboloid: this.paraboloidParametrization.bind(this),
            ellipsoid: this.ellipsoidParametrization.bind(this),
            sphere3D: this.sphere3DParametrization.bind(this),
            // 1维流形
            circle: this.circleParametrization.bind(this),
            line: this.lineParametrization.bind(this),
            helix: this.helixParametrization.bind(this)
        };
        
        this.manifoldDescriptions = {
            // 2维流形
            sphere: '球面是最基本的闭合曲面，所有点到球心的距离相等。在微分几何中，球面具有常高斯曲率 $K = 1/R^2$，是研究黎曼几何的重要例子。',
            torus: '环面可以看作是一个圆绕其平面内且不与其相交的轴旋转而成。它是零亏格的可定向闭合曲面，具有不同的曲率分布。',
            hyperboloid: '双曲面是二次曲面的一种，具有负高斯曲率。它分为单叶双曲面和双叶双曲面，在几何和物理中有重要应用。',
            plane: '欧几里得平面是最简单的二维流形，具有零曲率。它是所有其他曲面在局部近似的"平坦"参考。',
            cylinder: '圆柱面是可展曲面之一，可以展开成平面而不产生拉伸或压缩。它的高斯曲率处处为零。',
            cone: '圆锥面除了顶点外是高斯曲率为零的可展曲面。在顶点处存在奇异性，曲率趋于无穷大。',
            mobius: '莫比乌斯带是最著名的非定向曲面之一。它只有一个面和一条边界，在微分几何中用于研究定向性问题。',
            klein: '克莱因瓶是一种闭合的非定向二维流形，不能在三维空间中不自交地嵌入。它是莫比乌斯带的更高维推广。',
            paraboloid: '抛物面是抛物线绕其轴旋转而成的曲面，在光学和天线设计中有很多应用。它具有变化的高斯曲率。',
            ellipsoid: '椭球面是球面的推广，具有三个不同的主轴。它在局部具有正高斯曲率，但在某些点可能是双曲的。',
            sphere3D: '3维球面是嵌入4D欧几里得空间的3维流形，所有点到球心的距离相等。它是研究高维微分几何的重要例子，在物理中也有应用。',
            // 1维流形
            circle: '圆是最简单的闭合1维流形（曲线）。它是嵌入2D平面的闭合曲线，具有常曲率。在黎曼几何中，圆是研究1维黎曼流形的基础例子。',
            line: '直线是最简单的1维流形，具有零曲率。它是欧几里得1维空间的模型，在局部几何中作为参考标准。',
            helix: '螺旋线是圆在垂直方向上的螺旋延伸，具有常曲率但非平面。它展示了1维流形如何在3D空间中嵌入，同时保持其几何性质。'
        };
    }

    // 平面参数化
    planeParametrization(u, v) {
        return {
            x: u * 4 - 2,
            y: v * 4 - 2,
            z: 0
        };
    }

    // 球面参数化
    sphereParametrization(u, v) {
        const theta = u * Math.PI;
        const phi = v * 2 * Math.PI;
        return {
            x: Math.sin(theta) * Math.cos(phi),
            y: Math.sin(theta) * Math.sin(phi),
            z: Math.cos(theta)
        };
    }

    // 圆柱面参数化
    cylinderParametrization(u, v) {
        const theta = u * 2 * Math.PI;
        const height = v * 4 - 2;
        return {
            x: Math.cos(theta),
            y: Math.sin(theta),
            z: height
        };
    }

    // 圆锥面参数化
    coneParametrization(u, v) {
        const r = u * 2;
        const theta = v * 2 * Math.PI;
        return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta),
            z: r
        };
    }

    // 环面参数化
    torusParametrization(u, v) {
        const R = 2;
        const r = 1;
        const theta = u * 2 * Math.PI;
        const phi = v * 2 * Math.PI;
        return {
            x: (R + r * Math.cos(phi)) * Math.cos(theta),
            y: (R + r * Math.cos(phi)) * Math.sin(theta),
            z: r * Math.sin(phi)
        };
    }

    // 双曲面参数化
    hyperboloidParametrization(u, v) {
        const r = 1 + u * 2;
        const theta = v * 2 * Math.PI;
        return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta),
            z: u * 2
        };
    }

    // 莫比乌斯带参数化
    mobiusParametrization(u, v) {
        const theta = u * 2 * Math.PI;
        const w = v * 2 - 1;
        return {
            x: (2 + w * Math.cos(theta / 2)) * Math.cos(theta),
            y: (2 + w * Math.cos(theta / 2)) * Math.sin(theta),
            z: w * Math.sin(theta / 2)
        };
    }

    // 克莱因瓶参数化（简化版）
    kleinParametrization(u, v) {
        const theta = u * 2 * Math.PI;
        const phi = v * 2 * Math.PI;
        const r = 2;
        return {
            x: (r + Math.cos(theta / 2) * Math.sin(phi) - Math.sin(theta / 2) * Math.sin(2 * phi)) * Math.cos(theta),
            y: (r + Math.cos(theta / 2) * Math.sin(phi) - Math.sin(theta / 2) * Math.sin(2 * phi)) * Math.sin(theta),
            z: Math.sin(theta / 2) * Math.sin(phi) + Math.cos(theta / 2) * Math.sin(2 * phi)
        };
    }

    // 抛物面参数化
    paraboloidParametrization(u, v) {
        const r = u * 2;
        const theta = v * 2 * Math.PI;
        return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta),
            z: r * r
        };
    }

    // 椭球面参数化
    ellipsoidParametrization(u, v) {
        const theta = u * Math.PI;
        const phi = v * 2 * Math.PI;
        const a = 2, b = 1.5, c = 1;
        return {
            x: a * Math.sin(theta) * Math.cos(phi),
            y: b * Math.sin(theta) * Math.sin(phi),
            z: c * Math.cos(theta)
        };
    }
    
    // 3维球面参数化（嵌入4D空间的3D球面，使用3D投影显示）
    sphere3DParametrization(u, v) {
        const theta = u * Math.PI;
        const phi = v * 2 * Math.PI;
        const r = 1;
        // 3D球面嵌入4D空间，这里使用3D投影显示
        return {
            x: r * Math.sin(theta) * Math.cos(phi),
            y: r * Math.sin(theta) * Math.sin(phi),
            z: r * Math.cos(theta)
        };
    }

    // 1维流形参数化函数

    // 圆参数化（1维）
    circleParametrization(u, v = 0) {
        const theta = u * 2 * Math.PI;
        return {
            x: Math.cos(theta),
            y: Math.sin(theta),
            z: 0
        };
    }

    // 直线参数化（1维）
    lineParametrization(u, v = 0) {
        return {
            x: u * 4 - 2, // 从-2到2的直线
            y: 0,
            z: 0
        };
    }

    // 螺旋线参数化（1维）
    helixParametrization(u, v = 0) {
        const t = u * 4 * Math.PI; // 两圈螺旋
        const radius = 1;
        const pitch = 0.5;
        return {
            x: radius * Math.cos(t),
            y: radius * Math.sin(t),
            z: pitch * t / (2 * Math.PI) // 每圈上升pitch单位
        };
    }

    // 计算偏导数 ∂σ/∂u
    partialU(func, u, v, h = 1e-6) {
        const point1 = func(u + h, v);
        const point2 = func(u - h, v);
        return {
            x: (point1.x - point2.x) / (2 * h),
            y: (point1.y - point2.y) / (2 * h),
            z: (point1.z - point2.z) / (2 * h)
        };
    }

    // 计算偏导数 ∂σ/∂v
    partialV(func, u, v, h = 1e-6) {
        const point1 = func(u, v + h);
        const point2 = func(u, v - h);
        return {
            x: (point1.x - point2.x) / (2 * h),
            y: (point1.y - point2.y) / (2 * h),
            z: (point1.z - point2.z) / (2 * h)
        };
    }

    // 计算点积
    dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    // 计算叉积
    cross(v1, v2) {
        return {
            x: v1.y * v2.z - v1.z * v2.y,
            y: v1.z * v2.x - v1.x * v2.z,
            z: v1.x * v2.y - v1.y * v2.x
        };
    }

    // 计算向量长度
    vectorLength(v) {
        return Math.sqrt(this.dot(v, v));
    }

    // 计算度量张量的分量
    calculateMetricTensor(manifoldType, u, v) {
        const paramFunc = this.manifolds[manifoldType];
        if (!paramFunc) {
            throw new Error(`未知的流形类型: ${manifoldType}`);
        }

        // 判断是否为1维流形
        const oneDimensionalManifolds = ['circle', 'line', 'helix'];
        const isOneDimensional = oneDimensionalManifolds.includes(manifoldType);

        const steps = [];
        steps.push({ title: "步骤1: 参数化映射", content: this.getParametrizationDetails(manifoldType, u, v) });

        const point = paramFunc(u, v);

        if (isOneDimensional) {
            // 1维流形的计算逻辑
            steps.push({ title: "步骤2: 计算偏导数（基向量）", content: this.getPartialDerivativeDetails(paramFunc, u, v, 1) });

            const e1 = this.partialU(paramFunc, u, v);
            steps.push({ title: "步骤3: 计算基向量分量", content: this.getBasisVectorDetails1D(e1) });

            const g11 = this.dot(e1, e1);
            steps.push({ title: "步骤4: 计算度量张量分量 g_ij", content: this.getMetricComponentsDetails1D(g11, e1) });

            const det = g11; // 1维流形的"行列式"就是g11
            steps.push({ title: "步骤5: 计算几何性质", content: this.getDeterminantDetails1D(g11, det) });

            return {
                matrix: [[g11]], // 1x1矩阵
                basisVectors: { e1 },
                det: det,
                steps: steps,
                point: point,
                dimension: 1
            };
        } else {
            // 2维流形的计算逻辑
            steps.push({ title: "步骤2: 计算偏导数（基向量）", content: this.getPartialDerivativeDetails(paramFunc, u, v, 2) });

            const e1 = this.partialU(paramFunc, u, v);
            const e2 = this.partialV(paramFunc, u, v);
            steps.push({ title: "步骤3: 计算基向量分量", content: this.getBasisVectorDetails(e1, e2) });

            const g11 = this.dot(e1, e1);
            const g12 = this.dot(e1, e2);
            const g21 = g12;
            const g22 = this.dot(e2, e2);
            steps.push({ title: "步骤4: 计算度量张量分量 g_ij", content: this.getMetricComponentsDetails(g11, g12, g22, e1, e2) });

            const det = g11 * g22 - g12 * g12;
            steps.push({ title: "步骤5: 计算行列式和几何性质", content: this.getDeterminantDetails(g11, g12, g22, det) });

            return {
                matrix: [[g11, g12], [g21, g22]],
                basisVectors: { e1, e2 },
                det: det,
                steps: steps,
                point: point,
                dimension: 2
            };
        }
    }

    // 获取参数化映射的详细信息
    getParametrizationDetails(manifoldType, u, v) {
        const paramFunc = this.manifolds[manifoldType];
        if (!paramFunc) {
            throw new Error(`未知的流形类型: ${manifoldType}`);
        }

        const point = paramFunc(u, v);
        const manifoldNames = {
            // 一维流形
            circle: "圆",
            line: "直线",
            helix: "螺旋线",
            // 二维流形
            sphere: "球面",
            torus: "环面",
            hyperboloid: "双曲面",
            plane: "平面",
            cylinder: "圆柱面",
            cone: "圆锥面",
            mobius: "莫比乌斯带",
            klein: "克莱因瓶",
            paraboloid: "抛物面",
            ellipsoid: "椭球面",
            sphere3D: "3维球面"
        };

        let calculationSteps = "";
        const formatNum = (num) => this.formatNumber(num);
        
        // 判断是否为1维流形
        const oneDimensionalManifolds = ['circle', 'line', 'helix'];
        const isOneDimensional = oneDimensionalManifolds.includes(manifoldType);

        // 根据流形类型生成具体计算步骤
        if (manifoldType === 'circle') {
            calculationSteps = `
                <strong>具体计算步骤:</strong><br>
                1. 参数化映射公式: $\\sigma(u) = \\left( \\cos(2\\pi u), \\sin(2\\pi u), 0 \\right)$<br>
                2. 代入参数值: u = ${formatNum(u)}<br>
                3. 计算中间值:<br>
                   - $2\\pi u = 2\\pi \\times ${formatNum(u)} = ${formatNum(2 * Math.PI * u)}$<br>
                   - $\\cos(2\\pi u) = \\cos(${formatNum(2 * Math.PI * u)}) = ${formatNum(Math.cos(2 * Math.PI * u))}$<br>
                   - $\\sin(2\\pi u) = \\sin(${formatNum(2 * Math.PI * u)}) = ${formatNum(Math.sin(2 * Math.PI * u))}$<br>
                4. 计算坐标值:<br>
                   - $x = \\cos(2\\pi u) = ${formatNum(Math.cos(2 * Math.PI * u))} = ${formatNum(point.x)}$<br>
                   - $y = \\sin(2\\pi u) = ${formatNum(Math.sin(2 * Math.PI * u))} = ${formatNum(point.y)}$<br> 
                   - $z = 0$<br>`;
        } else if (manifoldType === 'line') {
            calculationSteps = `
                <strong>具体计算步骤:</strong><br>
                1. 参数化映射公式: $\\sigma(u) = \\left( u \\times 4 - 2, 0, 0 \\right)$<br>
                2. 代入参数值: u = ${formatNum(u)}<br>
                3. 计算坐标值:<br>
                   - $x = u \\times 4 - 2 = ${formatNum(u)} \\times 4 - 2 = ${formatNum(point.x)}$<br>
                   - $y = 0$<br>
                   - $z = 0$<br>`;
        } else if (manifoldType === 'helix') {
            calculationSteps = `
                <strong>具体计算步骤:</strong><br>
                1. 参数化映射公式: $\\sigma(u) = \\left( \\cos(8\\pi u), \\sin(8\\pi u), 0.125\\pi u \\right)$<br>
                2. 代入参数值: u = ${formatNum(u)}<br>
                3. 计算中间值:<br>
                   - $8\\pi u = 8\\pi \\times ${formatNum(u)} = ${formatNum(8 * Math.PI * u)}$<br>
                   - $0.125\\pi u = 0.125\\pi \\times ${formatNum(u)} = ${formatNum(0.125 * Math.PI * u)}$<br>
                   - $\\cos(8\\pi u) = \\cos(${formatNum(8 * Math.PI * u)}) = ${formatNum(Math.cos(8 * Math.PI * u))}$<br>
                   - $\\sin(8\\pi u) = \\sin(${formatNum(8 * Math.PI * u)}) = ${formatNum(Math.sin(8 * Math.PI * u))}$<br>
                4. 计算坐标值:<br>
                   - $x = \\cos(8\\pi u) = ${formatNum(Math.cos(8 * Math.PI * u))} = ${formatNum(point.x)}$<br>
                   - $y = \\sin(8\\pi u) = ${formatNum(Math.sin(8 * Math.PI * u))} = ${formatNum(point.y)}$<br>
                   - $z = 0.125\\pi u = ${formatNum(0.125 * Math.PI * u)} = ${formatNum(point.z)}$<br>`;
        } else if (manifoldType === 'sphere') {
            calculationSteps = `
                <strong>具体计算步骤:</strong><br>
                1. 参数化映射公式: $\\sigma(u, v) = \\left( R\\sin(u\\pi)\\cos(v\\pi), R\\sin(u\\pi)\\sin(v\\pi), R\\cos(u\\pi) \\right)$ (R=1)<br>
                2. 代入参数值: u = ${formatNum(u)}, v = ${formatNum(v)}<br>
                3. 计算中间值:<br>
                   - $u\\pi = ${formatNum(u)} \\times \\pi = ${formatNum(u * Math.PI)}$<br>
                   - $v\\pi = ${formatNum(v)} \\times \\pi = ${formatNum(v * Math.PI)}$<br>
                   - $\\sin(u\\pi) = \\sin(${formatNum(u * Math.PI)}) = ${formatNum(Math.sin(u * Math.PI))}$<br>
                   - $\\cos(v\\pi) = \\cos(${formatNum(v * Math.PI)}) = ${formatNum(Math.cos(v * Math.PI))}$<br>
                   - $\\sin(v\\pi) = \\sin(${formatNum(v * Math.PI)}) = ${formatNum(Math.sin(v * Math.PI))}$<br>
                   - $\\cos(u\\pi) = \\cos(${formatNum(u * Math.PI)}) = ${formatNum(Math.cos(u * Math.PI))}$<br>
                4. 计算坐标值:<br>
                   - $x = \\sin(u\\pi)\cos(v\\pi) = ${formatNum(Math.sin(u * Math.PI))} \\times ${formatNum(Math.cos(v * Math.PI))} = ${formatNum(point.x)}$<br>
                   - $y = \\sin(u\\pi)\sin(v\\pi) = ${formatNum(Math.sin(u * Math.PI))} \\times ${formatNum(Math.sin(v * Math.PI))} = ${formatNum(point.y)}$<br>
                   - $z = \\cos(u\\pi) = ${formatNum(Math.cos(u * Math.PI))} = ${formatNum(point.z)}$<br>`;
        } else if (manifoldType === 'torus') {
            calculationSteps = `
                <strong>具体计算步骤:</strong><br>
                1. 参数化映射公式: $\\sigma(u, v) = \\left( (R + r\\cos(2\\pi v))\\cos(2\\pi u), (R + r\\cos(2\\pi v))\\sin(2\\pi u), r\\sin(2\\pi v) \\right)$ (R=2, r=1)<br>
                2. 代入参数值: u = ${formatNum(u)}, v = ${formatNum(v)}<br>
                3. 计算中间值:<br>
                   - $2\\pi u = 2\\pi \\times ${formatNum(u)} = ${formatNum(2 * Math.PI * u)}$<br>
                   - $2\\pi v = 2\\pi \\times ${formatNum(v)} = ${formatNum(2 * Math.PI * v)}$<br>
                   - $\\cos(2\\pi v) = \\cos(${formatNum(2 * Math.PI * v)}) = ${formatNum(Math.cos(2 * Math.PI * v))}$<br>
                   - $R + r\\cos(2\\pi v) = 2 + 1 \\times ${formatNum(Math.cos(2 * Math.PI * v))} = ${formatNum(2 + Math.cos(2 * Math.PI * v))}$<br>
                4. 计算坐标值:<br>
                   - $x = (R + r\\cos(2\\pi v))\\cos(2\\pi u) = ${formatNum(2 + Math.cos(2 * Math.PI * v))} \\times ${formatNum(Math.cos(2 * Math.PI * u))} = ${formatNum(point.x)}$<br>
                   - $y = (R + r\\cos(2\\pi v))\\sin(2\\pi u) = ${formatNum(2 + Math.cos(2 * Math.PI * v))} \\times ${formatNum(Math.sin(2 * Math.PI * u))} = ${formatNum(point.y)}$<br>
                   - $z = r\\sin(2\\pi v) = 1 \\times ${formatNum(Math.sin(2 * Math.PI * v))} = ${formatNum(point.z)}$<br>`;
        } else if (manifoldType === 'plane') {
            calculationSteps = `
                <strong>具体计算步骤:</strong><br>
                1. 参数化映射公式: $\\sigma(u, v) = \\left( u \times 4 - 2, v \\times 4 - 2, 0 \right)$<br>
                2. 代入参数值: u = ${formatNum(u)}, v = ${formatNum(v)}<br>
                3. 计算坐标值:<br>
                   - $x = u \\times 4 - 2 = ${formatNum(u)} \times 4 - 2 = ${formatNum(point.x)}$<br>
                   - $y = v \\times 4 - 2 = ${formatNum(v)} \times 4 - 2 = ${formatNum(point.y)}$<br>
                   - $z = 0$<br>`;
        } else if (manifoldType === 'cylinder') {
            calculationSteps = `
                <strong>具体计算步骤:</strong><br>
                1. 参数化映射公式: $\\sigma(u, v) = \\left( \\cos(u \\times 2\\pi), \\sin(u \\times 2\\pi), v \\times 4 - 2 \\right)$<br>
                2. 代入参数值: u = ${formatNum(u)}, v = ${formatNum(v)}<br>
                3. 计算中间值:<br>
                   - $u \\times 2\\pi = ${formatNum(u)} \\times 2\\pi = ${formatNum(u * 2 * Math.PI)}$<br>
                   - $\cos(u \\times 2\pi) = \cos(${formatNum(u * 2 * Math.PI)}) = ${formatNum(Math.cos(u * 2 * Math.PI))}$<br>
                   - $\sin(u \\times 2\pi) = \sin(${formatNum(u * 2 * Math.PI)}) = ${formatNum(Math.sin(u * 2 * Math.PI))}$<br>
                4. 计算坐标值:<br>
                   - $x = \\cos(u \\times 2\pi) = ${formatNum(Math.cos(u * 2 * Math.PI))} = ${formatNum(point.x)}$<br>
                   - $y = \\sin(u \\times 2\pi) = ${formatNum(Math.sin(u * 2 * Math.PI))} = ${formatNum(point.y)}$<br>
                   - $z = v \\times 4 - 2 = ${formatNum(v)} \\times 4 - 2 = ${formatNum(point.z)}$<br>`;
        } else {
            calculationSteps = `
                <strong>具体计算步骤:</strong><br>
                1. 使用${manifoldNames[manifoldType]}的参数化映射公式<br>
                2. 代入参数值: u = ${formatNum(u)}, v = ${formatNum(v)}<br>
                3. 计算得到流形点坐标: (x, y, z) = (${formatNum(point.x)}, ${formatNum(point.y)}, ${formatNum(point.z)})`;
        }

        const paramDisplay = isOneDimensional ?
            `<strong>参数值:</strong> u = ${formatNum(u)}<br><br>
             <strong>参数化映射:</strong><br>
             $\\sigma(u) = \\left( ${formatNum(point.x)}, ${formatNum(point.y)}, ${formatNum(point.z)} \\right)$<br><br>` :
            `<strong>参数值:</strong> u = ${formatNum(u)}, v = ${formatNum(v)}<br><br>
             <strong>参数化映射:</strong><br>
             $\\sigma(u, v) = \\left( ${formatNum(point.x)}, ${formatNum(point.y)}, ${formatNum(point.z)} \\right)$<br><br>`;

        return `<strong>流形类型:</strong> ${manifoldNames[manifoldType]} (${manifoldType})<br><br>
                ${paramDisplay}
                <strong>点的位置:</strong> (x, y, z) = (${formatNum(point.x)}, ${formatNum(point.y)}, ${formatNum(point.z)})<br><br>
                ${calculationSteps}`;
    }

    // 获取偏导数的详细信息
    getPartialDerivativeDetails(paramFunc, u, v, dimension = 2) {
        const e1 = this.partialU(paramFunc, u, v);
        const e2 = this.partialV(paramFunc, u, v);
        
        // 计算切空间的具体步骤
        const h = 1e-6;
        const point = paramFunc(u, v);
        const pointUPlus = paramFunc(u + h, v);
        const pointUMinus = paramFunc(u - h, v);
        const pointVPlus = paramFunc(u, v + h);
        const pointVMinus = paramFunc(u, v - h);
        
        const formatNum = (num) => this.formatNumber(num);
        
        // 根据维度选择基向量HTML
        let basisVectorsHTML = '';
        let centerDifferenceHTML = '';
        let spanHTML = '';
        let calculationHTML = '';
        let dimensionHTML = '';
        let innerProductHTML = '';
        
        if (dimension === 1) {
            basisVectorsHTML = `$\\frac{\\partial \\sigma}{\\partial u} = \\left( ${formatNum(e1.x)}, ${formatNum(e1.y)}, ${formatNum(e1.z)} \\right)$<br><br>`;
            centerDifferenceHTML = `$\\frac{\\partial \\sigma}{\\partial u} \\approx \\frac{\\sigma(u+h, v) - \\sigma(u-h, v)}{2h}$<br>`;
            spanHTML = `- 对于一维参数化流形，切空间由单个偏导数张成: $T_p(M) = \\text{span}\\left\\{ \\frac{\\partial \\sigma}{\\partial u} \\right\\}$<br><br>`;
            calculationHTML = `- 计算 $\\sigma(u+h, v) = (${formatNum(pointUPlus.x)}, ${formatNum(pointUPlus.y)}, ${formatNum(pointUPlus.z)})$<br>
                    - 计算 $\\sigma(u-h, v) = (${formatNum(pointUMinus.x)}, ${formatNum(pointUMinus.y)}, ${formatNum(pointUMinus.z)})$<br>
                    - 计算 $\\frac{\\partial \\sigma}{\\partial u} \\approx \\frac{1}{2h} \\left( \\sigma(u+h, v) - \\sigma(u-h, v) \\right) = \\left( ${formatNum(e1.x)}, ${formatNum(e1.y)}, ${formatNum(e1.z)} \\right)$<br><br>`;
            dimensionHTML = `- 切空间的维数等于流形的维数（此处为1维）<br><br>`;
            innerProductHTML = `- 度量张量 $g_{11} = \\left\\langle \\frac{\\partial \\sigma}{\\partial u}, \\frac{\\partial \\sigma}{\\partial u} \\right\\rangle$ 定义了切空间上的内积<br>
                    - 内积用于计算切向量的长度<br>`;
        } else {
            basisVectorsHTML = `$\\frac{\\partial \\sigma}{\\partial u} = \\left( ${formatNum(e1.x)}, ${formatNum(e1.y)}, ${formatNum(e1.z)} \\right)$<br><br>
                    $\\frac{\\partial \\sigma}{\\partial v} = \\left( ${formatNum(e2.x)}, ${formatNum(e2.y)}, ${formatNum(e2.z)} \\right)$<br><br>`;
            centerDifferenceHTML = `$\\frac{\\partial \\sigma}{\\partial u} \\approx \\frac{\\sigma(u+h, v) - \\sigma(u-h, v)}{2h}$<br>
                    $\\frac{\\partial \\sigma}{\\partial v} \\approx \\frac{\\sigma(u, v+h) - \\sigma(u, v-h)}{2h}$<br>`;
            spanHTML = `- 对于二维参数化流形，切空间由两个偏导数张成: $T_p(M) = \\text{span}\\left\\{ \\frac{\\partial \\sigma}{\\partial u}, \\frac{\\partial \\sigma}{\\partial v} \\right\\}$<br><br>`;
            calculationHTML = `- 计算 $\\sigma(u+h, v) = (${formatNum(pointUPlus.x)}, ${formatNum(pointUPlus.y)}, ${formatNum(pointUPlus.z)})$<br>
                    - 计算 $\\sigma(u-h, v) = (${formatNum(pointUMinus.x)}, ${formatNum(pointUMinus.y)}, ${formatNum(pointUMinus.z)})$<br>
                    - 计算 $\\frac{\\partial \\sigma}{\\partial u} \\approx \\frac{1}{2h} \\left( \\sigma(u+h, v) - \\sigma(u-h, v) \\right) = \\left( ${formatNum(e1.x)}, ${formatNum(e1.y)}, ${formatNum(e1.z)} \\right)$<br><br> 
                    - 计算 $\\sigma(u, v+h) = (${formatNum(pointVPlus.x)}, ${formatNum(pointVPlus.y)}, ${formatNum(pointVPlus.z)})$<br>
                    - 计算 $\\sigma(u, v-h) = (${formatNum(pointVMinus.x)}, ${formatNum(pointVMinus.y)}, ${formatNum(pointVMinus.z)})$<br>
                    - 同理计算 $\\frac{\\partial \\sigma}{\\partial v} = \\left( ${formatNum(e2.x)}, ${formatNum(e2.y)}, ${formatNum(e2.z)} \\right)$<br><br>`;
            dimensionHTML = `- 切空间的维数等于流形的维数（此处为2维）<br><br>`;
            innerProductHTML = `- 度量张量 $g_{ij} = \\left\\langle \\frac{\\partial \\sigma}{\\partial u^i}, \\frac{\\partial \\sigma}{\\partial u^j} \\right\\rangle$ 定义了切空间上的内积<br>
                    - 内积用于计算切向量的长度和夹角<br>`;
        }
        
        // 返回完整的HTML内容
        return `<strong>基向量（偏导数）:</strong><br><br>
                ${basisVectorsHTML}
                <strong>计算方法:</strong> 中心差分近似<br>
                $\\frac{\\partial \\sigma}{\\partial u} \\approx \\frac{\\sigma(u+h, v) - \\sigma(u-h, v)}{2h}$<br>
                $\\frac{\\partial \\sigma}{\\partial v} \\approx \\frac{\\sigma(u, v+h) - \\sigma(u, v-h)}{2h}$<br>
                <strong>其中:</strong> h = 1e-6<br><br>
                <strong>从流形点到切空间的映射过程:</strong><br><br>
                <strong>1. 切空间的定义:</strong> 切空间 $T_p(M)$ 是流形 $M$ 在点 $p$ 处的所有切向量组成的向量空间<br><br>
                <strong>2. 基向量的生成:</strong><br>
                - 对于参数化流形，切空间由参数的偏导数张成: $T_p(M) = \\text{span}\\left\\{ \\frac{\\partial \\sigma}{\\partial u}, \\frac{\\partial \\sigma}{\\partial v} \\right\\}$<br><br>
                <strong>3. 具体计算过程:</strong><br>
                - 点 $p = \\sigma(${formatNum(u)}, ${formatNum(v)}) = (${formatNum(point.x)}, ${formatNum(point.y)}, ${formatNum(point.z)})$<br>
                - 计算 $\\sigma(u+h, v) = (${formatNum(pointUPlus.x)}, ${formatNum(pointUPlus.y)}, ${formatNum(pointUPlus.z)})$<br>
                - 计算 $\\sigma(u-h, v) = (${formatNum(pointUMinus.x)}, ${formatNum(pointUMinus.y)}, ${formatNum(pointUMinus.z)})$<br>
                - 计算 $\\frac{\\partial \\sigma}{\\partial u} \\approx \\frac{1}{2h} \\left( \\sigma(u+h, v) - \\sigma(u-h, v) \\right) = \\left( ${formatNum(e1.x)}, ${formatNum(e1.y)}, ${formatNum(e1.z)} \\right)$<br><br>
                - 同理计算 $\\frac{\\partial \\sigma}{\\partial v} = \\left( ${formatNum(e2.x)}, ${formatNum(e2.y)}, ${formatNum(e2.z)} \\right)$<br><br>
                <strong>4. 切空间的几何意义:</strong><br>
                - 切空间在点 $p$ 处与流形相切<br>
                - 切空间中的向量表示流形上的切方向<br>
                - 切空间的维数等于流形的维数（此处为2维）<br><br>
                <strong>5. 度量张量与切空间:</strong><br>
                - 度量张量 $g_{ij} = \\left\\langle \\frac{\\partial \\sigma}{\\partial u^i}, \\frac{\\partial \\sigma}{\\partial u^j} \\right\\rangle$ 定义了切空间上的内积<br>
                - 内积用于计算切向量的长度和夹角<br>
                - 切空间的几何性质完全由度量张量决定`;
    }

    // 获取1维流形基向量的详细信息
    getBasisVectorDetails1D(e1) {
        const len1 = this.vectorLength(e1);

        return `<strong>基向量分量:</strong><br><br>
                <strong>$\\mathbf{e}_1 = \\frac{\\partial \\sigma}{\\partial u}$:</strong><br>
                $x = ${this.formatNumber(e1.x)}, y = ${this.formatNumber(e1.y)}, z = ${this.formatNumber(e1.z)}$<br>
                $\\|\\mathbf{e}_1\\| = ${this.formatNumber(len1)}$<br><br>
                <strong>几何意义:</strong><br>
                - 这是1维切空间的唯一基向量<br>
                - 向量的长度表示该点的速度大小<br>
                - 向量的方向表示曲线在该点的切线方向`;
    }

    // 获取基向量的详细信息
    getBasisVectorDetails(e1, e2) {
        const len1 = this.vectorLength(e1);
        const len2 = this.vectorLength(e2);
        const dot = this.dot(e1, e2);

        return `<strong>基向量分量:</strong><br><br>
                <strong>$\\mathbf{e}_1 = \\frac{\\partial \\sigma}{\\partial u}$:</strong><br>
                $x = ${this.formatNumber(e1.x)}, y = ${this.formatNumber(e1.y)}, z = ${this.formatNumber(e1.z)}$<br>
                $\\|\\mathbf{e}_1\\| = ${this.formatNumber(len1)}$<br><br>
                <strong>$\\mathbf{e}_2 = \\frac{\\partial \\sigma}{\\partial v}$:</strong><br>
                $x = ${this.formatNumber(e2.x)}, y = ${this.formatNumber(e2.y)}, z = ${this.formatNumber(e2.z)}$<br>
                $\\|\\mathbf{e}_2\\| = ${this.formatNumber(len2)}$<br><br>
                <strong>点积:</strong> $\\langle \\mathbf{e}_1, \\mathbf{e}_2 \\rangle = ${this.formatNumber(dot)}$<br>
                <strong>夹角:</strong> $\\theta = ${this.formatNumber(Math.acos(dot / (len1 * len2)) * 180 / Math.PI)}^\\circ$`;
    }

    // 获取1维流形度量张量分量的详细信息
    getMetricComponentsDetails1D(g11, e1) {
        return `<strong>度量张量分量计算公式:</strong><br>
                $g_{11} = \\langle \\frac{\\partial \\sigma}{\\partial u}, \\frac{\\partial \\sigma}{\\partial u} \\rangle$<br><br>
                <strong>计算过程:</strong><br><br>
                $g_{11} = \\langle \\mathbf{e}_1, \\mathbf{e}_1 \\rangle = ${this.formatNumber(e1.x)}^2 + ${this.formatNumber(e1.y)}^2 + ${this.formatNumber(e1.z)}^2 = ${this.formatNumber(g11)}$<br><br>
                <strong>度量张量矩阵:</strong><br>
                $g = \\begin{pmatrix} g_{11} \\end{pmatrix} = \\begin{pmatrix} ${this.formatNumber(g11)} \\end{pmatrix}$<br><br>
                <strong>几何意义:</strong><br>
                - $g_{11}$ 表示1维流形上该点的速度大小的平方<br>
                - 它是弧长参数化时的局部长度元素`;
    }

    // 获取度量张量分量的详细信息
    getMetricComponentsDetails(g11, g12, g22, e1, e2) {
        return `<strong>度量张量分量计算公式:</strong><br>
                $g_{ij} = \\langle \\frac{\\partial \\sigma}{\\partial u^i}, \\frac{\\partial \\sigma}{\\partial u^j} \\rangle$<br><br>
                <strong>计算过程:</strong><br><br>
                $g_{11} = \\langle \\mathbf{e}_1, \\mathbf{e}_1 \\rangle = ${this.formatNumber(e1.x)}^2 + ${this.formatNumber(e1.y)}^2 + ${this.formatNumber(e1.z)}^2 = ${this.formatNumber(g11)}$<br><br>
                $g_{12} = g_{21} = \\langle \\mathbf{e}_1, \\mathbf{e}_2 \\rangle = ${this.formatNumber(e1.x)} \\cdot ${this.formatNumber(e2.x)} + ${this.formatNumber(e1.y)} \\cdot ${this.formatNumber(e2.y)} + ${this.formatNumber(e1.z)} \\cdot ${this.formatNumber(e2.z)} = ${this.formatNumber(g12)}$<br><br>
                $g_{22} = \\langle \\mathbf{e}_2, \\mathbf{e}_2 \\rangle = ${this.formatNumber(e2.x)}^2 + ${this.formatNumber(e2.y)}^2 + ${this.formatNumber(e2.z)}^2 = ${this.formatNumber(g22)}$<br><br>
                <strong>度量张量矩阵:</strong><br>
                $g = \\begin{pmatrix} g_{11} & g_{12} \\\\ g_{21} & g_{22} \\end{pmatrix} = \\begin{pmatrix} ${this.formatNumber(g11)} & ${this.formatNumber(g12)} \\\\ ${this.formatNumber(g12)} & ${this.formatNumber(g22)} \\end{pmatrix}$`;
    }

    // 获取1维流形几何性质的详细信息
    getDeterminantDetails1D(g11, det) {
        const arcLengthElement = Math.sqrt(det);

        return `<strong>度量张量"行列式":</strong><br>
                对于1维流形，"行列式"就是 $g_{11} = ${this.formatNumber(g11)}$<br><br>
                <strong>弧长元素:</strong><br>
                $ds = \\sqrt{g_{11}} \\; du = ${this.formatNumber(arcLengthElement)} \\; du$<br><br>
                <strong>几何意义:</strong><br>
                - $g_{11} > 0$: 度量张量正定，曲线可定向<br>
                - 弧长元素表示局部长度测量<br>
                - 用于计算曲线长度积分`;
    }

    // 获取行列式和几何性质的详细信息
    getDeterminantDetails(g11, g12, g22, det) {
        const volumeElement = Math.sqrt(det);

        return `<strong>度量张量行列式:</strong><br>
                $\\det(g) = g_{11}g_{22} - g_{12}^2 = ${this.formatNumber(g11)} \\cdot ${this.formatNumber(g22)} - (${this.formatNumber(g12)})^2 = ${this.formatNumber(det)}$<br><br>
                <strong>体积元素:</strong><br>
                $dV = \\sqrt{\\det(g)} \\; du dv = ${this.formatNumber(volumeElement)} \\; du dv$<br><br>
                <strong>几何意义:</strong><br>
                ${det > 0 ? '\\det(g) > 0: 度量张量正定，曲面可定向' : '\\det(g) < 0: 度量张量不定，曲面不可定向'}<br>
                ${volumeElement > 0 ? '体积元素为正，适合积分计算' : '体积元素为负，需要调整参数化'}`;
    }

    // 计算第二基本形式
    calculateSecondFundamentalForm(manifoldType, u, v) {
        const paramFunc = this.manifolds[manifoldType];
        if (!paramFunc) {
            throw new Error(`未知的流形类型: ${manifoldType}`);
        }

        // 判断是否为1维流形
        const oneDimensionalManifolds = ['circle', 'line', 'helix'];
        if (oneDimensionalManifolds.includes(manifoldType)) {
            // 1维流形没有第二基本形式
            return {
                matrix: [[0]],
                normal: null
            };
        }

        // 计算基向量
        const e1 = this.partialU(paramFunc, u, v);
        const e2 = this.partialV(paramFunc, u, v);

        // 计算单位法向量
        const crossProduct = this.cross(e1, e2);
        const normal = this.normalize(crossProduct);

        // 计算基向量的二阶偏导数
        const e11 = this.partialSecondDerivative(paramFunc, u, v, 'uu');
        const e12 = this.partialSecondDerivative(paramFunc, u, v, 'uv');
        const e22 = this.partialSecondDerivative(paramFunc, u, v, 'vv');

        // 计算第二基本形式的分量
        const L = this.dot(normal, e11);
        const M = this.dot(normal, e12);
        const N = this.dot(normal, e22);

        return {
            matrix: [[L, M], [M, N]],
            normal: normal
        };
    }

    // 计算二阶偏导数
    partialSecondDerivative(func, u, v, type, h = 1e-6) {
        switch(type) {
            case 'uu':
                const point1_uu = func(u + h, v);
                const point2_uu = func(u, v);
                const point3_uu = func(u - h, v);
                return {
                    x: (point1_uu.x - 2 * point2_uu.x + point3_uu.x) / (h * h),
                    y: (point1_uu.y - 2 * point2_uu.y + point3_uu.y) / (h * h),
                    z: (point1_uu.z - 2 * point2_uu.z + point3_uu.z) / (h * h)
                };
            case 'uv':
            case 'vu':
                const point1_uv = func(u + h, v + h);
                const point2_uv = func(u + h, v - h);
                const point3_uv = func(u - h, v + h);
                const point4_uv = func(u - h, v - h);
                return {
                    x: (point1_uv.x - point2_uv.x - point3_uv.x + point4_uv.x) / (4 * h * h),
                    y: (point1_uv.y - point2_uv.y - point3_uv.y + point4_uv.y) / (4 * h * h),
                    z: (point1_uv.z - point2_uv.z - point3_uv.z + point4_uv.z) / (4 * h * h)
                };
            case 'vv':
                const point1_vv = func(u, v + h);
                const point2_vv = func(u, v);
                const point3_vv = func(u, v - h);
                return {
                    x: (point1_vv.x - 2 * point2_vv.x + point3_vv.x) / (h * h),
                    y: (point1_vv.y - 2 * point2_vv.y + point3_vv.y) / (h * h),
                    z: (point1_vv.z - 2 * point2_vv.z + point3_vv.z) / (h * h)
                };
            default:
                throw new Error(`未知的二阶偏导数类型: ${type}`);
        }
    }

    // 向量归一化
    normalize(v) {
        const length = this.vectorLength(v);
        if (length < 1e-10) {
            return { x: 0, y: 0, z: 1 };
        }
        return {
            x: v.x / length,
            y: v.y / length,
            z: v.z / length
        };
    }

    // 计算高斯曲率
    calculateGaussianCurvature(manifoldType, u, v) {
        const firstFF = this.calculateMetricTensor(manifoldType, u, v);

        if (firstFF.dimension === 1) {
            // 1维流形的高斯曲率没有定义，返回0
            return 0;
        }

        const secondFF = this.calculateSecondFundamentalForm(manifoldType, u, v);

        const g = firstFF.matrix;
        const II = secondFF.matrix;

        const E = g[0][0], F = g[0][1], G = g[1][1];
        const L = II[0][0], M = II[0][1], N = II[1][1];

        const numerator = L * N - M * M;
        const denominator = E * G - F * F;
        const K = denominator !== 0 ? numerator / denominator : 0;

        return K;
    }

    // 计算平均曲率
    calculateMeanCurvature(manifoldType, u, v) {
        const firstFF = this.calculateMetricTensor(manifoldType, u, v);

        if (firstFF.dimension === 1) {
            // 1维流形的平均曲率没有定义，返回0
            return 0;
        }

        const secondFF = this.calculateSecondFundamentalForm(manifoldType, u, v);

        const g = firstFF.matrix;
        const II = secondFF.matrix;

        const E = g[0][0], F = g[0][1], G = g[1][1];
        const L = II[0][0], M = II[0][1], N = II[1][1];

        const numerator = E * N - 2 * F * M + G * L;
        const denominator = 2 * (E * G - F * F);
        const H = denominator !== 0 ? numerator / denominator : 0;

        return H;
    }

    // 计算克里斯托弗符号 (简化版本)
    calculateChristoffelSymbols(manifoldType, u, v) {
        const firstFF = this.calculateMetricTensor(manifoldType, u, v);
        const g = firstFF.matrix;

        if (firstFF.dimension === 1) {
            // 1维流形只有一个克里斯托弗符号
            return {
                g111: 0  // 对于1维流形，Γ^1_11 = 0（常曲率曲线）
            };
        }

        const E = g[0][0], F = g[0][1], G = g[1][1];

        // 计算度量张量的偏导数的近似值
        const dE_du = this.partialUDerivative(manifoldType, u, v, 'E');
        const dE_dv = this.partialVDerivative(manifoldType, u, v, 'E');
        const dF_du = this.partialUDerivative(manifoldType, u, v, 'F');
        const dF_dv = this.partialVDerivative(manifoldType, u, v, 'F');
        const dG_du = this.partialUDerivative(manifoldType, u, v, 'G');
        const dG_dv = this.partialVDerivative(manifoldType, u, v, 'G');

        // 计算部分克里斯托弗符号
        const g111 = 0.5 * (dE_du + dE_du - dE_du) / E;
        const g112 = 0.5 * (dE_dv + dF_du - dE_dv) / E;
        const g121 = g112;
        const g122 = 0.5 * (dG_du + dF_dv - dE_dv) / E;
        const g211 = 0.5 * (dF_du + dE_dv - dF_du) / G;
        const g212 = 0.5 * (dG_du + dG_dv - dF_dv) / G;
        const g221 = g212;
        const g222 = 0.5 * (dG_dv + dG_dv - dG_dv) / G;

        return {
            g111: g111, g112: g112, g121: g121, g122: g122,
            g211: g211, g212: g212, g221: g221, g222: g222
        };
    }

    // 计算度量张量分量的u偏导数
    partialUDerivative(manifoldType, u, v, component) {
        const h = 1e-6;
        const tensor1 = this.calculateMetricTensor(manifoldType, u + h, v);
        const tensor2 = this.calculateMetricTensor(manifoldType, u - h, v);
        let valPlus, valMinus;
        
        switch(component) {
            case 'E':
                valPlus = tensor1.matrix[0][0];
                valMinus = tensor2.matrix[0][0];
                break;
            case 'F':
                valPlus = tensor1.matrix[0][1];
                valMinus = tensor2.matrix[0][1];
                break;
            case 'G':
                valPlus = tensor1.matrix[1][1];
                valMinus = tensor2.matrix[1][1];
                break;
            default:
                return 0;
        }
        
        return (valPlus - valMinus) / (2 * h);
    }

    // 计算度量张量分量的v偏导数
    partialVDerivative(manifoldType, u, v, component) {
        const h = 1e-6;
        const tensor1 = this.calculateMetricTensor(manifoldType, u, v + h);
        const tensor2 = this.calculateMetricTensor(manifoldType, u, v - h);
        let valPlus, valMinus;
        
        switch(component) {
            case 'E':
                valPlus = tensor1.matrix[0][0];
                valMinus = tensor2.matrix[0][0];
                break;
            case 'F':
                valPlus = tensor1.matrix[0][1];
                valMinus = tensor2.matrix[0][1];
                break;
            case 'G':
                valPlus = tensor1.matrix[1][1];
                valMinus = tensor2.matrix[1][1];
                break;
            default:
                return 0;
        }
        
        return (valPlus - valMinus) / (2 * h);
    }

    // 计算张量积
    calculateTensorProduct(matrix) {
        if (matrix.length === 1) {
            // 1维流形的情况
            return [[[matrix[0][0] * matrix[0][0]]]];
        } else {
            // 2维流形的情况 - 计算2x2矩阵与自身的张量积 (Kronecker积)
            const tensorProduct = [
                [[matrix[0][0] * matrix[0][0], matrix[0][0] * matrix[0][1]],
                 [matrix[0][0] * matrix[1][0], matrix[0][0] * matrix[1][1]]],
                [[matrix[0][1] * matrix[0][0], matrix[0][1] * matrix[0][1]],
                 [matrix[0][1] * matrix[1][0], matrix[0][1] * matrix[1][1]]],
                [[matrix[1][0] * matrix[0][0], matrix[1][0] * matrix[0][1]],
                 [matrix[1][0] * matrix[1][0], matrix[1][0] * matrix[1][1]]],
                [[matrix[1][1] * matrix[0][0], matrix[1][1] * matrix[0][1]],
                 [matrix[1][1] * matrix[1][0], matrix[1][1] * matrix[1][1]]]
            ];
            return tensorProduct;
        }
    }
    
    // 计算外积 (楔积) - 用于2-形式
    calculateWedgeProduct(e1, e2) {
        // 计算两个1-形式的外积，得到2-形式
        // (e1 ∧ e2)(u, v) = e1(u)e2(v) - e1(v)e2(u)
        // 这里返回相应的矩阵表示
        const wedgeMatrix = [
            [0, this.dot(e1, e2)],
            [-this.dot(e1, e2), 0]
        ];
        return wedgeMatrix;
    }
    
    // 计算逆变张量（度量张量的逆）
    calculateInverseMetric(g) {
        // 计算2x2矩阵的逆
        const det = g[0][0] * g[1][1] - g[0][1] * g[1][0];
        if (Math.abs(det) < 1e-10) {
            throw new Error('度量张量不可逆（行列式为零）');
        }
        
        const inverse = [
            [g[1][1]/det, -g[0][1]/det],
            [-g[1][0]/det, g[0][0]/det]
        ];
        
        return inverse;
    }
    
    // 计算张量的迹
    calculateTrace(g) {
        if (g.length === 1) {
            // 1维流形的情况
            return g[0][0];
        } else {
            // 2维流形的情况
            return g[0][0] + g[1][1];  // 对角线元素之和
        }
    }
    
    // 计算张量的范数
    calculateTensorNorm(tensor) {
        // 对于2x2张量，计算Frobenius范数
        let sum = 0;
        for (let i = 0; i < tensor.length; i++) {
            for (let j = 0; j < tensor[i].length; j++) {
                sum += tensor[i][j] * tensor[i][j];
            }
        }
        return Math.sqrt(sum);
    }
    
    // 计算黎曼曲率张量的某些分量（简化版）
    calculateRiemannCurvature(manifoldType, u, v) {
        const firstFF = this.calculateMetricTensor(manifoldType, u, v);

        if (firstFF.dimension === 1) {
            // 1维流形的黎曼曲率张量是平凡的
            return {
                tensor: [[[0]]],  // 1维情况下的平凡张量
                scalarCurvature: 0,  // 1维流形的数量曲率为0
                ricciTensor: [[0]]  // 1维里奇张量
            };
        }

        // 使用高斯方程计算曲率张量的简化版本
        // 对于二维曲面，黎曼曲率张量只有一个独立分量
        const gaussianCurvature = this.calculateGaussianCurvature(manifoldType, u, v);

        // 黎曼曲率张量的非零分量
        const R = [
            [[0, 0], [0, gaussianCurvature]],  // R^0_101
            [[0, -gaussianCurvature], [0, 0]]   // R^1_001
        ];

        return {
            tensor: R,
            scalarCurvature: 2 * gaussianCurvature,  // 数量曲率 = 2K
            ricciTensor: [[gaussianCurvature, 0], [0, gaussianCurvature]]  // 里奇张量
        };
    }

    // 格式化数字为固定小数位
    formatNumber(num, decimals = 4) {
        return parseFloat(num.toFixed(decimals));
    }
}

// 3D渲染引擎类
class Engine3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.scale = 80;
        
        this.rotationX = 0.5;
        this.rotationY = 0.5;
        this.autoRotate = true;
        
        this.setupMouseControl();
        this.startAutoRotate();
    }
    
    setupMouseControl() {
        let isDragging = false;
        let lastX = 0, lastY = 0;
        
        this.canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                this.rotationY += deltaX * 0.01;
                this.rotationX += deltaY * 0.01;
                lastX = e.clientX;
                lastY = e.clientY;
                this.autoRotate = false;
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.scale *= e.deltaY > 0 ? 0.95 : 1.05;
        });
    }
    
    startAutoRotate() {
        const rotate = () => {
            if (this.autoRotate) {
                this.rotationY += 0.005;
            }
            requestAnimationFrame(rotate);
        };
        rotate();
    }
    
    project(x, y, z) {
        // 标准的3D旋转实现
        const cosX = Math.cos(this.rotationX);
        const sinX = Math.sin(this.rotationX);
        const cosY = Math.cos(this.rotationY);
        const sinY = Math.sin(this.rotationY);
        
        // 转换为右手坐标系
        let nx = x;
        let ny = y;
        let nz = z;
        
        // 应用X轴旋转
        let ry = ny * cosX - nz * sinX;
        let rz = ny * sinX + nz * cosX;
        ny = ry;
        nz = rz;
        
        // 应用Y轴旋转
        let rx = nx * cosY + nz * sinY;
        rz = -nx * sinY + nz * cosY;
        nx = rx;
        nz = rz;
        
        // 透视投影
        const perspective = 5;
        const factor = perspective / (perspective + nz);
        
        return {
            x: this.centerX + nx * this.scale * factor,
            y: this.centerY - ny * this.scale * factor,
            z: nz,
            factor: factor
        };
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.strokeStyle = 'rgba(100, 149, 237, 0.3)';
        this.ctx.lineWidth = 1;
        
        for (let i = -3; i <= 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.centerY + i * 50);
            this.ctx.lineTo(this.width, this.centerY + i * 50);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX + i * 50, 0);
            this.ctx.lineTo(this.centerX + i * 50, this.height);
            this.ctx.stroke();
        }
    }
    
    drawPoint(x, y, z, color = '#e74c3c', size = 8) {
        const p = this.project(x, y, z);
        const radius = size * p.factor;
        
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, radius * 0.5, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    
    drawLine(x1, y1, z1, x2, y2, z2, color = '#3498db', lineWidth = 2) {
        const p1 = this.project(x1, y1, z1);
        const p2 = this.project(x2, y2, z2);
        
        const avgFactor = (p1.factor + p2.factor) / 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth * avgFactor;
        this.ctx.stroke();
    }
    
    drawMesh(vertices, faces, colors) {
        const projectedVertices = vertices.map(v => this.project(v.x, v.y, v.z));
        
        const sortedFaces = faces.map((face, index) => {
            const zValues = face.map(i => projectedVertices[i].z);
            const avgZ = zValues.reduce((a, b) => a + b, 0) / zValues.length;
            return { indices: face, avgZ, color: colors[index] };
        }).sort((a, b) => a.avgZ - b.avgZ);
        
        sortedFaces.forEach(face => {
            this.ctx.beginPath();
            const start = projectedVertices[face.indices[0]];
            this.ctx.moveTo(start.x, start.y);
            
            for (let i = 1; i < face.indices.length; i++) {
                const p = projectedVertices[face.indices[i]];
                this.ctx.lineTo(p.x, p.y);
            }
            
            this.ctx.closePath();
            
            const alpha = Math.max(0.1, Math.min(0.8, 0.4 + (face.avgZ + 3) / 10));
            this.ctx.fillStyle = face.color.replace('1)', `${alpha})`);
            this.ctx.fill();
            this.ctx.strokeStyle = `rgba(100, 149, 237, ${alpha})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }
    
    drawSurface(paramFunc, uRange, vRange, uSteps, vSteps, colorFunc) {
        const vertices = [];
        const faces = [];
        const colors = [];
        
        // 生成顶点网格
        for (let i = 0; i <= uSteps; i++) {
            vertices[i] = [];
            for (let j = 0; j <= vSteps; j++) {
                const u = uRange[0] + (uRange[1] - uRange[0]) * i / uSteps;
                const v = vRange[0] + (vRange[1] - vRange[0]) * j / vSteps;
                const p = paramFunc(u, v);
                vertices[i][j] = p;
            }
        }
        
        // 生成三角形面部（而不是四边形）
        for (let i = 0; i < uSteps; i++) {
            for (let j = 0; j < vSteps; j++) {
                // 计算当前网格单元的四个顶点索引
                const v00 = i * (vSteps + 1) + j;
                const v10 = (i + 1) * (vSteps + 1) + j;
                const v01 = i * (vSteps + 1) + (j + 1);
                const v11 = (i + 1) * (vSteps + 1) + (j + 1);
                
                // 将四边形拆分为两个三角形
                faces.push([v00, v10, v01]);
                faces.push([v10, v11, v01]);
                
                const u = uRange[0] + (uRange[1] - uRange[0]) * i / uSteps;
                const v = vRange[0] + (vRange[1] - vRange[0]) * j / vSteps;
                colors.push(colorFunc(u, v));
                colors.push(colorFunc(u, v)); // 为第二个三角形添加相同颜色
            }
        }
        
        const flatVertices = vertices.flat();
        this.drawMesh(flatVertices, faces, colors);
    }
}

// 保存当前3D场景状态
let current3DState = {
    manifoldType: 'sphere',
    u: 0.5,
    v: 0.5
};

// 添加持续渲染循环
function startRenderLoop() {
    function render() {
        drawManifold3D(current3DState.manifoldType, current3DState.u, current3DState.v);
        requestAnimationFrame(render);
    }
    render();
}

// 绘制1维流形
function draw1DManifold(manifoldType, paramFunc, u) {
    const calculator = new RiemannCalculator('visualizationCanvas');
    const steps = 100;
    const points = [];

    // 生成曲线上的点
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const point = paramFunc(t, 0); // v参数为0，因为是1维
        points.push(point);
    }

    // 绘制曲线
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        engine3D.drawLine(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, '#3498db', 2);
    }

    // 绘制当前点（用户选择的点）
    const currentPoint = paramFunc(u, 0);
    engine3D.drawPoint(currentPoint.x, currentPoint.y, currentPoint.z, '#e74c3c', 8);

    // 绘制切向量
    const e1 = calculator.partialU(paramFunc, u, 0);
    const scale = 0.3;
    engine3D.drawLine(currentPoint.x, currentPoint.y, currentPoint.z,
                     currentPoint.x + e1.x * scale, currentPoint.y + e1.y * scale, currentPoint.z + e1.z * scale,
                     '#e74c3c', 3);
}

// 绘制流形的3D示意
function drawManifold3D(manifoldType, u, v) {
    // 更新当前状态
    current3DState.manifoldType = manifoldType;
    current3DState.u = u;
    current3DState.v = v;
    engine3D.clear();
    
    const calculator = new RiemannCalculator('visualizationCanvas');
    let paramFunc = calculator.manifolds[manifoldType];
    
    // Handle 1D manifolds
    const oneDManifolds = ['circle', 'line', 'helix'];
    if (oneDManifolds.includes(manifoldType)) {
        // 绘制1维流形
        draw1DManifold(manifoldType, paramFunc, u);
        return;
    }
    
    let colorFunc = (u, v) => 'rgba(52, 152, 219, 1)';
    
    switch(manifoldType) {
        case 'sphere':
        case 'ellipsoid':
        case 'sphere3D':
            engine3D.drawSurface(paramFunc, [0, 1], [0, 1], 24, 32, 
                (u, v) => {
                    const k = calculator.calculateGaussianCurvature(manifoldType, u, v);
                    const intensity = Math.min(1, Math.max(0.3, 0.5 + k * 0.5));
                    return `rgba(${Math.floor(100 * intensity)}, ${Math.floor(180 * intensity)}, ${Math.floor(255 * intensity)}, 1)`;
                });
            break;
            
        case 'torus':
            engine3D.drawSurface(paramFunc, [0, 1], [0, 1], 32, 24,
                (u, v) => {
                    const k = calculator.calculateGaussianCurvature('torus', u, v);
                    const intensity = Math.min(1, Math.max(0.3, 0.5 - k * 0.3));
                    return `rgba(${Math.floor(200 * intensity)}, ${Math.floor(120 * intensity)}, ${Math.floor(80 * intensity)}, 1)`;
                });
            break;
            
        case 'cylinder':
            engine3D.drawSurface(paramFunc, [0, 1], [0, 1], 32, 16,
                (u, v) => 'rgba(46, 204, 113, 1)');
            break;
            
        case 'cone':
            engine3D.drawSurface(paramFunc, [0, 1], [0, 1], 32, 16,
                (u, v) => 'rgba(155, 89, 182, 1)');
            break;
            
        case 'plane':
            engine3D.drawSurface(paramFunc, [0, 1], [0, 1], 20, 20,
                (u, v) => 'rgba(149, 165, 166, 1)');
            break;
            
        case 'hyperboloid':
            engine3D.drawSurface(paramFunc, [0, 1], [0, 1], 24, 32,
                (u, v) => {
                    const k = calculator.calculateGaussianCurvature('hyperboloid', u, v);
                    const intensity = Math.min(1, Math.max(0.3, 0.5 + Math.abs(k) * 0.2));
                    return `rgba(${Math.floor(230 * intensity)}, ${Math.floor(126 * intensity)}, ${Math.floor(34 * intensity)}, 1)`;
                });
            break;
            
        case 'paraboloid':
            engine3D.drawSurface(paramFunc, [0, 1], [0, 1], 24, 32,
                (u, v) => {
                    const k = calculator.calculateGaussianCurvature('paraboloid', u, v);
                    const intensity = Math.min(1, Math.max(0.3, 0.5 + Math.abs(k) * 0.1));
                    return `rgba(${Math.floor(241 * intensity)}, ${Math.floor(196 * intensity)}, ${Math.floor(15 * intensity)}, 1)`;
                });
            break;
            
        case 'mobius':
            engine3D.drawSurface(paramFunc, [0, 1], [0, 1], 40, 12,
                (u, v) => 'rgba(231, 76, 60, 1)');
            break;
            
        case 'klein':
            engine3D.drawSurface(paramFunc, [0, 1], [0, 1], 32, 32,
                (u, v) => 'rgba(26, 188, 156, 1)');
            break;
            
        default:
            engine3D.drawSurface(paramFunc, [0, 1], [0, 1], 20, 20,
                (u, v) => 'rgba(149, 165, 166, 1)');
    }
    
    const point = paramFunc(u, v);
    engine3D.drawPoint(point.x, point.y, point.z, '#e74c3c', 10);
    
    // 绘制切向量
    const e1 = calculator.partialU(paramFunc, u, v);
    const e2 = calculator.partialV(paramFunc, u, v);
    
    // 绘制∂/∂u向量（红色）
    const scale = 0.5;
    engine3D.drawLine(point.x, point.y, point.z,
                      point.x + e1.x * scale, point.y + e1.y * scale, point.z + e1.z * scale,
                      '#e74c3c', 3);
    
    // 绘制∂/∂v向量（蓝色）
    engine3D.drawLine(point.x, point.y, point.z,
                      point.x + e2.x * scale, point.y + e2.y * scale, point.z + e2.z * scale,
                      '#3498db', 3);
    
    // 绘制切平面（使用网格表示）
    drawTangentPlane(point, e1, e2);
    
    engine3D.ctx.fillStyle = 'white';
    engine3D.ctx.font = '14px Arial';
    engine3D.ctx.fillText('拖动旋转 | 滚轮缩放', 10, 25);
}

// 绘制切平面的辅助函数
function drawTangentPlane(point, e1, e2) {
    const gridSize = 6;
    const gridScale = 0.2;
    
    // 标准化基向量，确保网格大小一致
    const normE1 = (function normalize(v) {
        const len = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
        return {x: v.x/len, y: v.y/len, z: v.z/len};
    })(e1);
    
    const normE2 = (function normalize(v) {
        const len = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
        return {x: v.x/len, y: v.y/len, z: v.z/len};
    })(e2);
    
    // 生成切平面网格
    for (let i = -gridSize; i <= gridSize; i += 2) {
        for (let j = -gridSize; j <= gridSize; j += 2) {
            // 计算网格点
            const p1 = {
                x: point.x + (normE1.x * i + normE2.x * j) * gridScale,
                y: point.y + (normE1.y * i + normE2.y * j) * gridScale,
                z: point.z + (normE1.z * i + normE2.z * j) * gridScale
            };
            const p2 = {
                x: point.x + (normE1.x * (i + 2) + normE2.x * j) * gridScale,
                y: point.y + (normE1.y * (i + 2) + normE2.y * j) * gridScale,
                z: point.z + (normE1.z * (i + 2) + normE2.z * j) * gridScale
            };
            const p3 = {
                x: point.x + (normE1.x * i + normE2.x * (j + 2)) * gridScale,
                y: point.y + (normE1.y * i + normE2.y * (j + 2)) * gridScale,
                z: point.z + (normE1.z * i + normE2.z * (j + 2)) * gridScale
            };
            
            // 绘制网格线
            engine3D.drawLine(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, 'rgba(255, 255, 255, 0.3)', 1);
            engine3D.drawLine(p1.x, p1.y, p1.z, p3.x, p3.y, p3.z, 'rgba(255, 255, 255, 0.3)', 1);
        }
    }
}

let engine3D;

function initEngine3D() {
    engine3D = new Engine3D('visualizationCanvas');
    const manifoldType = document.getElementById('manifoldType').value;
    const u = parseFloat(document.getElementById('coordU').value) || 0.5;
    const v = parseFloat(document.getElementById('coordV').value) || 0.5;
    drawManifold3D(manifoldType, u, v);
    // 启动渲染循环
    startRenderLoop();
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new RiemannCalculator('visualizationCanvas');
    
    // 获取DOM元素
    const calculateBtn = document.getElementById('calculateBtn');
    const visualizeBtn = document.getElementById('visualizeBtn');
    const manifoldTypeSelect = document.getElementById('manifoldType');
    const metricTensorDisplay = document.getElementById('metricTensorDisplay');
    const basisVectorsDisplay = document.getElementById('basisVectorsDisplay');
    const tensorProductDisplay = document.getElementById('tensorProductDisplay');
    const calculationStepsDisplay = document.getElementById('calculationStepsDisplay');
    const manifoldDescription = document.getElementById('manifoldDescription');
    const christoffelDisplay = document.getElementById('christoffelDisplay');
    const curvatureDisplay = document.getElementById('curvatureDisplay');
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById('tab-' + tabId).classList.add('active');
            
            if (window.MathJax && MathJax.typesetPromise) {
                setTimeout(() => MathJax.typesetPromise(), 100);
            }
        });
    });
    
    // 更新流形说明
    function updateManifoldDescription(manifoldType) {
        if (calculator.manifoldDescriptions[manifoldType]) {
            manifoldDescription.innerHTML = calculator.manifoldDescriptions[manifoldType];
        } else {
            manifoldDescription.textContent = '选择流形类型后查看说明';
        }
        if (window.MathJax && MathJax.typesetPromise) {
            setTimeout(() => MathJax.typesetPromise([manifoldDescription]), 100);
        }
    }
    
    // 流形选择变更事件
    manifoldTypeSelect.addEventListener('change', () => {
        updateManifoldDescription(manifoldTypeSelect.value);

        // 获取坐标值
        const u = parseFloat(document.getElementById('coordU').value) || 0.5;
        const v = parseFloat(document.getElementById('coordV').value) || 0.5;

        drawManifold3D(manifoldTypeSelect.value, u, v);
    });
    
    // 初始化流形说明
    updateManifoldDescription(manifoldTypeSelect.value);
    
    // 计算度量张量事件处理
    calculateBtn.addEventListener('click', () => {
        try {
            const manifoldType = manifoldTypeSelect.value;
            const oneDimensionalManifolds = ['circle', 'line', 'helix'];
            const isOneDimensional = oneDimensionalManifolds.includes(manifoldType);

            // 获取坐标值
            const u = parseFloat(document.getElementById('coordU').value);
            const v = parseFloat(document.getElementById('coordV').value) || 0;

            // 验证坐标值
            if (isNaN(u) || u < 0 || u > 1) {
                alert('u坐标必须是0到1之间的有效数字');
                return;
            }

            if (!isOneDimensional && (isNaN(v) || v < 0 || v > 1)) {
                alert('v坐标必须是0到1之间的有效数字');
                return;
            }
            
            // 计算度量张量
            const result = calculator.calculateMetricTensor(manifoldType, u, v);
            
            // 显示度量张量
            displayMetricTensor(result.matrix, result.dimension || 2);
            
            // 显示基向量
            displayBasisVectors(result.basisVectors, result.dimension || 2);
            
            // 计算并显示张量积
            const tensorProduct = calculator.calculateTensorProduct(result.matrix);
            displayTensorProduct(tensorProduct, result.dimension || 2);
            
            // 显示曲率信息
            displayCurvatureInfo(manifoldType, u, v, result.dimension || 2);
            
            // 显示详细计算步骤
            displayCalculationSteps(result);
            
        } catch (error) {
            console.error('计算错误:', error);
            alert('计算过程中发生错误: ' + error.message);
        }
    });
    
    // 可视化按钮事件处理 - 使用3D引擎
    visualizeBtn.addEventListener('click', () => {
        try {
            const manifoldType = manifoldTypeSelect.value;
            const oneDimensionalManifolds = ['circle', 'line', 'helix'];
            const isOneDimensional = oneDimensionalManifolds.includes(manifoldType);

            // 获取坐标值
            const u = parseFloat(document.getElementById('coordU').value);
            const v = parseFloat(document.getElementById('coordV').value) || 0;

            // 验证坐标值
            if (isNaN(u) || u < 0 || u > 1) {
                alert('u坐标必须是0到1之间的有效数字');
                return;
            }

            if (!isOneDimensional && (isNaN(v) || v < 0 || v > 1)) {
                alert('v坐标必须是0到1之间的有效数字');
                return;
            }
            
            // 使用3D引擎绘制流形
            drawManifold3D(manifoldType, u, v);
            
        } catch (error) {
            console.error('可视化错误:', error);
            alert('可视化过程中发生错误: ' + error.message);
        }
    });
    
    // 显示度量张量的函数
    function displayMetricTensor(matrix, dimension = 2) {
        if (dimension === 1) {
            // 1维流形的情况
            const g11 = matrix[0][0];
            const arcLengthElement = Math.sqrt(g11);

            let html = `<div class="mathjax-equation">
                <strong>度量张量矩阵:</strong><br>
                $$g = \\begin{pmatrix} g_{11} \\end{pmatrix} = \\begin{pmatrix} ${calculator.formatNumber(g11)} \\end{pmatrix}$$<br><br>
                <strong>几何量:</strong><br>
                $$ds = \\sqrt{g_{11}} \\; du = ${calculator.formatNumber(arcLengthElement)} \\; du$$<br><br>
                <strong>意义:</strong> $g_{11}$ 表示弧长参数化时的局部长度元素
            </div>`;
            metricTensorDisplay.innerHTML = html;
        } else {
            // 2维流形的情况
            const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
            const trace = calculator.calculateTrace(matrix);
            const norm = calculator.calculateTensorNorm(matrix);

            let html = `<div class="mathjax-equation">
                <strong>度量张量矩阵:</strong><br>
                $$g = \\begin{pmatrix} g_{11} & g_{12} \\ g_{21} & g_{22} \\end{pmatrix} =
                \\begin{pmatrix} ${calculator.formatNumber(matrix[0][0])} & ${calculator.formatNumber(matrix[0][1])} \\
                ${calculator.formatNumber(matrix[1][0])} & ${calculator.formatNumber(matrix[1][1])} \\end{pmatrix}$$<br><br>
                <strong>不变量:</strong><br>
                $$\\det(g) = ${calculator.formatNumber(det)}, \\quad
                \\operatorname{tr}(g) = ${calculator.formatNumber(trace)}, \\quad
                \\|g\\|_F = ${calculator.formatNumber(norm)}$$
            </div>`;
            metricTensorDisplay.innerHTML = html;
        }

        if (window.MathJax && MathJax.typesetPromise) {
            setTimeout(() => MathJax.typesetPromise([metricTensorDisplay]), 100);
        }
    }
    
    // 显示基向量的函数
    function displayBasisVectors(basis, dimension = 2) {
        const len1 = calculator.vectorLength(basis.e1);

        if (dimension === 1) {
            // 1维流形的显示
            let html = `<div class="vector-display">
                <div class="vector-item">
                    <strong>$\\frac{\\partial\\sigma}{\\partial u}$:</strong><br>
                    $$(${calculator.formatNumber(basis.e1.x)}, ${calculator.formatNumber(basis.e1.y)}, ${calculator.formatNumber(basis.e1.z)})$$<br>
                    $$\\|\\mathbf{e}_1\\| = ${calculator.formatNumber(len1)}$$
                </div>
            </div>

            <div class="tangent-space">
                <h3>切空间 $T_p(M)$</h3>
                <p><strong>切向量:</strong> 这是1维切空间的唯一方向</p>
                <p><strong>度量张量分量:</strong> $g_{11} = \\langle \\mathbf{e}_1, \\mathbf{e}_1 \\rangle = ${calculator.formatNumber(len1 * len1)}$</p>
                <div class="tangent-line" id="tangentSpaceCanvas"></div>
                <p>切空间由基向量 $\\left\\{ \\frac{\\partial}{\\partial u} \\right\\}$ 张成</p>
                <p>$\\dim(T_p(M)) = 1$</p>
            </div>`;

            basisVectorsDisplay.innerHTML = html;

            if (window.MathJax && MathJax.typesetPromise) {
                setTimeout(() => MathJax.typesetPromise([basisVectorsDisplay]), 100);
            }

            drawTangentSpaceVisualization1D(basis);
        } else {
            // 2维流形的显示
            const len2 = calculator.vectorLength(basis.e2);
            const dot = calculator.dot(basis.e1, basis.e2);
            const angle = Math.acos(dot / (len1 * len2)) * 180 / Math.PI;

            let html = `<div class="vector-display">
                <div class="vector-item">
                    <strong>$\\frac{\\partial\\sigma}{\\partial u}$:</strong><br>
                    $$(${calculator.formatNumber(basis.e1.x)}, ${calculator.formatNumber(basis.e1.y)}, ${calculator.formatNumber(basis.e1.z)})$$<br>
                    $$\\|\\mathbf{e}_1\\| = ${calculator.formatNumber(len1)}$$
                </div>
                <div class="vector-item">
                    <strong>$\\frac{\\partial\\sigma}{\\partial v}$:</strong><br>
                    $$(${calculator.formatNumber(basis.e2.x)}, ${calculator.formatNumber(basis.e2.y)}, ${calculator.formatNumber(basis.e2.z)})$$<br>
                    $$\\|\\mathbf{e}_2\\| = ${calculator.formatNumber(len2)}$$
                </div>
            </div>

            <div class="tangent-space">
                <h3>切空间 $T_p(M)$</h3>
                <p><strong>基向量夹角:</strong> $\\theta = ${calculator.formatNumber(angle)}^\\circ$</p>
                <p><strong>度量张量分量:</strong> $g_{12} = \\langle \\mathbf{e}_1, \\mathbf{e}_2 \\rangle = ${calculator.formatNumber(dot)}$</p>
                <div class="tangent-plane" id="tangentSpaceCanvas"></div>
                <p>切空间由基向量 $\\left\\{ \\frac{\\partial}{\\partial u}, \\frac{\\partial}{\\partial v} \\right\\}$ 张成</p>
                <p>$\\dim(T_p(M)) = 2$</p>
            </div>`;

            basisVectorsDisplay.innerHTML = html;

            if (window.MathJax && MathJax.typesetPromise) {
                setTimeout(() => MathJax.typesetPromise([basisVectorsDisplay]), 100);
            }

            drawTangentSpaceVisualization(basis);
        }
    }
    
    // 绘制1维切空间可视化
    function drawTangentSpaceVisualization1D(basis) {
        const canvas = document.getElementById('tangentSpaceCanvas');
        if (!canvas) return;

        // 创建一个临时canvas来绘制切空间
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 300;
        tempCanvas.height = 150;
        const ctx = tempCanvas.getContext('2d');

        // 设置绘图样式
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        // 绘制坐标系
        const centerX = tempCanvas.width / 2;
        const centerY = tempCanvas.height / 2;

        // 绘制网格背景
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // 绘制网格线
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let x = 0; x <= tempCanvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, tempCanvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= tempCanvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(tempCanvas.width, y);
            ctx.stroke();
        }

        // 绘制原点
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
        ctx.fill();

        // 计算并绘制基向量
        const scale = 30; // 缩放因子

        // ∂/∂u 向量（红色）
        const uVecX = basis.e1.x * scale;
        const uVecY = -basis.e1.y * scale; // 翻转Y轴以匹配canvas坐标系
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + uVecX, centerY + uVecY);
        ctx.stroke();

        // 绘制箭头
        drawArrow(ctx, centerX, centerY, centerX + uVecX, centerY + uVecY, '#e74c3c');

        // 添加标签
        ctx.fillStyle = '#e74c3c';
        ctx.fillText('∂/∂u', centerX + uVecX + 15, centerY + uVecY);

        // 添加说明文字
        ctx.fillStyle = '#2c3e50';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('1维切空间：沿曲线切线方向', 10, tempCanvas.height - 20);

        // 添加到DOM
        canvas.innerHTML = '';
        canvas.appendChild(tempCanvas);
    }

    // 绘制切空间可视化
    function drawTangentSpaceVisualization(basis) {
        const canvas = document.getElementById('tangentSpaceCanvas');
        if (!canvas) return;
        
        // 创建一个临时canvas来绘制切空间
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 300;
        tempCanvas.height = 150;
        const ctx = tempCanvas.getContext('2d');
        
        // 设置绘图样式
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        // 绘制坐标系
        const centerX = tempCanvas.width / 2;
        const centerY = tempCanvas.height / 2;
        
        // 绘制网格背景
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // 绘制网格线
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let x = 0; x <= tempCanvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, tempCanvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= tempCanvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(tempCanvas.width, y);
            ctx.stroke();
        }
        
        // 绘制原点
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // 计算并绘制基向量
        const scale = 30; // 缩放因子
        
        // ∂/∂u 向量（红色）
        const uVecX = basis.e1.x * scale;
        const uVecY = -basis.e1.y * scale; // 翻转Y轴以匹配canvas坐标系
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + uVecX, centerY + uVecY);
        ctx.stroke();
        
        // 绘制箭头
        drawArrow(ctx, centerX, centerY, centerX + uVecX, centerY + uVecY, '#e74c3c');
        
        // 添加标签
        ctx.fillStyle = '#e74c3c';
        ctx.fillText('∂/∂u', centerX + uVecX + 15, centerY + uVecY);
        
        // ∂/∂v 向量（蓝色）
        const vVecX = basis.e2.x * scale;
        const vVecY = -basis.e2.y * scale; // 翻转Y轴以匹配canvas坐标系
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + vVecX, centerY + vVecY);
        ctx.stroke();
        
        // 绘制箭头
        drawArrow(ctx, centerX, centerY, centerX + vVecX, centerY + vVecY, '#3498db');
        
        // 添加标签
        ctx.fillStyle = '#3498db';
        ctx.fillText('∂/∂v', centerX + vVecX + 15, centerY + vVecY);
        
        // 添加到DOM
        canvas.innerHTML = '';
        canvas.appendChild(tempCanvas);
    }
    
    // 绘制箭头的辅助函数
    function drawArrow(ctx, fromX, fromY, toX, toY, color) {
        const headLength = 8;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    
    // 显示张量积的函数
    function displayTensorProduct(tensorProduct, dimension = 2) {
        if (dimension === 1) {
            // 1维流形的情况
            let html = `<div class="tensor-product-display">
                <strong>张量积 $g \\otimes g$:</strong><br><br>
                <div class="tensor-matrix">
                    <div class="tensor-block">
                        <table>
                            <tr>
                                <td>${calculator.formatNumber(tensorProduct[0][0][0])}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <p>对于1维流形，张量积是1×1矩阵</p>
            </div>`;
            tensorProductDisplay.innerHTML = html;
        } else {
            // 2维流形的情况
            let html = `<div class="tensor-product-display">
                <strong>张量积 $g \\otimes g$:</strong><br><br>
                <div class="tensor-matrix">
            `;

            // 生成4x4张量的表格表示
            for (let i = 0; i < 4; i++) {
                html += '<div class="tensor-block">';
                html += '<table>';
                for (let j = 0; j < 2; j++) {
                    html += '<tr>';
                    for (let k = 0; k < 2; k++) {
                        const value = tensorProduct[i][j][k];
                        html += `<td>${calculator.formatNumber(value)}</td>`;
                    }
                    html += '</tr>';
                }
                html += '</table>';
                html += '</div>';
            }

            html += '</div></div>';
            tensorProductDisplay.innerHTML = html;
        }
    }
    
    // 显示计算步骤的函数
    function displayCalculationSteps(result) {
        let html = '<div class="calculation-steps">';
        
        result.steps.forEach((step, index) => {
            html += `<div class="step-item" id="step-${index}">
                <div class="step-title" onclick="window.toggleStep(${index})">
                    <span class="step-number">${index + 1}</span>
                    <span class="step-name">${step.title}</span>
                    <span class="toggle-icon">▼</span>
                </div>
                <div class="step-content" id="step-content-${index}">
                    ${step.content}
                </div>
            </div>`;
        });
        
        // 添加展开/折叠函数
        window.toggleStep = function(index) {
            const content = document.getElementById('step-content-' + index);
            const title = document.getElementById('step-' + index).querySelector('.step-title');
            const icon = title.querySelector('.toggle-icon');
            
            if (content.style.display === 'none' || !content.style.display) {
                content.style.display = 'block';
                icon.textContent = '▲';
            } else {
                content.style.display = 'none';
                icon.textContent = '▼';
            }
        };
        
        html += '</div>';
        calculationStepsDisplay.innerHTML = html;
        
        if (window.MathJax && MathJax.typesetPromise) {
            setTimeout(() => MathJax.typesetPromise([calculationStepsDisplay]), 100);
        }
    }
    
    // 显示曲率信息的函数
    function displayCurvatureInfo(manifoldType, u, v, dimension = 2) {
        // 为所有情况计算克里斯托弗符号
        const christoffel = calculator.calculateChristoffelSymbols(manifoldType, u, v);

        if (dimension === 1) {
            // 1维流形的曲率信息
            const result = calculator.calculateMetricTensor(manifoldType, u, v);
            const g11 = result.matrix[0][0];
            const arcLengthElement = Math.sqrt(g11);

            let curvatureHtml = `<div class="curvature-info">
                <h3>1维流形几何性质</h3>
                <div class="mathjax-equation">
                    $$\\text{度量分量 } g_{11} = ${calculator.formatNumber(g11)}$$<br>
                    $$\\text{弧长元素 } ds = \\sqrt{g_{11}} \\; du = ${calculator.formatNumber(arcLengthElement)} \\; du$$<br><br>
                </div>

                <h3>曲线性质</h3>
                <div class="curvature-type">
                    <span class="curve-info">📏 1维黎曼流形：参数曲线</span><br>
                    <span class="curve-info">弧长参数化用于测量曲线长度</span>
                </div>

                <h3>几何意义</h3>
                <div class="mathjax-equation">
                    切空间维数：$\\dim(T_p(M)) = 1$<br>
                    度量张量：$g_{ij}$ 定义了切空间上的内积
                </div>
            </div>`;

            curvatureDisplay.innerHTML = curvatureHtml;
        } else {
            // 2维流形的曲率信息
            const K = calculator.calculateGaussianCurvature(manifoldType, u, v);
            const H = calculator.calculateMeanCurvature(manifoldType, u, v);
            const riemann = calculator.calculateRiemannCurvature(manifoldType, u, v);

            // 显示曲率信息
            let curvatureHtml = `<div class="curvature-info">
                <h3>高斯曲率与平均曲率</h3>
                <div class="mathjax-equation">
                    $$\\text{高斯曲率 } K = ${calculator.formatNumber(K)}$$<br>
                    $$\\text{平均曲率 } H = ${calculator.formatNumber(H)}$$<br><br>
                </div>

                <h3>曲率类型</h3>
                <div class="curvature-type">
                    ${K > 0 ? '<span class="positive-curvature">🌍 正曲率：椭圆点</span>' : ''}
                    ${K === 0 ? '<span class="zero-curvature">📏 零曲率：抛物点</span>' : ''}
                    ${K < 0 ? '<span class="negative-curvature">📐 负曲率：双曲点</span>' : ''}
                </div>

                <h3>数量曲率</h3>
                <div class="mathjax-equation">
                    $$R = 2K = ${calculator.formatNumber(riemann.scalarCurvature)}$$
                </div>
            </div>`;

            curvatureDisplay.innerHTML = curvatureHtml;
        }

        if (window.MathJax && MathJax.typesetPromise) {
            setTimeout(() => MathJax.typesetPromise([curvatureDisplay]), 100);
        }
        
        // 显示克里斯托弗符号
        let christoffelHtml;
        if (dimension === 1) {
            christoffelHtml = `<div class="christoffel-symbols">
                <h3>克里斯托弗符号 $\\Gamma^k_{ij}$</h3>
                <div class="christoffel-table">
                    <table>
                        <tr><th>$k$</th><th>$i$</th><th>$j$</th><th>值</th></tr>
                        <tr><td>1</td><td>1</td><td>1</td><td>${calculator.formatNumber(christoffel.g111)}</td></tr>
                    </table>
                </div>
                <p class="christoffel-note">
                    对于1维流形，只有一个克里斯托弗符号 $\\Gamma^1_{11}$，描述了曲线参数化如何变化。
                </p>
            </div>`;
        } else {
            christoffelHtml = `<div class="christoffel-symbols">
                <h3>克里斯托弗符号 $\\Gamma^k_{ij}$</h3>
                <div class="christoffel-table">
                    <table>
                        <tr><th>$k$</th><th>$i$</th><th>$j$</th><th>值</th></tr>
                        <tr><td>1</td><td>1</td><td>1</td><td>${calculator.formatNumber(christoffel.g111)}</td></tr>
                        <tr><td>1</td><td>1</td><td>2</td><td>${calculator.formatNumber(christoffel.g112)}</td></tr>
                        <tr><td>1</td><td>2</td><td>1</td><td>${calculator.formatNumber(christoffel.g121)}</td></tr>
                        <tr><td>1</td><td>2</td><td>2</td><td>${calculator.formatNumber(christoffel.g122)}</td></tr>
                        <tr><td>2</td><td>1</td><td>1</td><td>${calculator.formatNumber(christoffel.g211)}</td></tr>
                        <tr><td>2</td><td>1</td><td>2</td><td>${calculator.formatNumber(christoffel.g212)}</td></tr>
                        <tr><td>2</td><td>2</td><td>1</td><td>${calculator.formatNumber(christoffel.g221)}</td></tr>
                        <tr><td>2</td><td>2</td><td>2</td><td>${calculator.formatNumber(christoffel.g222)}</td></tr>
                    </table>
                </div>
                <p class="christoffel-note">
                    克里斯托弗符号描述了流形上的度量张量如何随位置变化，是计算测地线和曲率张量的关键。
                </p>
            </div>`;
        }
        
        christoffelDisplay.innerHTML = christoffelHtml;
        
        if (window.MathJax && MathJax.typesetPromise) {
            setTimeout(() => MathJax.typesetPromise([christoffelDisplay]), 100);
        }
    }
    
    // 初始化3D引擎
    initEngine3D();
});