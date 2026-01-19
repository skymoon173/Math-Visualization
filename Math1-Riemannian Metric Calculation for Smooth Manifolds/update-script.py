# 简单的更新脚本，用于添加详细的计算步骤

with open('riemann-calculator-full.js', 'r', encoding='utf8') as f:
    content = f.read()

# 定位getParametrizationDetails方法的开始和结束位置
start = content.find('    getParametrizationDetails(manifoldType, u, v)')
if start == -1:
    print('方法未找到')
    exit(1)

# 找到方法的结束位置（匹配大括号）
open_braces = 0
end = start
for i in range(start, len(content)):
    if content[i] == '{':
        open_braces += 1
    elif content[i] == '}':
        open_braces -= 1
        if open_braces == 0:
            end = i + 1
            break

if end == start:
    print('未找到方法结束')
    exit(1)

# 创建新的方法内容
new_method = '''    getParametrizationDetails(manifoldType, u, v) {
        const paramFunc = this.manifolds[manifoldType];
        if (!paramFunc) {
            throw new Error(`未知的流形类型: ${manifoldType}`);
        }

        const point = paramFunc(u, v);
        const manifoldNames = {
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
        
        // 根据流形类型生成具体计算步骤
        if (manifoldType === 'sphere') {
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
                   - $x = \\sin(u\\pi)\\cos(v\\pi) = ${formatNum(Math.sin(u * Math.PI))} \\times ${formatNum(Math.cos(v * Math.PI))} = ${formatNum(point.x)}$<br>
                   - $y = \\sin(u\\pi)\\sin(v\\pi) = ${formatNum(Math.sin(u * Math.PI))} \\times ${formatNum(Math.sin(v * Math.PI))} = ${formatNum(point.y)}$<br>
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
                1. 参数化映射公式: $\\sigma(u, v) = \\left( u \\times 4 - 2, v \\times 4 - 2, 0 \\right)$<br>
                2. 代入参数值: u = ${formatNum(u)}, v = ${formatNum(v)}<br>
                3. 计算坐标值:<br>
                   - $x = u \\times 4 - 2 = ${formatNum(u)} \\times 4 - 2 = ${formatNum(point.x)}$<br>
                   - $y = v \\times 4 - 2 = ${formatNum(v)} \\times 4 - 2 = ${formatNum(point.y)}$<br>
                   - $z = 0$<br>`;
        } else if (manifoldType === 'cylinder') {
            calculationSteps = `
                <strong>具体计算步骤:</strong><br>
                1. 参数化映射公式: $\\sigma(u, v) = \\left( \\cos(u \\times 2\\pi), \\sin(u \\times 2\\pi), v \\times 4 - 2 \\right)$<br>
                2. 代入参数值: u = ${formatNum(u)}, v = ${formatNum(v)}<br>
                3. 计算中间值:<br>
                   - $u \\times 2\\pi = ${formatNum(u)} \\times 2\\pi = ${formatNum(u * 2 * Math.PI)}$<br>
                   - $\\cos(u \\times 2\\pi) = \\cos(${formatNum(u * 2 * Math.PI)}) = ${formatNum(Math.cos(u * 2 * Math.PI))}$<br>
                   - $\\sin(u \\times 2\\pi) = \\sin(${formatNum(u * 2 * Math.PI)}) = ${formatNum(Math.sin(u * 2 * Math.PI))}$<br>
                4. 计算坐标值:<br>
                   - $x = \\cos(u \\times 2\\pi) = ${formatNum(Math.cos(u * 2 * Math.PI))} = ${formatNum(point.x)}$<br>
                   - $y = \\sin(u \\times 2\\pi) = ${formatNum(Math.sin(u * 2 * Math.PI))} = ${formatNum(point.y)}$<br>
                   - $z = v \\times 4 - 2 = ${formatNum(v)} \\times 4 - 2 = ${formatNum(point.z)}$<br>`;
        } else {
            calculationSteps = `
                <strong>具体计算步骤:</strong><br>
                1. 使用${manifoldNames[manifoldType]}的参数化映射公式<br>
                2. 代入参数值: u = ${formatNum(u)}, v = ${formatNum(v)}<br>
                3. 计算得到流形点坐标: (x, y, z) = (${formatNum(point.x)}, ${formatNum(point.y)}, ${formatNum(point.z)})`;
        }

        return `<strong>流形类型:</strong> ${manifoldNames[manifoldType]} (${manifoldType})<br><br>
                <strong>参数值:</strong> u = ${formatNum(u)}, v = ${formatNum(v)}<br><br>
                <strong>参数化映射:</strong><br>
                $\\sigma(u, v) = \\left( ${formatNum(point.x)}, ${formatNum(point.y)}, ${formatNum(point.z)} \\right)$<br><br>
                <strong>点的位置:</strong> (x, y, z) = (${formatNum(point.x)}, ${formatNum(point.y)}, ${formatNum(point.z)})<br><br>
                ${calculationSteps}`;
    }'''

# 替换旧方法
new_content = content[:start] + new_method + content[end:]

# 写入更新后的内容
with open('riemann-calculator-full.js', 'w', encoding='utf8') as f:
    f.write(new_content)

print('成功更新getParametrizationDetails方法，添加了详细计算步骤')
