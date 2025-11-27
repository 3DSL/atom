
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef, useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  type: 'proton' | 'neutron';
  vx: number;
  vy: number;
  vz: number;
  id: number;
}

// Element data database
const ELEMENTS: Record<number, { s: string, ru: string, en: string }> = {
    1: { s: 'H', ru: 'Водород', en: 'Hydrogen' },
    2: { s: 'He', ru: 'Гелий', en: 'Helium' },
    3: { s: 'Li', ru: 'Литий', en: 'Lithium' },
    4: { s: 'Be', ru: 'Бериллий', en: 'Beryllium' },
    5: { s: 'B', ru: 'Бор', en: 'Boron' },
    6: { s: 'C', ru: 'Углерод', en: 'Carbon' },
    7: { s: 'N', ru: 'Азот', en: 'Nitrogen' },
    8: { s: 'O', ru: 'Кислород', en: 'Oxygen' },
    9: { s: 'F', ru: 'Фтор', en: 'Fluorine' },
    10: { s: 'Ne', ru: 'Неон', en: 'Neon' },
    11: { s: 'Na', ru: 'Натрий', en: 'Sodium' },
    12: { s: 'Mg', ru: 'Магний', en: 'Magnesium' },
    13: { s: 'Al', ru: 'Алюминий', en: 'Aluminium' },
    14: { s: 'Si', ru: 'Кремний', en: 'Silicon' },
    15: { s: 'P', ru: 'Фосфор', en: 'Phosphorus' },
    16: { s: 'S', ru: 'Сера', en: 'Sulfur' },
    17: { s: 'Cl', ru: 'Хлор', en: 'Chlorine' },
    18: { s: 'Ar', ru: 'Аргон', en: 'Argon' },
    19: { s: 'K', ru: 'Калий', en: 'Potassium' },
    20: { s: 'Ca', ru: 'Кальций', en: 'Calcium' },
    21: { s: 'Sc', ru: 'Скандий', en: 'Scandium' },
    22: { s: 'Ti', ru: 'Титан', en: 'Titanium' },
    23: { s: 'V', ru: 'Ванадий', en: 'Vanadium' },
    24: { s: 'Cr', ru: 'Хром', en: 'Chromium' },
    25: { s: 'Mn', ru: 'Марганец', en: 'Manganese' },
    26: { s: 'Fe', ru: 'Железо', en: 'Iron' },
    27: { s: 'Co', ru: 'Кобальт', en: 'Cobalt' },
    28: { s: 'Ni', ru: 'Никель', en: 'Nickel' },
    29: { s: 'Cu', ru: 'Медь', en: 'Copper' },
    30: { s: 'Zn', ru: 'Цинк', en: 'Zinc' },
    31: { s: 'Ga', ru: 'Галлий', en: 'Gallium' },
    32: { s: 'Ge', ru: 'Германий', en: 'Germanium' },
    33: { s: 'As', ru: 'Мышьяк', en: 'Arsenic' },
    34: { s: 'Se', ru: 'Селен', en: 'Selenium' },
    35: { s: 'Br', ru: 'Бром', en: 'Bromine' },
    36: { s: 'Kr', ru: 'Криптон', en: 'Krypton' },
    37: { s: 'Rb', ru: 'Рубидий', en: 'Rubidium' },
    38: { s: 'Sr', ru: 'Стронций', en: 'Strontium' },
    39: { s: 'Y', ru: 'Иттрий', en: 'Yttrium' },
    40: { s: 'Zr', ru: 'Цирконий', en: 'Zirconium' },
    41: { s: 'Nb', ru: 'Ниобий', en: 'Niobium' },
    42: { s: 'Mo', ru: 'Молибден', en: 'Molybdenum' },
    43: { s: 'Tc', ru: 'Технеций', en: 'Technetium' },
    44: { s: 'Ru', ru: 'Рутений', en: 'Ruthenium' },
    45: { s: 'Rh', ru: 'Родий', en: 'Rhodium' },
    46: { s: 'Pd', ru: 'Палладий', en: 'Palladium' },
    47: { s: 'Ag', ru: 'Серебро', en: 'Silver' },
    48: { s: 'Cd', ru: 'Кадмий', en: 'Cadmium' },
    49: { s: 'In', ru: 'Индий', en: 'Indium' },
    50: { s: 'Sn', ru: 'Олово', en: 'Tin' },
    51: { s: 'Sb', ru: 'Сурьма', en: 'Antimony' },
    52: { s: 'Te', ru: 'Теллур', en: 'Tellurium' },
    53: { s: 'I', ru: 'Иод', en: 'Iodine' },
    54: { s: 'Xe', ru: 'Ксенон', en: 'Xenon' },
    55: { s: 'Cs', ru: 'Цезий', en: 'Cesium' },
    56: { s: 'Ba', ru: 'Барий', en: 'Barium' },
    57: { s: 'La', ru: 'Лантан', en: 'Lanthanum' },
    58: { s: 'Ce', ru: 'Церий', en: 'Cerium' },
    59: { s: 'Pr', ru: 'Празеодим', en: 'Praseodymium' },
    60: { s: 'Nd', ru: 'Неодим', en: 'Neodymium' },
    61: { s: 'Pm', ru: 'Прометий', en: 'Promethium' },
    62: { s: 'Sm', ru: 'Самарий', en: 'Samarium' },
    63: { s: 'Eu', ru: 'Европий', en: 'Europium' },
    64: { s: 'Gd', ru: 'Гадолиний', en: 'Gadolinium' },
    65: { s: 'Tb', ru: 'Тербий', en: 'Terbium' },
    66: { s: 'Dy', ru: 'Диспрозий', en: 'Dysprosium' },
    67: { s: 'Ho', ru: 'Гольмий', en: 'Holmium' },
    68: { s: 'Er', ru: 'Эрбий', en: 'Erbium' },
    69: { s: 'Tm', ru: 'Тулий', en: 'Thulium' },
    70: { s: 'Yb', ru: 'Иттербий', en: 'Ytterbium' },
    71: { s: 'Lu', ru: 'Лютеций', en: 'Lutetium' },
    72: { s: 'Hf', ru: 'Гафний', en: 'Hafnium' },
    73: { s: 'Ta', ru: 'Тантал', en: 'Tantalum' },
    74: { s: 'W', ru: 'Вольфрам', en: 'Tungsten' },
    75: { s: 'Re', ru: 'Рений', en: 'Rhenium' },
    76: { s: 'Os', ru: 'Осмий', en: 'Osmium' },
    77: { s: 'Ir', ru: 'Иридий', en: 'Iridium' },
    78: { s: 'Pt', ru: 'Платина', en: 'Platinum' },
    79: { s: 'Au', ru: 'Золото', en: 'Gold' },
    80: { s: 'Hg', ru: 'Ртуть', en: 'Mercury' },
    81: { s: 'Tl', ru: 'Таллий', en: 'Thallium' },
    82: { s: 'Pb', ru: 'Свинец', en: 'Lead' },
    83: { s: 'Bi', ru: 'Висмут', en: 'Bismuth' },
    84: { s: 'Po', ru: 'Полоний', en: 'Polonium' },
    85: { s: 'At', ru: 'Астат', en: 'Astatine' },
    86: { s: 'Rn', ru: 'Радон', en: 'Radon' },
    87: { s: 'Fr', ru: 'Франций', en: 'Francium' },
    88: { s: 'Ra', ru: 'Радий', en: 'Radium' },
    89: { s: 'Ac', ru: 'Актиний', en: 'Actinium' },
    90: { s: 'Th', ru: 'Торий', en: 'Thorium' },
    91: { s: 'Pa', ru: 'Протактиний', en: 'Protactinium' },
    92: { s: 'U', ru: 'Уран', en: 'Uranium' },
    93: { s: 'Np', ru: 'Нептуний', en: 'Neptunium' },
    94: { s: 'Pu', ru: 'Плутоний', en: 'Plutonium' },
    95: { s: 'Am', ru: 'Америций', en: 'Americium' },
    96: { s: 'Cm', ru: 'Кюрий', en: 'Curium' },
    97: { s: 'Bk', ru: 'Берклий', en: 'Berkelium' },
    98: { s: 'Cf', ru: 'Калифорний', en: 'Californium' },
    99: { s: 'Es', ru: 'Эйнштейний', en: 'Einsteinium' },
    100: { s: 'Fm', ru: 'Фермий', en: 'Fermium' },
    101: { s: 'Md', ru: 'Менделевий', en: 'Mendelevium' },
    102: { s: 'No', ru: 'Нобелий', en: 'Nobelium' },
    103: { s: 'Lr', ru: 'Лоуренсий', en: 'Lawrencium' },
    104: { s: 'Rf', ru: 'Резерфордий', en: 'Rutherfordium' },
    105: { s: 'Db', ru: 'Дубний', en: 'Dubnium' },
    106: { s: 'Sg', ru: 'Сиборгий', en: 'Seaborgium' },
    107: { s: 'Bh', ru: 'Борий', en: 'Bohrium' },
    108: { s: 'Hs', ru: 'Хассий', en: 'Hassium' },
    109: { s: 'Mt', ru: 'Мейтнерий', en: 'Meitnerium' },
    110: { s: 'Ds', ru: 'Дармштадтий', en: 'Darmstadtium' },
    111: { s: 'Rg', ru: 'Рентгений', en: 'Roentgenium' },
    112: { s: 'Cn', ru: 'Коперниций', en: 'Copernicium' },
    113: { s: 'Nh', ru: 'Нихоний', en: 'Nihonium' },
    114: { s: 'Fl', ru: 'Флеровий', en: 'Flerovium' },
    115: { s: 'Mc', ru: 'Московий', en: 'Moscovium' },
    116: { s: 'Lv', ru: 'Ливерморий', en: 'Livermorium' },
    117: { s: 'Ts', ru: 'Теннессин', en: 'Tennessine' },
    118: { s: 'Og', ru: 'Оганесон', en: 'Oganesson' },
};

// Map of Proton Count -> Array of Stable Neutron Counts
const STABLE_NEUTRONS: Record<number, number[]> = {
  1: [0, 1], // H
  2: [1, 2], // He
  3: [3, 4], // Li
  4: [5], // Be
  5: [5, 6], // B
  6: [6, 7], // C
  7: [7, 8], // N
  8: [8, 9, 10], // O
  9: [10], // F
  10: [10, 11, 12], // Ne
  11: [12], // Na
  12: [12, 13, 14], // Mg
  13: [14], // Al
  14: [14, 15, 16], // Si
  15: [16], // P
  16: [16, 17, 18, 20], // S
  17: [18, 20], // Cl
  18: [18, 20, 22], // Ar
  19: [20, 22], // K (40 is radioactive)
  20: [20, 22, 23, 24, 26], // Ca (48 is radioactive)
  21: [24], // Sc
  22: [24, 25, 26, 27, 28], // Ti
  23: [28], // V
  24: [26, 28, 29, 30], // Cr
  25: [30], // Mn
  26: [28, 30, 31, 32], // Fe
  27: [32], // Co
  28: [30, 32, 33, 34, 36], // Ni
  29: [34, 36], // Cu
  30: [34, 36, 37, 38, 40], // Zn
  31: [38, 40], // Ga
  32: [38, 40, 41, 42], // Ge
  33: [42], // As
  34: [40, 42, 43, 44, 46], // Se
  35: [44, 46], // Br
  36: [42, 44, 46, 47, 48, 50], // Kr
  37: [48], // Rb
  38: [46, 48, 49, 50], // Sr
  39: [50], // Y
  40: [50, 51, 52, 54], // Zr
  41: [52], // Nb
  42: [50, 52, 53, 54, 55, 56], // Mo
  43: [], // Tc (All radioactive)
  44: [52, 54, 55, 56, 57, 58, 60], // Ru
  45: [58], // Rh
  46: [56, 58, 59, 60, 62, 64], // Pd
  47: [60, 62], // Ag
  48: [58, 60, 62, 63, 64, 66], // Cd
  49: [64], // In
  50: [62, 64, 65, 66, 67, 68, 69, 70, 72, 74], // Sn
  51: [70, 72], // Sb
  52: [68, 70, 71, 72, 73, 74, 76, 78], // Te
  53: [74], // I
  54: [70, 72, 74, 75, 76, 77, 78, 80, 82], // Xe
  55: [78], // Cs
  56: [74, 76, 78, 79, 80, 81, 82], // Ba
  57: [81, 82], // La
  58: [78, 80, 82], // Ce
  59: [82], // Pr
  60: [82, 83, 85, 86, 88, 90], // Nd
  61: [], // Pm (All radioactive)
  62: [82, 86, 87, 88, 90, 92], // Sm
  63: [88, 90], // Eu
  64: [88, 90, 91, 92, 93, 94, 96], // Gd
  65: [94], // Tb
  66: [90, 92, 94, 95, 96, 97, 98], // Dy
  67: [98], // Ho
  68: [94, 96, 98, 99, 100, 102], // Er
  69: [100], // Tm
  70: [98, 100, 101, 102, 103, 104, 106], // Yb
  71: [104], // Lu
  72: [102, 104, 105, 106, 107, 108], // Hf
  73: [107, 108], // Ta
  74: [106, 108, 109, 110, 112], // W
  75: [110], // Re
  76: [108, 110, 111, 112, 113, 114, 116], // Os
  77: [114, 116], // Ir
  78: [114, 116, 117, 118, 120], // Pt
  79: [118], // Au
  80: [116, 118, 119, 120, 121, 122, 124], // Hg
  81: [122, 124], // Tl
  82: [122, 124, 125, 126], // Pb
  83: [126], // Bi
  // 84+ are all radioactive (stable array empty/undefined)
};

const App: React.FC = () => {
  // State for particle counts
  const [protonCount, setProtonCount] = useState<number>(9);
  const [neutronCount, setNeutronCount] = useState<number>(10); 
  
  // State for UI selection
  const [selectedParticle, setSelectedParticle] = useState<'proton' | 'neutron'>('neutron');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  
  // Ref to hold stability for animation loop access
  const isStableRef = useRef<boolean>(true);

  // Derived state for Isotope info
  const isotopeInfo = useMemo(() => {
    const massNumber = protonCount + neutronCount;
    const element = ELEMENTS[protonCount];

    if (!element) {
        return {
            symbol: '?',
            mass: massNumber,
            nameRu: `Элемент-${protonCount}`,
            nameEn: `Element-${protonCount}`,
            isotopeRu: `Неизвестный-${massNumber}`,
            isotopeEn: `Unknown-${massNumber}`,
            isStable: false
        };
    }

    let isotopeRu = `${element.ru}-${massNumber}`;
    let isotopeEn = `${element.en}-${massNumber}`;

    // Special cases for Hydrogen
    if (protonCount === 1) {
        if (neutronCount === 0) { isotopeRu = 'Протий'; isotopeEn = 'Protium'; }
        else if (neutronCount === 1) { isotopeRu = 'Дейтерий'; isotopeEn = 'Deuterium'; }
        else if (neutronCount === 2) { isotopeRu = 'Тритий'; isotopeEn = 'Tritium'; }
    }

    // Determine stability
    const stableNeutrons = STABLE_NEUTRONS[protonCount];
    const isStable = stableNeutrons ? stableNeutrons.includes(neutronCount) : false;
    
    // Update the ref for the animation loop
    isStableRef.current = isStable;

    return {
        symbol: element.s,
        mass: massNumber,
        nameRu: element.ru,
        nameEn: element.en,
        isotopeRu,
        isotopeEn,
        isStable
    };
  }, [protonCount, neutronCount]);

  // Helper to create a particle
  const createParticle = (type: 'proton' | 'neutron', mode: 'initial' | 'incoming'): Particle => {
    let x, y, z, vx, vy, vz;

    if (mode === 'incoming') {
        // Spawn far away to fly in
        const spawnDist = 450; 
        // Random angle on sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        x = spawnDist * Math.sin(phi) * Math.cos(theta);
        y = spawnDist * Math.sin(phi) * Math.sin(theta);
        z = spawnDist * Math.cos(phi);

        // Aim generally at center but with some spread so they don't all hit dead center
        const targetX = (Math.random() - 0.5) * 40;
        const targetY = (Math.random() - 0.5) * 40;
        const targetZ = (Math.random() - 0.5) * 40;

        // Calculate velocity vector
        const speed = 6 + Math.random() * 4; // High speed impact
        const dx = targetX - x;
        const dy = targetY - y;
        const dz = targetZ - z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        vx = (dx / dist) * speed;
        vy = (dy / dist) * speed;
        vz = (dz / dist) * speed;
    } else {
        // Initial cluster: Start closer so they form the ball immediately
        x = (Math.random() - 0.5) * 100;
        y = (Math.random() - 0.5) * 100;
        z = (Math.random() - 0.5) * 100;
        
        // Gentle initial drift
        vx = (Math.random() - 0.5) * 0.2;
        vy = (Math.random() - 0.5) * 0.2;
        vz = (Math.random() - 0.5) * 0.2;
    }

    return {
      x, y, z,
      type,
      id: Math.random(),
      vx, vy, vz,
    };
  };

  // Manage particle count
  useEffect(() => {
    const currentParticles = particlesRef.current;
    let newParticles = [...currentParticles];
    const isInitialLoad = currentParticles.length === 0;

    // Manage Protons
    const currentProtons = newParticles.filter(p => p.type === 'proton');
    if (currentProtons.length < protonCount) {
        for (let i = currentProtons.length; i < protonCount; i++) {
            newParticles.push(createParticle('proton', isInitialLoad ? 'initial' : 'incoming'));
        }
    } else if (currentProtons.length > protonCount) {
        const toRemove = currentProtons.length - protonCount;
        const protonIndices = newParticles.map((p, i) => ({ type: p.type, index: i }))
                                         .filter(p => p.type === 'proton')
                                         .map(p => p.index)
                                         .reverse();
        const indicesToRemove = new Set(protonIndices.slice(0, toRemove));
        newParticles = newParticles.filter((_, i) => !indicesToRemove.has(i));
    }

    // Manage Neutrons
    const currentNeutrons = newParticles.filter(p => p.type === 'neutron');
    if (currentNeutrons.length < neutronCount) {
        for (let i = currentNeutrons.length; i < neutronCount; i++) {
            newParticles.push(createParticle('neutron', isInitialLoad ? 'initial' : 'incoming'));
        }
    } else if (currentNeutrons.length > neutronCount) {
        const toRemove = currentNeutrons.length - neutronCount;
        const neutronIndices = newParticles.map((p, i) => ({ type: p.type, index: i }))
                                         .filter(p => p.type === 'neutron')
                                         .map(p => p.index)
                                         .reverse();
        const indicesToRemove = new Set(neutronIndices.slice(0, toRemove));
        newParticles = newParticles.filter((_, i) => !indicesToRemove.has(i));
    }
    
    particlesRef.current = newParticles;
  }, [neutronCount, protonCount]);


  // Physics & Drawing Loop
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Physics Settings ---
    const particles = particlesRef.current;
    const VISUAL_SCALE_REF = 24; // Base size for rendering logic
    const PHYSICS_RADIUS = 18;   // Collision radius
    const COLLISION_DIST = PHYSICS_RADIUS * 2;
    
    // Check stability from ref to adjust physics
    const isStable = isStableRef.current;

    // Physics constants tuned for "energetic collision"
    const ATTRACTION = 0.005;    // Stronger pull to keep the energetic cluster together
    const DAMPING = 0.98;        // Less friction so they keep moving
    const RESTITUTION = 0.5;     // Bounciness: 0.5 = dead thud, 0.9 = super ball. 
    
    // Significantly increase jitter if radioactive
    const JITTER = isStable ? 0.15 : 2.5; 

    // 1. Integration (Move particles)
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Attraction to center (Strong Nuclear Force simulation)
        p.vx -= p.x * ATTRACTION;
        p.vy -= p.y * ATTRACTION;
        p.vz -= p.z * ATTRACTION;

        // Brownian/Thermal motion (Quantum Jitter)
        p.vx += (Math.random() - 0.5) * JITTER;
        p.vy += (Math.random() - 0.5) * JITTER;
        p.vz += (Math.random() - 0.5) * JITTER;

        // Damping (Drag)
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.vz *= DAMPING;

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
    }

    // 2. Constraint Solving (Collisions)
    // More iterations for stability with high-speed incoming particles
    const ITERATIONS = 6;
    for(let k=0; k<ITERATIONS; k++) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dz = p1.z - p2.z;
                const distSq = dx*dx + dy*dy + dz*dz;
                
                // If touching
                if (distSq < COLLISION_DIST * COLLISION_DIST && distSq > 0.001) {
                    const dist = Math.sqrt(distSq);
                    const overlap = COLLISION_DIST - dist;
                    
                    // Normal vector pointing from 2 to 1
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const nz = dz / dist;
                    
                    // Separate them (Position Correction)
                    const separation = overlap * 0.5; // Move each half the overlap
                    p1.x += nx * separation;
                    p1.y += ny * separation;
                    p1.z += nz * separation;
                    
                    p2.x -= nx * separation;
                    p2.y -= ny * separation;
                    p2.z -= nz * separation;
                    
                    // Bounce (Velocity Exchange)
                    const dvx = p1.vx - p2.vx;
                    const dvy = p1.vy - p2.vy;
                    const dvz = p1.vz - p2.vz;
                    
                    const velAlongNormal = dvx * nx + dvy * ny + dvz * nz;
                    
                    // Only bounce if moving towards each other
                    if (velAlongNormal < 0) {
                        const impulseMag = -(1 + RESTITUTION) * velAlongNormal * 0.5;
                        
                        p1.vx += nx * impulseMag;
                        p1.vy += ny * impulseMag;
                        p1.vz += nz * impulseMag;
                        
                        p2.vx -= nx * impulseMag;
                        p2.vy -= ny * impulseMag;
                        p2.vz -= nz * impulseMag;
                    }
                }
            }
        }
    }

    // 3. Rendering
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Slow global rotation for 3D effect
    const rotSpeed = 0.002;
    const cos = Math.cos(rotSpeed);
    const sin = Math.sin(rotSpeed);
    
    particles.forEach(p => {
        const x = p.x * cos - p.z * sin;
        const z = p.x * sin + p.z * cos;
        p.x = x;
        p.z = z;
    });

    // Sort by Z (depth) for Painter's Algorithm
    const sorted = [...particles].sort((a, b) => a.z - b.z);

    sorted.forEach(p => {
        const perspective = 500;
        // Avoid divide by zero if z is too close to -perspective
        const scale = perspective / (perspective + p.z + 300); 
        
        const x = centerX + p.x * scale;
        const y = centerY + p.y * scale;
        const r = Math.max(1, VISUAL_SCALE_REF * scale);

        const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
        
        if (p.type === 'proton') {
            // Red (Proton)
            grad.addColorStop(0, '#ff8a8a');
            grad.addColorStop(0.3, '#d12e2e');
            grad.addColorStop(1, '#4a0505');
        } else {
            // Gray (Neutron)
            grad.addColorStop(0, '#e0e0e0');
            grad.addColorStop(0.3, '#757575');
            grad.addColorStop(1, '#1a1a1a');
        }

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Specular Highlight for glossiness
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(x - r*0.3, y - r*0.3, r*0.3, 0, Math.PI * 2);
        ctx.fill();
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(requestRef.current);
    }
  }, []);

  // Handlers for controls
  const handleAdd = () => {
      if (selectedParticle === 'proton') setProtonCount(p => p + 1);
      else setNeutronCount(n => n + 1);
  };

  const handleRemove = () => {
      if (selectedParticle === 'proton') setProtonCount(p => Math.max(1, p - 1)); // Min 1 proton usually
      else setNeutronCount(n => Math.max(0, n - 1));
  };

  // UI Theme helpers based on selection
  const isProtonSelected = selectedParticle === 'proton';


  return (
    <div className="relative w-full h-screen bg-[#0d0614] overflow-hidden text-white font-mono selection:bg-blue-500/30">
        {/* Background Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1f1133_0%,#000000_90%)]"></div>
        
        {/* Decorative Tech Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vh] h-[70vh] border border-blue-500/20 rounded-full"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] border border-dashed border-purple-500/20 rounded-full"></div>
             {/* Crosshairs */}
             <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>
             <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        </div>

        {/* UI Layer */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 pointer-events-none">
            
            {/* Header */}
            <div className="flex flex-col items-center pt-4 pointer-events-auto transition-all duration-300">
                <div className={`mb-4 border px-4 py-2 rounded text-center backdrop-blur-sm transition-colors duration-500 ${isotopeInfo.isStable ? 'border-green-500/30 bg-green-900/10' : 'border-orange-500/30 bg-orange-900/10'}`}>
                    <div className={`text-[10px] font-bold uppercase flex items-center gap-2 ${isotopeInfo.isStable ? 'text-green-400' : 'text-orange-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${isotopeInfo.isStable ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></span>
                        {isotopeInfo.isStable ? 'СТАБИЛЬНЫЙ / STABLE' : 'РАДИОАКТИВНЫЙ / RADIOACTIVE'}
                    </div>
                </div>
                
                <div className="text-[10px] text-purple-300 font-bold mb-1">{isotopeInfo.mass} {isotopeInfo.symbol}</div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] uppercase">
                    {isotopeInfo.isotopeRu}
                </h1>
                <div className="text-purple-300/50 text-xs tracking-[0.3em] mt-2 uppercase">{isotopeInfo.isotopeEn}</div>
            </div>

            {/* Middle Section: Stats & Navigation */}
            <div className="flex justify-between items-center flex-grow w-full max-w-6xl mx-auto relative">
                
                {/* Left: Back Button */}
                <div className="pointer-events-auto group cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/40 transition-all bg-black/20 backdrop-blur-sm">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </div>
                    <div className="text-center opacity-50 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs font-bold">Назад</div>
                        <div className="text-[10px]">Go back</div>
                    </div>
                </div>

                {/* Right: Stats (Selectable) */}
                <div className="flex flex-col gap-6 pointer-events-auto">
                     {/* Protons Stat (Red) */}
                     <button 
                        onClick={() => setSelectedParticle('proton')}
                        className={`flex items-center justify-end gap-4 group px-4 py-2 rounded-lg transition-all duration-300 ${selectedParticle === 'proton' ? 'bg-red-900/20 border border-red-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                     >
                        <div className="text-right">
                            <div className="text-4xl md:text-5xl font-light text-white tracking-tighter flex items-center">
                                <span className={`text-red-500/40 text-3xl md:text-4xl mr-2 font-thin transition-colors ${selectedParticle === 'proton' ? 'text-red-500' : 'group-hover:text-red-500/70'}`}>❬</span>
                                {protonCount}
                                <span className={`text-red-500/40 text-3xl md:text-4xl ml-2 font-thin transition-colors ${selectedParticle === 'proton' ? 'text-red-500' : 'group-hover:text-red-500/70'}`}>❭</span>
                            </div>
                        </div>
                        <div className={`border-l-2 pl-3 transition-colors ${selectedParticle === 'proton' ? 'border-red-500' : 'border-red-500/30 group-hover:border-red-500/60'}`}>
                            <div className="text-sm font-bold text-red-200">протоны</div>
                            <div className="text-[10px] text-red-400/60 uppercase tracking-wider">Protons</div>
                        </div>
                     </button>
                     
                     {/* Neutrons Stat (Gray) */}
                     <button 
                        onClick={() => setSelectedParticle('neutron')}
                        className={`flex items-center justify-end gap-4 group px-4 py-2 rounded-lg transition-all duration-300 ${selectedParticle === 'neutron' ? 'bg-gray-800/40 border border-gray-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                     >
                        <div className="text-right">
                            <div className="text-4xl md:text-5xl font-light text-white tracking-tighter flex items-center">
                                <span className={`text-gray-500/40 text-3xl md:text-4xl mr-2 font-thin transition-colors ${selectedParticle === 'neutron' ? 'text-gray-300' : 'group-hover:text-gray-400/70'}`}>❬</span>
                                {neutronCount}
                                <span className={`text-gray-500/40 text-3xl md:text-4xl ml-2 font-thin transition-colors ${selectedParticle === 'neutron' ? 'text-gray-300' : 'group-hover:text-gray-400/70'}`}>❭</span>
                            </div>
                        </div>
                        <div className={`border-l-2 pl-3 transition-colors ${selectedParticle === 'neutron' ? 'border-gray-300' : 'border-gray-500/30 group-hover:border-gray-400/60'}`}>
                            <div className="text-sm font-bold text-gray-200">нейтроны</div>
                            <div className="text-[10px] text-gray-400/60 uppercase tracking-wider">Neutrons</div>
                        </div>
                     </button>
                </div>
            </div>

            {/* Footer: Interactive Controls */}
            <div className="flex justify-center items-center gap-6 md:gap-12 pb-4 md:pb-8 pointer-events-auto">
                 {/* Remove Particle Button */}
                 <button 
                    onClick={handleRemove}
                    className="group flex flex-col items-center gap-3 focus:outline-none"
                    aria-label={`Remove ${selectedParticle}`}
                 >
                     <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border flex items-center justify-center text-3xl backdrop-blur-sm transition-all duration-300 ${selectedParticle === 'proton' ? 'border-red-500/50 text-red-400 bg-red-900/10 hover:bg-red-500/20 hover:border-red-500 hover:text-white' : 'border-gray-600 text-gray-400 bg-black/40 hover:border-gray-400 hover:text-white hover:bg-gray-800/40'} active:scale-95`}>
                        &minus;
                     </div>
                     <div className="flex flex-col items-center">
                        <div className={`border bg-gray-900/90 px-3 py-1 text-[10px] md:text-xs text-gray-300 uppercase tracking-wide transition-colors rounded ${selectedParticle === 'proton' ? 'border-red-900 group-hover:border-red-500/50 group-hover:text-white' : 'border-gray-700 group-hover:border-gray-500 group-hover:text-white'}`}>
                            Убрать частицу
                        </div>
                        <div className={`text-[9px] mt-1 font-semibold transition-colors ${selectedParticle === 'proton' ? 'text-red-500/50 group-hover:text-red-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                            REMOVE PARTICLE
                        </div>
                     </div>
                 </button>

                 {/* Center Decoration */}
                 <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xl font-thin select-none transition-colors duration-500 ${selectedParticle === 'proton' ? 'border-red-500/20 text-red-500/30' : 'border-blue-500/20 text-blue-500/30'}`}>
                    {selectedParticle === 'proton' ? 'P' : 'N'}
                 </div>

                 {/* Add Particle Button */}
                 <button 
                    onClick={handleAdd}
                    className="group flex flex-col items-center gap-3 focus:outline-none"
                    aria-label={`Add ${selectedParticle}`}
                 >
                     <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border flex items-center justify-center text-3xl backdrop-blur-sm transition-all duration-300 ${selectedParticle === 'proton' ? 'border-red-500/50 text-red-400 bg-red-900/10 hover:bg-red-500/20 hover:border-red-500 hover:text-white' : 'border-gray-600 text-gray-400 bg-black/40 hover:border-gray-400 hover:text-white hover:bg-gray-800/40'} active:scale-95`}>
                        +
                     </div>
                     <div className="flex flex-col items-center">
                        <div className={`border bg-gray-900/90 px-3 py-1 text-[10px] md:text-xs text-gray-300 uppercase tracking-wide transition-colors rounded ${selectedParticle === 'proton' ? 'border-red-900 group-hover:border-red-500/50 group-hover:text-white' : 'border-gray-700 group-hover:border-gray-500 group-hover:text-white'}`}>
                            Добавить частицу
                        </div>
                        <div className={`text-[9px] mt-1 font-semibold transition-colors ${selectedParticle === 'proton' ? 'text-red-500/50 group-hover:text-red-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                            ADD PARTICLE
                        </div>
                     </div>
                 </button>
            </div>
        </div>
        
        {/* Canvas for rendering the nucleus */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default App;
