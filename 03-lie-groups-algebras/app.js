// 主应用程序 - 李群与李代数可视化

class LieVisualization {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.manifoldScene = null;
        this.manifoldCamera = null;
        this.manifoldRenderer = null;
        this.cube = null;
        this.axesHelper = null;
        this.rotationVector = { x: 0, y: 0, z: 0 };
        this.isAnimating = false;
        this.animationId = null;
        this.currentManifold = 'so2';
        this.so2Group = null;
        this.so3Group = null;
        this.rotationMarker = null;
        this.rotationPath = null;
        this.currentTab = 'rotation';
        this.orbitControls = null;
        this.manifoldOrbitControls = null;
        this.algebraOrbitControls = null;
        this.algebraAnimationEnabled = false;
        this.algebraAnimationTime = 0;
        
        this.init();
        this.initManifoldVisualization();
        this.initAlgebraVisualization();
        this.setupControls();
        this.setupAlgebraVectorControls();
        this.setupTopicToggle();
        this.setupManifoldControls();
        this.setupAlgebraControls();
        this.setupTabSwitching();
        this.animate();
    }
    
    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a1a);
        
        this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        this.camera.position.set(3, 3, 4);
        this.camera.lookAt(0, 0, 0);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        this.updateRotationRendererSize();
        
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.enablePan = true;
        this.orbitControls.enableZoom = true;
        this.orbitControls.enableRotate = true;
        this.orbitControls.minDistance = 1;
        this.orbitControls.maxDistance = 20;
        
        this.axesHelper = new THREE.AxesHelper(2);
        this.scene.add(this.axesHelper);
        
        const cubeGroup = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x4a90d9,
            transparent: true,
            opacity: 0.7,
            shininess: 100
        });
        this.cube = new THREE.Mesh(geometry, material);
        cubeGroup.add(this.cube);
        
        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
        );
        cubeGroup.add(wireframe);
        
        const localAxes = new THREE.AxesHelper(1);
        cubeGroup.add(localAxes);
        
        this.scene.add(cubeGroup);
        this.cubeGroup = cubeGroup;
        
        const gridHelper = new THREE.GridHelper(5, 10, 0x0f3460, 0x0f3460);
        gridHelper.rotation.x = Math.PI / 2;
        gridHelper.position.z = -1;
        this.scene.add(gridHelper);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 0.4);
        pointLight.position.set(-5, 3, 3);
        this.scene.add(pointLight);
        
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    updateRotationRendererSize() {
        const container = document.getElementById('canvas-container');
        if (container) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height, false);
        }
    }
    
    updateManifoldRendererSize() {
        const container = document.getElementById('manifold-canvas-container');
        if (container) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            this.manifoldCamera.aspect = width / height;
            this.manifoldCamera.updateProjectionMatrix();
            this.manifoldRenderer.setSize(width, height, false);
        }
    }
    
    initManifoldVisualization() {
        this.manifoldScene = new THREE.Scene();
        this.manifoldScene.background = new THREE.Color(0x0a0a1a);
        
        this.manifoldCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        this.manifoldCamera.position.set(2.5, 2, 2.5);
        this.manifoldCamera.lookAt(0, 0, 0);
        
        this.manifoldRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.manifoldRenderer.setPixelRatio(window.devicePixelRatio);
        this.manifoldRenderer.domElement.style.width = '100%';
        this.manifoldRenderer.domElement.style.height = '100%';
        document.getElementById('manifold-canvas-container').appendChild(this.manifoldRenderer.domElement);
        
        this.updateManifoldRendererSize();
        
        this.manifoldOrbitControls = new OrbitControls(this.manifoldCamera, this.manifoldRenderer.domElement);
        this.manifoldOrbitControls.enableDamping = true;
        this.manifoldOrbitControls.dampingFactor = 0.05;
        this.manifoldOrbitControls.enablePan = true;
        this.manifoldOrbitControls.enableZoom = true;
        this.manifoldOrbitControls.enableRotate = true;
        this.manifoldOrbitControls.minDistance = 1;
        this.manifoldOrbitControls.maxDistance = 10;
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.manifoldScene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.manifoldScene.add(directionalLight);
        
        this.createSO2Visualization();
        this.createSO3Visualization();
        
        window.addEventListener('resize', () => this.onManifoldResize());
    }
    
    initAlgebraVisualization() {
        const container = document.getElementById('algebra-canvas-container');
        
        this.algebraScene = new THREE.Scene();
        this.algebraScene.background = new THREE.Color(0x0a0a1a);
        
        this.algebraCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        this.algebraCamera.position.set(3, 2, 3);
        this.algebraCamera.lookAt(0, 0, 0);
        
        this.algebraRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.algebraRenderer.setPixelRatio(window.devicePixelRatio);
        this.algebraRenderer.domElement.style.width = '100%';
        this.algebraRenderer.domElement.style.height = '100%';
        
        if (container) {
            container.appendChild(this.algebraRenderer.domElement);
        }
        
        this.updateAlgebraRendererSize();
        
        this.algebraOrbitControls = new OrbitControls(this.algebraCamera, this.algebraRenderer.domElement);
        this.algebraOrbitControls.enableDamping = true;
        this.algebraOrbitControls.dampingFactor = 0.05;
        this.algebraOrbitControls.enablePan = true;
        this.algebraOrbitControls.enableZoom = true;
        this.algebraOrbitControls.enableRotate = true;
        this.algebraOrbitControls.minDistance = 1;
        this.algebraOrbitControls.maxDistance = 15;
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.algebraScene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.algebraScene.add(directionalLight);
        
        this.createSO2AlgebraVisualization();
        this.createSO3AlgebraVisualization();
        
        window.addEventListener('resize', () => this.onAlgebraResize());
    }
    
    updateAlgebraRendererSize() {
        const container = document.getElementById('algebra-canvas-container');
        if (container && this.algebraRenderer) {
            const width = Math.max(container.clientWidth || 400, 1);
            const height = Math.max(container.clientHeight || 300, 1);
            this.algebraCamera.aspect = width / height;
            this.algebraCamera.updateProjectionMatrix();
            this.algebraRenderer.setSize(width, height, false);
        }
    }
    
    createSO2AlgebraVisualization() {
        this.so2AlgebraGroup = new THREE.Group();
        
        const radius = 1.5;
        
        const circleGeometry = new THREE.BufferGeometry();
        const circlePoints = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            circlePoints.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        }
        circleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(circlePoints, 3));
        const circleMaterial = new THREE.LineBasicMaterial({ color: 0x4a90d9, linewidth: 2 });
        const circle = new THREE.Line(circleGeometry, circleMaterial);
        this.so2AlgebraGroup.add(circle);
        
        const identityPoint = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xff6b6b })
        );
        identityPoint.position.set(radius, 0, 0);
        this.so2AlgebraGroup.add(identityPoint);
        
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 128;
        labelCanvas.height = 64;
        const labelCtx = labelCanvas.getContext('2d');
        labelCtx.fillStyle = '#ff6b6b';
        labelCtx.font = 'bold 28px Arial';
        labelCtx.fillText('I', 0, 40);
        const labelTexture = new THREE.CanvasTexture(labelCanvas);
        const labelMaterial = new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true });
        const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.15), labelMaterial);
        labelMesh.position.set(radius + 0.3, 0, 0);
        this.so2AlgebraGroup.add(labelMesh);
        
        const tangentLineGeometry = new THREE.BufferGeometry();
        const tangentPoints = [
            radius, -2, 0,
            radius, 2, 0
        ];
        tangentLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(tangentPoints, 3));
        const tangentLineMaterial = new THREE.LineDashedMaterial({
            color: 0x00ff88,
            dashSize: 0.2,
            gapSize: 0.1,
            linewidth: 2
        });
        const tangentLine = new THREE.Line(tangentLineGeometry, tangentLineMaterial);
        tangentLine.computeLineDistances();
        this.so2AlgebraGroup.add(tangentLine);
        
        const tangentLabelCanvas = document.createElement('canvas');
        tangentLabelCanvas.width = 256;
        tangentLabelCanvas.height = 64;
        const tangentLabelCtx = tangentLabelCanvas.getContext('2d');
        tangentLabelCtx.fillStyle = '#00ff88';
        tangentLabelCtx.font = 'bold 28px Arial';
        tangentLabelCtx.fillText('切空间 T₁SO(2) = so(2)', 0, 40);
        const tangentLabelTexture = new THREE.CanvasTexture(tangentLabelCanvas);
        const tangentLabelMaterial = new THREE.MeshBasicMaterial({ map: tangentLabelTexture, transparent: true });
        const tangentLabelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.3), tangentLabelMaterial);
        tangentLabelMesh.position.set(radius, -1.5, 0);
        tangentLabelMesh.rotation.z = Math.PI / 2;
        this.so2AlgebraGroup.add(tangentLabelMesh);
        
        this.algebraVectorLine = new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0xff88ff, linewidth: 3 })
        );
        this.so2AlgebraGroup.add(this.algebraVectorLine);
        
        this.algebraArrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(radius, 0, 0),
            0.5,
            0xff88ff
        );
        this.so2AlgebraGroup.add(this.algebraArrow);
        
        this.algebraVectorMarker = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff88ff })
        );
        this.so2AlgebraGroup.add(this.algebraVectorMarker);
        
        const formulaCanvas = document.createElement('canvas');
        formulaCanvas.width = 512;
        formulaCanvas.height = 192;
        const formulaCtx = formulaCanvas.getContext('2d');
        formulaCtx.fillStyle = '#0a1628';
        formulaCtx.fillRect(0, 0, 512, 192);
        formulaCtx.fillStyle = '#e94560';
        formulaCtx.font = 'bold 26px Courier New';
        formulaCtx.fillText('SO(2) - 圆群（1维流形）', 20, 40);
        formulaCtx.fillText('so(2) - 恒等元处的切空间（1维向量空间）', 20, 75);
        formulaCtx.fillStyle = '#53d8fb';
        formulaCtx.font = '22px Arial';
        formulaCtx.fillText('so(2) = { K | Kᵀ = -K } = { θ·J | θ ∈ ℝ }', 20, 120);
        formulaCtx.fillText('其中 J = [0 -1; 1  0] 是生成元', 20, 155);
        const formulaTexture = new THREE.CanvasTexture(formulaCanvas);
        const formulaMaterial = new THREE.MeshBasicMaterial({
            map: formulaTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const formulaMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.9), formulaMaterial);
        formulaMesh.position.set(0, 2.2, 0);
        formulaMesh.rotation.x = -0.3;
        this.so2AlgebraGroup.add(formulaMesh);
        
        this.so2AlgebraGroup.visible = true;
        this.algebraScene.add(this.so2AlgebraGroup);
        this.currentAlgebra = 'so2';
        
        this.updateAlgebraVector(0.5);
    }
    
    createSO3AlgebraVisualization() {
        this.so3AlgebraGroup = new THREE.Group();
        
        const axisLength = 2;
        const axisGeometry = new THREE.BufferGeometry();
        const axisPoints = [
            -axisLength, 0, 0, axisLength, 0, 0,
            0, -axisLength, 0, 0, axisLength, 0,
            0, 0, -axisLength, 0, 0, axisLength
        ];
        axisGeometry.setAttribute('position', new THREE.Float32BufferAttribute(axisPoints, 3));
        const axisMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
        const axes = new THREE.LineSegments(axisGeometry, axisMaterial);
        this.so3AlgebraGroup.add(axes);
        
        const originSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xff6b6b })
        );
        this.so3AlgebraGroup.add(originSphere);
        
        const originLabelCanvas = document.createElement('canvas');
        originLabelCanvas.width = 128;
        originLabelCanvas.height = 64;
        const originLabelCtx = originLabelCanvas.getContext('2d');
        originLabelCtx.fillStyle = '#ff6b6b';
        originLabelCtx.font = 'bold 28px Arial';
        originLabelCtx.fillText('I', 0, 40);
        const originLabelTexture = new THREE.CanvasTexture(originLabelCanvas);
        const originLabelMaterial = new THREE.MeshBasicMaterial({ map: originLabelTexture, transparent: true });
        const originLabelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.15), originLabelMaterial);
        originLabelMesh.position.set(0.3, 0.3, 0);
        this.so3AlgebraGroup.add(originLabelMesh);
        
        const tangentSpaceCanvas = document.createElement('canvas');
        tangentSpaceCanvas.width = 384;
        tangentSpaceCanvas.height = 64;
        const tangentSpaceCtx = tangentSpaceCanvas.getContext('2d');
        tangentSpaceCtx.fillStyle = '#00ff88';
        tangentSpaceCtx.font = 'bold 28px Arial';
        tangentSpaceCtx.fillText('切空间 T₁SO(3) = so(3)', 0, 40);
        const tangentSpaceTexture = new THREE.CanvasTexture(tangentSpaceCanvas);
        const tangentSpaceMaterial = new THREE.MeshBasicMaterial({ map: tangentSpaceTexture, transparent: true });
        const tangentSpaceMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.3), tangentSpaceMaterial);
        tangentSpaceMesh.position.set(0, -1.3, 0);
        tangentSpaceMesh.rotation.x = -0.3;
        this.so3AlgebraGroup.add(tangentSpaceMesh);
        
        this.algebraVector3D = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0),
            1.5,
            0xff88ff
        );
        this.so3AlgebraGroup.add(this.algebraVector3D);
        
        this.algebraVectorMarker = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff88ff })
        );
        this.so3AlgebraGroup.add(this.algebraVectorMarker);
        
        const basisColors = [0xff6b6b, 0x4ecdc4, 0xffe66d];
        const basisLabels = ['ω₁', 'ω₂', 'ω₃'];
        const basisDirections = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 1)
        ];
        
        for (let i = 0; i < 3; i++) {
            const basisArrow = new THREE.ArrowHelper(
                basisDirections[i],
                new THREE.Vector3(0, 0, 0),
                0.6,
                basisColors[i],
                0.15,
                0.1
            );
            this.so3AlgebraGroup.add(basisArrow);
            
            const basisLabelCanvas = document.createElement('canvas');
            basisLabelCanvas.width = 64;
            basisLabelCanvas.height = 64;
            const basisLabelCtx = basisLabelCanvas.getContext('2d');
            basisLabelCtx.fillStyle = '#' + basisColors[i].toString(16).padStart(6, '0');
            basisLabelCtx.font = 'bold 28px Arial';
            basisLabelCtx.fillText(basisLabels[i], 0, 40);
            const basisLabelTexture = new THREE.CanvasTexture(basisLabelCanvas);
            const basisLabelMaterial = new THREE.MeshBasicMaterial({ map: basisLabelTexture, transparent: true });
            const basisLabelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), basisLabelMaterial);
            basisLabelMesh.position.copy(basisDirections[i].multiplyScalar(0.8));
            basisLabelMesh.position.add(basisDirections[i].multiplyScalar(0.3));
            this.so3AlgebraGroup.add(basisLabelMesh);
        }
        
        const formulaCanvas = document.createElement('canvas');
        formulaCanvas.width = 640;
        formulaCanvas.height = 224;
        const formulaCtx = formulaCanvas.getContext('2d');
        formulaCtx.fillStyle = '#0a1628';
        formulaCtx.fillRect(0, 0, 640, 224);
        formulaCtx.fillStyle = '#e94560';
        formulaCtx.font = 'bold 26px Courier New';
        formulaCtx.fillText('SO(3) - 3维旋转群（3维流形）', 20, 40);
        formulaCtx.fillText('so(3) - 恒等元处的切空间（3维向量空间）', 20, 75);
        formulaCtx.fillStyle = '#53d8fb';
        formulaCtx.font = '22px Arial';
        formulaCtx.fillText('so(3) = { K ∈ ℝ³ˣ³ | Kᵀ = -K }', 20, 120);
        formulaCtx.fillText('K = ω₁J₁ + ω₂J₂ + ω₃J₃, 其中 Ji 是生成元', 20, 155);
        formulaCtx.fillStyle = '#f39c12';
        formulaCtx.font = '18px Arial';
        formulaCtx.fillText('角速度向量 ω = (ω₁, ω₂, ω₃) 表示绕各轴的旋转速度', 20, 195);
        const formulaTexture = new THREE.CanvasTexture(formulaCanvas);
        const formulaMaterial = new THREE.MeshBasicMaterial({
            map: formulaTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const formulaMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 1), formulaMaterial);
        formulaMesh.position.set(0, 1.8, 0);
        formulaMesh.rotation.x = -0.3;
        this.so3AlgebraGroup.add(formulaMesh);
        
        this.so3AlgebraGroup.visible = false;
        this.algebraScene.add(this.so3AlgebraGroup);
    }
    
    updateAlgebraVector(theta) {
        const radius = 1.5;
        const length = Math.min(Math.abs(theta) * 1.2, 1.5);
        
        if (this.currentAlgebra === 'so2') {
            const startX = radius;
            const startY = 0;
            const endX = radius;
            const endY = theta * 1.2;
            
            this.algebraArrow.position.set(radius, endY / 2, 0);
            this.algebraArrow.setDirection(new THREE.Vector3(0, Math.sign(theta), 0));
            this.algebraArrow.setLength(Math.max(length, 0.1), 0.15, 0.1);
            
            this.algebraVectorMarker.position.set(radius, endY, 0);
            
            const linePoints = [startX, startY, 0, endX, endY, 0];
            this.algebraVectorLine.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
            this.algebraVectorLine.geometry.attributes.position.needsUpdate = true;
        } else {
            const dir = new THREE.Vector3(theta, 0, 0).normalize();
            if (length > 0.01) {
                this.algebraVector3D.setDirection(dir);
                this.algebraVector3D.setLength(length, 0.2, 0.15);
            }
        }
    }
    
    onAlgebraResize() {
        this.updateAlgebraRendererSize();
    }
    
    switchAlgebra(type) {
        this.currentAlgebra = type;
        
        document.querySelectorAll('.manifold-btn').forEach(btn => {
            if (btn.id === 'so2AlgebraBtn' || btn.id === 'so3AlgebraBtn') {
                btn.classList.toggle('active', btn.id === type + 'AlgebraBtn');
            }
        });
        
        if (this.so2AlgebraGroup) {
            this.so2AlgebraGroup.visible = (type === 'so2');
        }
        if (this.so3AlgebraGroup) {
            this.so3AlgebraGroup.visible = (type === 'so3');
        }
        
        if (type === 'so2') {
            this.updateAlgebraVector(0.5);
        } else {
            const x = parseFloat(document.getElementById('algebra-rx').value);
            const y = parseFloat(document.getElementById('algebra-ry').value);
            const z = parseFloat(document.getElementById('algebra-rz').value);
            this.updateAlgebraVector3D(x, y, z);
        }
    }
    
    createSO2Visualization() {
        this.so2Group = new THREE.Group();
        
        const circleGeometry = new THREE.BufferGeometry();
        const circlePoints = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            circlePoints.push(
                Math.cos(angle) * 1.2,
                Math.sin(angle) * 1.2,
                0
            );
        }
        circleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(circlePoints, 3));
        const circleMaterial = new THREE.LineBasicMaterial({ color: 0x00aaff, linewidth: 3 });
        const circle = new THREE.Line(circleGeometry, circleMaterial);
        this.so2Group.add(circle);
        
        const axisGeometry = new THREE.BufferGeometry();
        const axisPoints = [
            -1.5, 0, 0,
            1.5, 0, 0,
            0, -1.5, 0,
            0, 1.5, 0
        ];
        axisGeometry.setAttribute('position', new THREE.Float32BufferAttribute(axisPoints, 3));
        const axisMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
        const axes = new THREE.LineSegments(axisGeometry, axisMaterial);
        this.so2Group.add(axes);
        
        const markerGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
        this.rotationMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        this.so2Group.add(this.rotationMarker);
        
        const lineGeometry = new THREE.BufferGeometry();
        const linePoints = [0, 0, 0, 1.2, 0, 0];
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff88 });
        this.rotationPath = new THREE.Line(lineGeometry, lineMaterial);
        this.so2Group.add(this.rotationPath);
        
        const labelGeometry = new THREE.PlaneGeometry(0.4, 0.2);
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#00aaff';
        ctx.font = '24px Arial';
        ctx.fillText('θ=0', 0, 40);
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(1.4, -0.2, 0);
        this.so2Group.add(label);
        
        const label2Geometry = new THREE.PlaneGeometry(0.4, 0.2);
        const canvas2 = document.createElement('canvas');
        canvas2.width = 128;
        canvas2.height = 64;
        const ctx2 = canvas2.getContext('2d');
        ctx2.fillStyle = '#00aaff';
        ctx2.font = '24px Arial';
        ctx2.fillText('θ=π/2', 0, 40);
        const texture2 = new THREE.CanvasTexture(canvas2);
        const labelMaterial2 = new THREE.MeshBasicMaterial({ map: texture2, transparent: true });
        const label2 = new THREE.Mesh(label2Geometry, labelMaterial2);
        label2.position.set(0, 1.4, 0);
        this.so2Group.add(label2);
        
        const label3Geometry = new THREE.PlaneGeometry(0.4, 0.2);
        const canvas3 = document.createElement('canvas');
        canvas3.width = 128;
        canvas3.height = 64;
        const ctx3 = canvas3.getContext('2d');
        ctx3.fillStyle = '#00aaff';
        ctx3.font = '24px Arial';
        ctx3.fillText('θ=π', 0, 40);
        const texture3 = new THREE.CanvasTexture(canvas3);
        const labelMaterial3 = new THREE.MeshBasicMaterial({ map: texture3, transparent: true });
        const label3 = new THREE.Mesh(label3Geometry, labelMaterial3);
        label3.position.set(-1.4, -0.2, 0);
        this.so2Group.add(label3);
        
        this.manifoldScene.add(this.so2Group);
        this.updateSO2Marker(0);
    }
    
    createSO3Visualization() {
        this.so3Group = new THREE.Group();
        
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x4a90d9,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.so3Group.add(sphere);
        
        const wireframeGeometry = new THREE.WireframeGeometry(sphereGeometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.3 });
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        this.so3Group.add(wireframe);
        
        const gridGeometry = new THREE.BufferGeometry();
        const gridPoints = [];
        for (let i = -1; i <= 1; i += 0.5) {
            gridPoints.push(i, 0, -1, i, 0, 1);
            gridPoints.push(-1, 0, i, 1, 0, i);
            gridPoints.push(0, i, -1, 0, i, 1);
            gridPoints.push(-1, i, 0, 1, i, 0);
        }
        gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3));
        const gridMaterial = new THREE.LineBasicMaterial({ color: 0x0f3460, transparent: true, opacity: 0.5 });
        const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
        this.so3Group.add(grid);
        
        const centerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        this.so3Group.add(center);
        
        const axisLength = 1.2;
        const axisGeometry = new THREE.BufferGeometry();
        const axisPoints = [
            -axisLength, 0, 0, axisLength, 0, 0,
            0, -axisLength, 0, 0, axisLength, 0,
            0, 0, -axisLength, 0, 0, axisLength
        ];
        axisGeometry.setAttribute('position', new THREE.Float32BufferAttribute(axisPoints, 3));
        const axisMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
        const axes = new THREE.LineSegments(axisGeometry, axisMaterial);
        this.so3Group.add(axes);
        
        this.rotationMarker = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x00ff88 })
        );
        this.so3Group.add(this.rotationMarker);
        
        const markerLineGeometry = new THREE.BufferGeometry();
        const markerLinePoints = [0, 0, 0, 1, 0, 0];
        markerLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(markerLinePoints, 3));
        this.rotationPath = new THREE.Line(
            markerLineGeometry,
            new THREE.LineBasicMaterial({ color: 0x00ff88 })
        );
        this.so3Group.add(this.rotationPath);
        
        const surfacePoints = [];
        const surfaceGeometry = new THREE.BufferGeometry();
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                const phi = (i / 20) * Math.PI * 2;
                const theta = (j / 10) * Math.PI;
                const x = Math.sin(theta) * Math.cos(phi);
                const y = Math.sin(theta) * Math.sin(phi);
                const z = Math.cos(theta);
                surfacePoints.push(x, y, z);
            }
        }
        surfaceGeometry.setAttribute('position', new THREE.Float32BufferAttribute(surfacePoints, 3));
        const surfaceMaterial = new THREE.PointsMaterial({ color: 0xffaa00, size: 0.05 });
        const surfacePointsMesh = new THREE.Points(surfaceGeometry, surfaceMaterial);
        this.so3Group.add(surfacePointsMesh);
        
        const northPole = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff6600 })
        );
        northPole.position.set(0, 1, 0);
        this.so3Group.add(northPole);
        
        const southPole = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff6600 })
        );
        southPole.position.set(0, -1, 0);
        this.so3Group.add(southPole);
        
        this.so3Group.visible = false;
        this.manifoldScene.add(this.so3Group);
    }
    
    updateSO2Marker(theta) {
        const x = Math.cos(theta) * 1.2;
        const y = Math.sin(theta) * 1.2;
        this.rotationMarker.position.set(x, y, 0);
        
        const linePoints = [0, 0, 0, x, y, 0];
        this.rotationPath.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
        this.rotationPath.geometry.attributes.position.needsUpdate = true;
    }
    
    updateSO3Marker(x, y, z) {
        const length = Math.sqrt(x * x + y * y + z * z);
        const theta = Math.min(length, Math.PI);
        
        if (length > 0.001) {
            this.rotationMarker.position.set(x, y, z);
            const linePoints = [0, 0, 0, x, y, z];
            this.rotationPath.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
            this.rotationPath.geometry.attributes.position.needsUpdate = true;
        } else {
            this.rotationMarker.position.set(0, 0, 0);
            const linePoints = [0, 0, 0, 0, 0, 0];
            this.rotationPath.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
            this.rotationPath.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    setupManifoldControls() {
        document.getElementById('so2Btn').addEventListener('click', () => this.switchManifold('so2'));
        document.getElementById('so3Btn').addEventListener('click', () => this.switchManifold('so3'));
    }
    
    setupAlgebraControls() {
        document.getElementById('so2AlgebraBtn').addEventListener('click', () => this.switchAlgebra('so2'));
        document.getElementById('so3AlgebraBtn').addEventListener('click', () => this.switchAlgebra('so3'));
        document.getElementById('algebraAnimateBtn').addEventListener('click', () => this.toggleAlgebraAnimation());
    }
    
    toggleAlgebraAnimation() {
        this.algebraAnimationEnabled = !this.algebraAnimationEnabled;
        const btn = document.getElementById('algebraAnimateBtn');
        btn.textContent = this.algebraAnimationEnabled ? '停止' : '动画';
        btn.style.background = this.algebraAnimationEnabled ? '#e94560' : '';
    }
    
    setupAlgebraVectorControls() {
        const algebraRxSlider = document.getElementById('algebra-rx');
        const algebraRySlider = document.getElementById('algebra-ry');
        const algebraRzSlider = document.getElementById('algebra-rz');
        const algebraRxNum = document.getElementById('algebra-rx-num');
        const algebraRyNum = document.getElementById('algebra-ry-num');
        const algebraRzNum = document.getElementById('algebra-rz-num');
        
        const updateAlgebraVector = () => {
            const x = parseFloat(algebraRxSlider.value);
            const y = parseFloat(algebraRySlider.value);
            const z = parseFloat(algebraRzSlider.value);
            
            algebraRxNum.value = x.toFixed(2);
            algebraRyNum.value = y.toFixed(2);
            algebraRzNum.value = z.toFixed(2);
            
            if (this.currentAlgebra === 'so3') {
                this.updateAlgebraVector3D(x, y, z);
            }
        };
        
        algebraRxSlider.addEventListener('input', updateAlgebraVector);
        algebraRySlider.addEventListener('input', updateAlgebraVector);
        algebraRzSlider.addEventListener('input', updateAlgebraVector);
        
        algebraRxNum.addEventListener('input', (e) => {
            algebraRxSlider.value = parseFloat(e.target.value);
            updateAlgebraVector();
        });
        
        algebraRyNum.addEventListener('input', (e) => {
            algebraRySlider.value = parseFloat(e.target.value);
            updateAlgebraVector();
        });
        
        algebraRzNum.addEventListener('input', (e) => {
            algebraRzSlider.value = parseFloat(e.target.value);
            updateAlgebraVector();
        });
    }
    
    updateAlgebraVector3D(x, y, z) {
        const vector = new THREE.Vector3(x, y, z);
        const length = Math.min(vector.length() * 1.2, 1.8);
        
        if (length > 0.01) {
            const direction = vector.clone().normalize();
            this.algebraVector3D.setDirection(direction);
            this.algebraVector3D.setLength(length, 0.2, 0.15);
            
            const endPoint = direction.multiplyScalar(length);
            this.algebraVectorMarker.position.copy(endPoint);
        }
    }
    
    switchManifold(type) {
        this.currentManifold = type;
        
        document.querySelectorAll('.manifold-btn').forEach(btn => {
            btn.classList.toggle('active', btn.id === type + 'Btn');
        });
        
        this.so2Group.visible = (type === 'so2');
        this.so3Group.visible = (type === 'so3');
        
        if (type === 'so2') {
            this.updateSO2Marker(0);
        } else {
            this.updateSO3Marker(0.5, 0.5, 0.5);
        }
    }
    
    setupTopicToggle() {
        const firstHeader = document.querySelector('.topic-header');
        if (firstHeader) {
            firstHeader.classList.add('active');
            firstHeader.nextElementSibling.classList.add('active');
        }
    }
    
    setupTabSwitching() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    }
    
    switchTab(tab) {
        this.currentTab = tab;
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === tab + '-panel');
        });
        
        const controlsPanel = document.getElementById('controls-panel');
        const algebraControlsPanel = document.getElementById('algebra-controls-panel');
        
        if (tab === 'algebra') {
            controlsPanel.style.display = 'none';
            algebraControlsPanel.style.display = 'block';
        } else {
            controlsPanel.style.display = 'block';
            algebraControlsPanel.style.display = 'none';
        }
        
        setTimeout(() => {
            this.updateRotationRendererSize();
            this.updateManifoldRendererSize();
            this.updateAlgebraRendererSize();
        }, 50);
    }
    
    setupControls() {
        const rxSlider = document.getElementById('rx');
        const rySlider = document.getElementById('ry');
        const rzSlider = document.getElementById('rz');
        const rxNum = document.getElementById('rx-num');
        const ryNum = document.getElementById('ry-num');
        const rzNum = document.getElementById('rz-num');
        
        const updateRotation = () => {
            this.rotationVector.x = parseFloat(rxSlider.value);
            this.rotationVector.y = parseFloat(rySlider.value);
            this.rotationVector.z = parseFloat(rzSlider.value);
            
            rxNum.value = this.rotationVector.x.toFixed(2);
            ryNum.value = this.rotationVector.y.toFixed(2);
            rzNum.value = this.rotationVector.z.toFixed(2);
            
            this.updateRotation();
            this.updateManifoldFromRotation();
        };
        
        rxSlider.addEventListener('input', updateRotation);
        rySlider.addEventListener('input', updateRotation);
        rzSlider.addEventListener('input', updateRotation);
        
        rxNum.addEventListener('input', (e) => {
            rxSlider.value = parseFloat(e.target.value);
            updateRotation();
        });
        
        ryNum.addEventListener('input', (e) => {
            rySlider.value = parseFloat(e.target.value);
            updateRotation();
        });
        
        rzNum.addEventListener('input', (e) => {
            rzSlider.value = parseFloat(e.target.value);
            updateRotation();
        });
        
        document.getElementById('calculateBtn').addEventListener('click', () => this.showCalculation());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('animateBtn').addEventListener('click', () => this.toggleAnimation());
    }
    
    updateManifoldFromRotation() {
        const { x, y, z } = this.rotationVector;
        const theta = Math.sqrt(x*x + y*y + z*z);
        
        if (theta > 0.001) {
            const normalizedX = x / theta * (theta / Math.PI);
            const normalizedY = y / theta * (theta / Math.PI);
            const normalizedZ = z / theta * (theta / Math.PI);
            
            this.updateSO3Marker(normalizedX, normalizedY, normalizedZ);
        } else {
            this.updateSO3Marker(0, 0, 0);
        }
    }
    
    updateRotation() {
        const { x, y, z } = this.rotationVector;
        const rotationMatrix = LieAlgebra.rotationVectorToMatrix([x, y, z]);
        
        this.cubeGroup.matrixAutoUpdate = false;
        this.cubeGroup.matrix.fromArray([
            rotationMatrix[0][0], rotationMatrix[0][1], rotationMatrix[0][2], 0,
            rotationMatrix[1][0], rotationMatrix[1][1], rotationMatrix[1][2], 0,
            rotationMatrix[2][0], rotationMatrix[2][1], rotationMatrix[2][2], 0,
            0, 0, 0, 1
        ]);
    }
    
    showCalculation() {
        const { x, y, z } = this.rotationVector;
        const theta = Math.sqrt(x*x + y*y + z*z);
        const ux = theta > 0.001 ? x / theta : 0;
        const uy = theta > 0.001 ? y / theta : 0;
        const uz = theta > 0.001 ? z / theta : 0;
        
        const K = [
            [0, -uz, uy],
            [uz, 0, -ux],
            [-uy, ux, 0]
        ];
        
        const uuT = [
            [ux*ux, ux*uy, ux*uz],
            [uy*ux, uy*uy, uy*uz],
            [uz*ux, uz*uy, uz*uz]
        ];
        
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        
        const R = LieAlgebra.rotationVectorToMatrix([x, y, z]);
        
        let calcHTML = '<div class="calc-step"><strong>输入：</strong>旋转向量 ω = [' + x.toFixed(3) + ', ' + y.toFixed(3) + ', ' + z.toFixed(3) + ']ᵀ</div>';
        
        calcHTML += '<div class="calc-step"><strong>步骤1：</strong>计算旋转向量的模长<br>θ = ||ω|| = √(' + x.toFixed(3) + '² + ' + y.toFixed(3) + '² + ' + z.toFixed(3) + '²) = ' + theta.toFixed(3) + ' rad</div>';
        
        calcHTML += '<div class="calc-step"><strong>步骤2：</strong>计算单位旋转向量<br>u = ω/θ = [' + ux.toFixed(3) + ', ' + uy.toFixed(3) + ', ' + uz.toFixed(3) + ']ᵀ</div>';
        
        calcHTML += '<div class="calc-step"><strong>步骤3：</strong>构建反对称矩阵 [u]× = K<br>K = [ 0   -' + uz.toFixed(3) + '   ' + uy.toFixed(3) + ' ]<br>    [ ' + uz.toFixed(3) + '     0    -' + ux.toFixed(3) + ' ]<br>    [-' + uy.toFixed(3) + '   ' + ux.toFixed(3) + '     0    ]</div>';
        
        calcHTML += '<div class="calc-step"><strong>步骤4：</strong>计算 Rodrigues 公式<br>R = cos(θ)I + (1-cos(θ))uuᵀ + sin(θ)[u]×</div>';
        
        calcHTML += '<div class="calc-step"><strong>步骤5：</strong>计算最终旋转矩阵<br>R = [' + R[0].map(v => v.toFixed(3)).join(', ') + ']<br>  [' + R[1].map(v => v.toFixed(3)).join(', ') + ']<br>  [' + R[2].map(v => v.toFixed(3)).join(', ') + ']</div>';
        
        const calcContent = document.getElementById('calculation-content');
        if (calcContent) {
            calcContent.innerHTML = calcHTML;
            document.getElementById('calculation-panel').classList.add('active');
        }
    }
    
    reset() {
        this.rotationVector = { x: 0, y: 0, z: 0 };
        
        document.getElementById('rx').value = 0;
        document.getElementById('ry').value = 0;
        document.getElementById('rz').value = 0;
        document.getElementById('rx-num').value = '0.00';
        document.getElementById('ry-num').value = '0.00';
        document.getElementById('rz-num').value = '0.00';
        
        this.updateRotation();
        this.updateSO2Marker(0);
        this.updateSO3Marker(0, 0, 0);
        
        if (this.isAnimating) {
            this.toggleAnimation();
        }
    }
    
    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        
        const btn = document.getElementById('animateBtn');
        btn.textContent = this.isAnimating ? '停止' : '动画';
        btn.classList.toggle('active', this.isAnimating);
        
        if (this.isAnimating) {
            this.animateRotation();
        } else {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animateRotation() {
        if (!this.isAnimating) return;
        
        const time = Date.now() * 0.001;
        this.rotationVector.x = Math.sin(time) * 1.5;
        this.rotationVector.y = Math.cos(time * 0.7) * 1.5;
        this.rotationVector.z = Math.sin(time * 0.5) * 1.5;
        
        document.getElementById('rx').value = this.rotationVector.x;
        document.getElementById('ry').value = this.rotationVector.y;
        document.getElementById('rz').value = this.rotationVector.z;
        document.getElementById('rx-num').value = this.rotationVector.x.toFixed(2);
        document.getElementById('ry-num').value = this.rotationVector.y.toFixed(2);
        document.getElementById('rz-num').value = this.rotationVector.z.toFixed(2);
        
        this.updateRotation();
        this.updateManifoldFromRotation();
        
        this.animationId = requestAnimationFrame(() => this.animateRotation());
    }
    
    onWindowResize() {
        this.updateRotationRendererSize();
        this.updateManifoldRendererSize();
    }
    
    onManifoldResize() {
        this.updateManifoldRendererSize();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.orbitControls) {
            this.orbitControls.update();
        }
        if (this.manifoldOrbitControls) {
            this.manifoldOrbitControls.update();
        }
        if (this.algebraOrbitControls) {
            this.algebraOrbitControls.update();
        }
        
        if (this.algebraAnimationEnabled && this.algebraScene) {
            this.algebraAnimationTime += 0.02;
            
            if (this.currentAlgebra === 'so2') {
                const theta = Math.sin(this.algebraAnimationTime) * 1;
                this.updateAlgebraVector(theta);
            } else {
                const x = Math.sin(this.algebraAnimationTime * 0.7) * 1;
                const y = Math.cos(this.algebraAnimationTime * 0.5) * 1;
                const z = Math.sin(this.algebraAnimationTime * 0.3) * 1;
                
                document.getElementById('algebra-rx').value = x.toFixed(2);
                document.getElementById('algebra-ry').value = y.toFixed(2);
                document.getElementById('algebra-rz').value = z.toFixed(2);
                document.getElementById('algebra-rx-num').value = x.toFixed(2);
                document.getElementById('algebra-ry-num').value = y.toFixed(2);
                document.getElementById('algebra-rz-num').value = z.toFixed(2);
                
                this.updateAlgebraVector3D(x, y, z);
            }
        }
        
        this.renderer.render(this.scene, this.camera);
        this.manifoldRenderer.render(this.manifoldScene, this.manifoldCamera);
        if (this.algebraRenderer && this.algebraScene) {
            this.algebraRenderer.render(this.algebraScene, this.algebraCamera);
        }
    }
}

function toggleTopic(header) {
    header.classList.toggle('active');
    header.nextElementSibling.classList.toggle('active');
    header.querySelector('.arrow').textContent = header.classList.contains('active') ? '▲' : '▼';
}

document.addEventListener('DOMContentLoaded', () => {
    new LieVisualization();
});
