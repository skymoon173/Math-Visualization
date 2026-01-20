// 李群与李代数计算模块

class LieAlgebra {
    // 旋转向量转旋转矩阵 (Rodrigues公式)
    static rotationVectorToMatrix(rotationVector) {
        const theta = Math.sqrt(rotationVector[0] ** 2 + rotationVector[1] ** 2 + rotationVector[2] ** 2);
        if (theta < 1e-6) {
            return [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ];
        }
        const axis = rotationVector.map(v => v / theta);
        const [x, y, z] = axis;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const oneMinusCos = 1 - cosTheta;
        
        return [
            [cosTheta + x * x * oneMinusCos, x * y * oneMinusCos - z * sinTheta, x * z * oneMinusCos + y * sinTheta],
            [y * x * oneMinusCos + z * sinTheta, cosTheta + y * y * oneMinusCos, y * z * oneMinusCos - x * sinTheta],
            [z * x * oneMinusCos - y * sinTheta, z * y * oneMinusCos + x * sinTheta, cosTheta + z * z * oneMinusCos]
        ];
    }
    
    // 旋转矩阵转旋转向量
    static matrixToRotationVector(matrix) {
        const trace = matrix[0][0] + matrix[1][1] + matrix[2][2];
        let theta = Math.acos((trace - 1) / 2);
        if (theta < 1e-6) {
            return [0, 0, 0];
        }
        const factor = theta / (2 * Math.sin(theta));
        return [
            factor * (matrix[2][1] - matrix[1][2]),
            factor * (matrix[0][2] - matrix[2][0]),
            factor * (matrix[1][0] - matrix[0][1])
        ];
    }
    
    // 四元数转旋转矩阵
    static quaternionToMatrix(quaternion) {
        const [x, y, z, w] = quaternion;
        const x2 = x * 2;
        const y2 = y * 2;
        const z2 = z * 2;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        
        return [
            [1 - yy - zz, xy - wz, xz + wy],
            [xy + wz, 1 - xx - zz, yz - wx],
            [xz - wy, yz + wx, 1 - xx - yy]
        ];
    }
    
    // 欧拉角转旋转矩阵 (ZYX顺序)
    static eulerToMatrix(roll, pitch, yaw) {
        const cosR = Math.cos(roll);
        const sinR = Math.sin(roll);
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        
        return [
            [cosY * cosP, cosY * sinP * sinR - sinY * cosR, cosY * sinP * cosR + sinY * sinR],
            [sinY * cosP, sinY * sinP * sinR + cosY * cosR, sinY * sinP * cosR - cosY * sinR],
            [-sinP, cosP * sinR, cosP * cosR]
        ];
    }
    
    // 旋转矩阵乘法
    static multiplyMatrices(a, b) {
        const result = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j];
            }
        }
        return result;
    }
    
    // 向量旋转
    static rotateVector(matrix, vector) {
        return [
            matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
            matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
            matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2]
        ];
    }
}

// 李群变换
class LieGroup {
    // SO(3) 旋转群
    static SO3(rotationVector) {
        return LieAlgebra.rotationVectorToMatrix(rotationVector);
    }
    
    // SE(3) 欧氏变换群
    static SE3(rotationVector, translation) {
        const rotationMatrix = LieAlgebra.rotationVectorToMatrix(rotationVector);
        return {
            rotation: rotationMatrix,
            translation: translation
        };
    }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
    window.LieAlgebra = LieAlgebra;
    window.LieGroup = LieGroup;
}