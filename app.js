let scene, camera, renderer, character, isFocused = false;
let treePoints = 100;
let treeCount = 0;
const maxTrees = 100;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 50);
    camera.lookAt(0, 5, 0);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('3dMap').appendChild(renderer.domElement);

    let planeGeometry = new THREE.PlaneGeometry(200, 200);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: 0x55aa55 });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    let ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    scene.add(directionalLight);

    window.addEventListener('resize', onWindowResize, false);
    createCharacter();
    document.getElementById('3dMap').addEventListener('mouseenter', () => isFocused = true);
    document.getElementById('3dMap').addEventListener('mouseleave', () => isFocused = false);
    window.addEventListener('keydown', (event) => { 
        if (isFocused) {
            moveCharacter(event); 
            event.preventDefault(); 
        }
    }, false);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function createCharacter() {
    let bodyGeometry = new THREE.BoxGeometry(3, 6, 2);
    let bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xf1c27d });
    let body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    let headGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    let headMaterial = new THREE.MeshLambertMaterial({ color: 0xf1c27d });
    let head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 5;
    let armGeometry = new THREE.BoxGeometry(1, 4, 1);
    let armMaterial = new THREE.MeshLambertMaterial({ color: 0xf1c27d });
    let leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-2.5, 1, 0);
    let rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(2.5, 1, 0);
    let legGeometry = new THREE.BoxGeometry(1, 5, 1);
    let legMaterial = new THREE.MeshLambertMaterial({ color: 0x5a3c25 });
    let leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-1, -3, 0);
    let rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(1, -3, 0);
    character = new THREE.Group();
    character.add(body);
    character.add(head);
    character.add(leftArm);
    character.add(rightArm);
    character.add(leftLeg);
    character.add(rightLeg);
    character.position.set(0, 5, 0);
    scene.add(character);
}

function moveCharacter(event) {
    let moveDistance = 1;

    switch (event.key) {
        case 'ArrowUp':
            character.position.z -= moveDistance;
            break;
        case 'ArrowDown':
            character.position.z += moveDistance;
            break;
        case 'ArrowLeft':
            character.position.x -= moveDistance;
            break;
        case 'ArrowRight':
            character.position.x += moveDistance;
            break;
    }
}

function createTree() {
    let trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5);
    let trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    let trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

    let foliageGeometry = new THREE.SphereGeometry(2, 32, 32);
    let foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    let foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 4;

    let tree = new THREE.Group();
    tree.add(trunk);
    tree.add(foliage);
    return tree;
}

function showConfetti() {
    let colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
    for (let i = 0; i < 100; i++) {
        let color = colors[Math.floor(Math.random() * colors.length)];
        let confettiGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        let confettiMaterial = new THREE.MeshBasicMaterial({ color: color });
        let confetti = new THREE.Mesh(confettiGeometry, confettiMaterial);

        confetti.position.set(
            Math.random() * 40 - 20,
            Math.random() * 20 + 10,
            Math.random() * 40 - 20
        );

        scene.add(confetti);
        setTimeout(() => scene.remove(confetti), 2000); 
    }
}

function addTreePoints(points) {
    treePoints += points;
    document.getElementById('treePoints').innerText = `Tree Points: ${treePoints}`;
}

function redeemPoints() {
    if (treePoints >= 10) {
        treePoints -= 10;
        document.getElementById('treePoints').innerText = `Tree Points: ${treePoints}`;
        if (treeCount < maxTrees) {
            let tree = createTree();
            tree.position.set(
                Math.random() * 50 - 25,
                2.5,
                Math.random() * 50 - 25
            );
            scene.add(tree);
            treeCount++;
            showConfetti(); 
        }
    } else {
        alert("Not enough tree points to redeem.");
    }
}

function plantTree() {
    if (treeCount < maxTrees) {
        let tree = createTree();
        tree.position.set(
            Math.random() * 50 - 25, 
            2.5,             
            Math.random() * 50 - 25  
        );
        scene.add(tree);
        treeCount++;
        showConfetti();
        addTreePoints(-10);
    } else {
        alert("Maximum number of trees planted.");
    }
}

function setCharacterName() {
    const name = document.getElementById('characterNameInput').value;
    if (name.trim() !== "") {
        document.getElementById('characterNameTag').innerText = name;
        alert(`Character named: ${name}`);
    } else {
        alert("Please enter a valid name.");
    }
}

init();
animate();



