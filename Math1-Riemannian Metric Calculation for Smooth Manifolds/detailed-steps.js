// 辅助函数：生成详细的参数化计算步骤
function generateDetailedSteps(manifoldType, u, v, point) {
    let steps = "";
    
    // 判断是否为1维流形
    const oneDimensionalManifolds = ['circle', 'line', 'helix'];

    switch(manifoldType) {
        case 'circle':
            steps = `
            <strong>具体计算步骤:</strong><br>
            1. 参数化映射公式: $\sigma(u) = \left( \cos(2\pi u), \sin(2\pi u), 0 \right)$<br>
            2. 代入参数值: u = ${u.toFixed(4)}<br>
            3. 计算中间值:<br>
               - $2\pi u = 2\pi \times ${u.toFixed(4)} = ${(2 * Math.PI * u).toFixed(4)}$<br>
               - $\cos(2\pi u) = \cos(${(2 * Math.PI * u).toFixed(4)}) = ${Math.cos(2 * Math.PI * u).toFixed(4)}$<br>
               - $\sin(2\pi u) = \sin(${(2 * Math.PI * u).toFixed(4)}) = ${Math.sin(2 * Math.PI * u).toFixed(4)}$<br>
            4. 计算坐标值:<br>
               - $x = \cos(2\pi u) = ${Math.cos(2 * Math.PI * u).toFixed(4)} = ${point.x.toFixed(4)}$<br>
               - $y = \sin(2\pi u) = ${Math.sin(2 * Math.PI * u).toFixed(4)} = ${point.y.toFixed(4)}$<br>
               - $z = 0$<br>`;
            break;

        case 'line':
            steps = `
            <strong>具体计算步骤:</strong><br>
            1. 参数化映射公式: $\sigma(u) = \left( u \times 4 - 2, 0, 0 \right)$<br>
            2. 代入参数值: u = ${u.toFixed(4)}<br>
            3. 计算坐标值:<br>
               - $x = u \times 4 - 2 = ${u.toFixed(4)} \times 4 - 2 = ${point.x.toFixed(4)}$<br>
               - $y = 0$<br>
               - $z = 0$<br>`;
            break;

        case 'helix':
            steps = `
            <strong>具体计算步骤:</strong><br>
            1. 参数化映射公式: $\sigma(u) = \left( \cos(8\pi u), \sin(8\pi u), 0.125\pi u \right)$<br>
            2. 代入参数值: u = ${u.toFixed(4)}<br>
            3. 计算中间值:<br>
               - $8\pi u = 8\pi \times ${u.toFixed(4)} = ${(8 * Math.PI * u).toFixed(4)}$<br>
               - $0.125\pi u = 0.125\pi \times ${u.toFixed(4)} = ${(0.125 * Math.PI * u).toFixed(4)}$<br>
               - $\cos(8\pi u) = \cos(${(8 * Math.PI * u).toFixed(4)}) = ${Math.cos(8 * Math.PI * u).toFixed(4)}$<br>
               - $\sin(8\pi u) = \sin(${(8 * Math.PI * u).toFixed(4)}) = ${Math.sin(8 * Math.PI * u).toFixed(4)}$<br>
            4. 计算坐标值:<br>
               - $x = \cos(8\pi u) = ${Math.cos(8 * Math.PI * u).toFixed(4)} = ${point.x.toFixed(4)}$<br>
               - $y = \sin(8\pi u) = ${Math.sin(8 * Math.PI * u).toFixed(4)} = ${point.y.toFixed(4)}$<br>
               - $z = 0.125\pi u = ${(0.125 * Math.PI * u).toFixed(4)} = ${point.z.toFixed(4)}$<br>`;
            break;

        case 'sphere':
            steps = `
            <strong>具体计算步骤:</strong><br>
            1. 参数化映射公式: $\sigma(u, v) = \left( R\sin(u\pi)\cos(v\pi), R\sin(u\pi)\sin(v\pi), R\cos(u\pi) \right)$ (R=1)<br>
            2. 代入参数值: u = ${u.toFixed(4)}, v = ${v.toFixed(4)}<br>
            3. 计算中间值:<br>
               - $u\pi = ${u.toFixed(4)} \times \pi = ${(u * Math.PI).toFixed(4)}$<br>
               - $v\pi = ${v.toFixed(4)} \times \pi = ${(v * Math.PI).toFixed(4)}$<br>
               - $\sin(u\pi) = \sin(${ (u * Math.PI).toFixed(4) }) = ${Math.sin(u * Math.PI).toFixed(4)}$<br>
               - $\cos(v\pi) = \cos(${ (v * Math.PI).toFixed(4) }) = ${Math.cos(v * Math.PI).toFixed(4)}$<br>
               - $\sin(v\pi) = \sin(${ (v * Math.PI).toFixed(4) }) = ${Math.sin(v * Math.PI).toFixed(4)}$<br>
               - $\cos(u\pi) = \cos(${ (u * Math.PI).toFixed(4) }) = ${Math.cos(u * Math.PI).toFixed(4)}$<br>
            4. 计算坐标值:<br>
               - $x = \sin(u\pi)\cos(v\pi) = ${Math.sin(u * Math.PI).toFixed(4)} \times ${Math.cos(v * Math.PI).toFixed(4)} = ${point.x.toFixed(4)}$<br>
               - $y = \sin(u\pi)\sin(v\pi) = ${Math.sin(u * Math.PI).toFixed(4)} \times ${Math.sin(v * Math.PI).toFixed(4)} = ${point.y.toFixed(4)}$<br>
               - $z = \cos(u\pi) = ${Math.cos(u * Math.PI).toFixed(4)} = ${point.z.toFixed(4)}$<br>`;
            break;
            
        case 'torus':
            steps = `
            <strong>具体计算步骤:</strong><br>
            1. 参数化映射公式: $\sigma(u, v) = \left( (R + r\cos(2\pi v))\cos(2\pi u), (R + r\cos(2\pi v))\sin(2\pi u), r\sin(2\pi v) \right)$ (R=2, r=1)<br>
            2. 代入参数值: u = ${u.toFixed(4)}, v = ${v.toFixed(4)}<br>
            3. 计算中间值:<br>
               - $2\pi u = 2\pi \times ${u.toFixed(4)} = ${(2 * Math.PI * u).toFixed(4)}$<br>
               - $2\pi v = 2\pi \times ${v.toFixed(4)} = ${(2 * Math.PI * v).toFixed(4)}$<br>
               - $\cos(2\pi v) = \cos(${ (2 * Math.PI * v).toFixed(4) }) = ${Math.cos(2 * Math.PI * v).toFixed(4)}$<br>
               - $R + r\cos(2\pi v) = 2 + 1 \times ${Math.cos(2 * Math.PI * v).toFixed(4)} = ${(2 + Math.cos(2 * Math.PI * v)).toFixed(4)}$<br>
            4. 计算坐标值:<br>
               - $x = (R + r\cos(2\pi v))\cos(2\pi u) = ${(2 + Math.cos(2 * Math.PI * v)).toFixed(4)} \times ${Math.cos(2 * Math.PI * u).toFixed(4)} = ${point.x.toFixed(4)}$<br>
               - $y = (R + r\cos(2\pi v))\sin(2\pi u) = ${(2 + Math.cos(2 * Math.PI * v)).toFixed(4)} \times ${Math.sin(2 * Math.PI * u).toFixed(4)} = ${point.y.toFixed(4)}$<br>
               - $z = r\sin(2\pi v) = 1 \times ${Math.sin(2 * Math.PI * v).toFixed(4)} = ${point.z.toFixed(4)}$<br>`;
            break;
            
        case 'plane':
            steps = `
            <strong>具体计算步骤:</strong><br>
            1. 参数化映射公式: $\sigma(u, v) = \left( u \times 4 - 2, v \times 4 - 2, 0 \right)$<br>
            2. 代入参数值: u = ${u.toFixed(4)}, v = ${v.toFixed(4)}<br>
            3. 计算坐标值:<br>
               - $x = u \times 4 - 2 = ${u.toFixed(4)} \times 4 - 2 = ${point.x.toFixed(4)}$<br>
               - $y = v \times 4 - 2 = ${v.toFixed(4)} \times 4 - 2 = ${point.y.toFixed(4)}$<br>
               - $z = 0$<br>`;
            break;
            
        case 'cylinder':
            steps = `
            <strong>具体计算步骤:</strong><br>
            1. 参数化映射公式: $\sigma(u, v) = \left( \cos(u \times 2\pi), \sin(u \times 2\pi), v \times 4 - 2 \right)$<br>
            2. 代入参数值: u = ${u.toFixed(4)}, v = ${v.toFixed(4)}<br>
            3. 计算中间值:<br>
               - $u \times 2\pi = ${u.toFixed(4)} \times 2\pi = ${(u * 2 * Math.PI).toFixed(4)}$<br>
               - $\cos(u \times 2\pi) = \cos(${ (u * 2 * Math.PI).toFixed(4) }) = ${Math.cos(u * 2 * Math.PI).toFixed(4)}$<br>
               - $\sin(u \times 2\pi) = \sin(${ (u * 2 * Math.PI).toFixed(4) }) = ${Math.sin(u * 2 * Math.PI).toFixed(4)}$<br>
            4. 计算坐标值:<br>
               - $x = \cos(u \times 2\pi) = ${Math.cos(u * 2 * Math.PI).toFixed(4)} = ${point.x.toFixed(4)}$<br>
               - $y = \sin(u \times 2\pi) = ${Math.sin(u * 2 * Math.PI).toFixed(4)} = ${point.y.toFixed(4)}$<br>
               - $z = v \times 4 - 2 = ${v.toFixed(4)} \times 4 - 2 = ${point.z.toFixed(4)}$<br>`;
            break;
            
        default:
            steps = `
            <strong>具体计算步骤:</strong><br>
            1. 使用${manifoldNames[manifoldType]}的参数化映射公式<br>
            2. 代入参数值: u = ${u.toFixed(4)}, v = ${v.toFixed(4)}<br>
            3. 计算得到流形点坐标: (x, y, z) = (${point.x.toFixed(4)}, ${point.y.toFixed(4)}, ${point.z.toFixed(4)})`;
            break;
    }
    
    return steps;
}

// 辅助函数：生成切空间映射的详细步骤
function generateTangentSpaceSteps(paramFunc, u, v, e1, e2) {
    const h = 1e-6;
    const point = paramFunc(u, v);
    const pointUPlus = paramFunc(u + h, v);
    const pointUMinus = paramFunc(u - h, v);
    const pointVPlus = paramFunc(u, v + h);
    const pointVMinus = paramFunc(u, v - h);
    
    return `<strong>从流形点到切空间的映射过程:</strong><br><br>
            <strong>1. 切空间的定义:</strong> 切空间 $T_p(M)$ 是流形 $M$ 在点 $p$ 处的所有切向量组成的向量空间<br><br>
            <strong>2. 基向量的生成:</strong><br>
            - 对于参数化流形，切空间由参数的偏导数张成: $T_p(M) = \text{span}\left\{ \frac{\partial \sigma}{\partial u}, \frac{\partial \sigma}{\partial v} \right\}$<br><br>
            <strong>3. 具体计算过程:</strong><br>
            - 点 $p = \sigma(${u.toFixed(4)}, ${v.toFixed(4)}) = (${point.x.toFixed(4)}, ${point.y.toFixed(4)}, ${point.z.toFixed(4)})$<br>
            - 计算 $\sigma(u+h, v) = (${pointUPlus.x.toFixed(4)}, ${pointUPlus.y.toFixed(4)}, ${pointUPlus.z.toFixed(4)})$<br>
            - 计算 $\sigma(u-h, v) = (${pointUMinus.x.toFixed(4)}, ${pointUMinus.y.toFixed(4)}, ${pointUMinus.z.toFixed(4)})$<br>
            - 计算 $\frac{\partial \sigma}{\partial u} \approx \frac{1}{2h} \left( \sigma(u+h, v) - \sigma(u-h, v) \right) = \left( ${e1.x.toFixed(4)}, ${e1.y.toFixed(4)}, ${e1.z.toFixed(4)} \right)$<br><br>
            - 同理计算 $\frac{\partial \sigma}{\partial v} = \left( ${e2.x.toFixed(4)}, ${e2.y.toFixed(4)}, ${e2.z.toFixed(4)} \right)$<br><br>
            <strong>4. 切空间的几何意义:</strong><br>
            - 切空间在点 $p$ 处与流形相切<br>
            - 切空间中的向量表示流形上的切方向<br>
            - 切空间的维数等于流形的维数（此处为2维）<br><br>
            <strong>5. 度量张量与切空间:</strong><br>
            - 度量张量 $g_{ij} = \left\langle \frac{\partial \sigma}{\partial u^i}, \frac{\partial \sigma}{\partial u^j} \right\rangle$ 定义了切空间上的内积<br>
            - 内积用于计算切向量的长度和夹角<br>
            - 切空间的几何性质完全由度量张量决定`;
}