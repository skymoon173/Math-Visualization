# 更新脚本：为getPartialDerivativeDetails方法添加切空间映射的详细步骤

with open('riemann-calculator-full.js', 'r', encoding='utf8') as f:
    content = f.read()

# 定位getPartialDerivativeDetails方法的开始和结束位置
start = content.find('    getPartialDerivativeDetails(paramFunc, u, v)')
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

# 创建新的方法内容，包含切空间映射的详细步骤
new_method = '''    getPartialDerivativeDetails(paramFunc, u, v) {
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
        
        return `<strong>基向量（偏导数）:</strong><br><br>
                $\\frac{\\partial \\sigma}{\\partial u} = \\left( ${formatNum(e1.x)}, ${formatNum(e1.y)}, ${formatNum(e1.z)} \\right)$<br><br>
                $\\frac{\\partial \\sigma}{\\partial v} = \\left( ${formatNum(e2.x)}, ${formatNum(e2.y)}, ${formatNum(e2.z)} \\right)$<br><br>
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
    }'''

# 替换旧方法
new_content = content[:start] + new_method + content[end:]

# 写入更新后的内容
with open('riemann-calculator-full.js', 'w', encoding='utf8') as f:
    f.write(new_content)

print('成功更新getPartialDerivativeDetails方法，添加了切空间映射的详细步骤')
