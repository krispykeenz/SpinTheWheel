// Default wheel options
let options = [
    { text: '15% OFF!', color: '#FFD93D' },
    { text: '20% OFF!', color: '#FF6B6B' },
    { text: '25% OFF!', color: '#6BCB77' },
    { text: '30% OFF!', color: '#4D96FF' },
    { text: '50% OFF!', color: '#9B59B6' },
    { text: 'FREE COFFEE!', color: '#1ABC9C' }
];

// Bagel-inspired color palette
const bagelColors = [
    '#F4A460', // Sandy brown
    '#DEB887', // Burlywood
    '#D2691E', // Chocolate
    '#CD853F', // Peru
    '#DAA520', // Goldenrod
    '#BC8F8F', // Rosy brown
    '#F5DEB3', // Wheat
    '#FFDAB9', // Peach puff
    '#FFE4B5', // Moccasin
    '#E9967A', // Dark salmon
];

let currentRotation = 0;
let isSpinning = false;

// DOM Elements
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');
const spinModeBtn = document.getElementById('spinModeBtn');
const editModeBtn = document.getElementById('editModeBtn');
const spinControls = document.getElementById('spinControls');
const editControls = document.getElementById('editControls');
const optionsList = document.getElementById('optionsList');
const newOptionInput = document.getElementById('newOption');
const addBtn = document.getElementById('addBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOptions();
    renderWheel();
    renderOptionsList();
    setupEventListeners();
});

function setupEventListeners() {
    spinBtn.addEventListener('click', spinWheel);
    spinModeBtn.addEventListener('click', () => setMode('spin'));
    editModeBtn.addEventListener('click', () => setMode('edit'));
    addBtn.addEventListener('click', addOption);
    newOptionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addOption();
    });
}

function setMode(mode) {
    if (mode === 'spin') {
        spinModeBtn.classList.add('active');
        editModeBtn.classList.remove('active');
        spinControls.classList.remove('hidden');
        editControls.classList.add('hidden');
    } else {
        editModeBtn.classList.add('active');
        spinModeBtn.classList.remove('active');
        editControls.classList.remove('hidden');
        spinControls.classList.add('hidden');
        resultDiv.classList.remove('show');
    }
}

function renderWheel() {
    // Clear existing segments (keep bagel hole)
    const existingSegments = wheel.querySelectorAll('.wheel-segment');
    existingSegments.forEach(seg => seg.remove());
    
    if (options.length === 0) return;
    
    const segmentAngle = 360 / options.length;
    
    options.forEach((option, index) => {
        const segment = document.createElement('div');
        segment.className = 'wheel-segment';
        segment.style.setProperty('--segment-angle', `${segmentAngle}deg`);
        
        // Create clip path for the segment
        const startAngle = index * segmentAngle - 90;
        const endAngle = (index + 1) * segmentAngle - 90;
        
        // Position using rotation
        segment.style.transform = `rotate(${index * segmentAngle}deg) skewY(${-(90 - segmentAngle)}deg)`;
        segment.style.background = option.color;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = option.text;
        textSpan.style.transform = `skewY(${90 - segmentAngle}deg) rotate(${segmentAngle / 2}deg)`;
        
        segment.appendChild(textSpan);
        wheel.appendChild(segment);
    });
    
    // Use conic gradient for cleaner look
    const gradientStops = options.map((option, index) => {
        const start = (index / options.length) * 100;
        const end = ((index + 1) / options.length) * 100;
        return `${option.color} ${start}% ${end}%`;
    }).join(', ');
    
    wheel.style.background = `conic-gradient(from -90deg, ${gradientStops})`;
    
    // Re-render text labels
    renderWheelLabels();
}

function renderWheelLabels() {
    // Remove old labels
    const oldLabels = wheel.querySelectorAll('.wheel-label');
    oldLabels.forEach(label => label.remove());
    
    if (options.length === 0) return;
    
    const segmentAngle = 360 / options.length;
    const radius = 140; // Distance from center for text
    
    options.forEach((option, index) => {
        const label = document.createElement('div');
        label.className = 'wheel-label';
        label.style.position = 'absolute';
        label.style.left = '50%';
        label.style.top = '50%';
        label.style.transformOrigin = 'center';
        
        const angle = (index * segmentAngle) + (segmentAngle / 2) - 90;
        const angleRad = (angle * Math.PI) / 180;
        
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;
        
        label.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle + 90}deg)`;
        label.style.fontWeight = 'bold';
        label.style.fontSize = options.length > 8 ? '11px' : '14px';
        label.style.color = '#5c3d2e';
        label.style.textShadow = '1px 1px 2px rgba(255,255,255,0.8)';
        label.style.zIndex = '45';
        label.style.maxWidth = '70px';
        label.style.textAlign = 'center';
        label.style.wordWrap = 'break-word';
        label.style.pointerEvents = 'none';
        label.textContent = option.text;
        
        wheel.appendChild(label);
    });
}

function spinWheel() {
    if (isSpinning || options.length === 0) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    resultDiv.classList.remove('show');
    
    // Random spin between 5-10 full rotations plus random position
    const spins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = currentRotation + (spins * 360) + randomAngle;
    
    wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    currentRotation = totalRotation;
    
    // Determine winner after spin
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        
        // Calculate which segment is at the top (pointer position)
        const normalizedRotation = ((totalRotation % 360) + 360) % 360;
        const segmentAngle = 360 / options.length;
        const winningIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % options.length;
        
        const winner = options[winningIndex % options.length];
        resultDiv.textContent = `🎉 ${winner.text} 🎉`;
        resultDiv.classList.add('show');
    }, 4000);
}

function renderOptionsList() {
    optionsList.innerHTML = '';
    
    options.forEach((option, index) => {
        const item = document.createElement('div');
        item.className = 'option-item';
        
        const colorPreview = document.createElement('div');
        colorPreview.className = 'color-preview';
        colorPreview.style.background = option.color;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = option.text;
        input.addEventListener('change', (e) => {
            options[index].text = e.target.value;
            saveOptions();
            renderWheel();
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            options.splice(index, 1);
            saveOptions();
            renderWheel();
            renderOptionsList();
        });
        
        item.appendChild(colorPreview);
        item.appendChild(input);
        item.appendChild(deleteBtn);
        optionsList.appendChild(item);
    });
}

function addOption() {
    const text = newOptionInput.value.trim();
    if (!text) return;
    
    const color = bagelColors[options.length % bagelColors.length];
    options.push({ text, color });
    
    newOptionInput.value = '';
    saveOptions();
    renderWheel();
    renderOptionsList();
}

function saveOptions() {
    localStorage.setItem('wheelOptions', JSON.stringify(options));
}

function loadOptions() {
    const saved = localStorage.getItem('wheelOptions');
    if (saved) {
        options = JSON.parse(saved);
    }
}
