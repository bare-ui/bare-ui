"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── Sample pixel positions from a letter ── */
function sampleLetterPositions(
	letter: string,
	count: number,
	width: number,
	height: number,
): Array<[number, number]> {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d")!;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = "#fff";
	ctx.font = `bold ${height * 0.82}px Arial, sans-serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(letter, width / 2, height / 2);

	const imageData = ctx.getImageData(0, 0, width, height);
	const filled: Array<[number, number]> = [];
	for (let y = 0; y < height; y += 3) {
		for (let x = 0; x < width; x += 3) {
			if (imageData.data[(y * width + x) * 4] > 128) {
				filled.push([x, y]);
			}
		}
	}

	const shuffled = filled.sort(() => Math.random() - 0.5);
	return shuffled.slice(0, Math.min(count, shuffled.length));
}

/* ── Character atlas: render all chars into a grid texture ── */
const ATLAS_CHARS = [
	"·",
	"[",
	"]",
	"{",
	"}",
	"\\",
	"/",
	"?",
	"|",
	"<",
	">",
	";",
];
const ATLAS_COLS = 4;
const ATLAS_ROWS = 3;

function createCharAtlas(): THREE.Texture {
	const cellSize = 128;
	const w = ATLAS_COLS * cellSize;
	const h = ATLAS_ROWS * cellSize;
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d")!;

	ctx.fillStyle = "#ffffff";
	ctx.font = `900 ${cellSize * 0.75}px "SF Mono", "Fira Code", "Courier New", monospace`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	// Draw each character twice with slight offset for thickness
	for (let i = 0; i < ATLAS_CHARS.length; i++) {
		const col = i % ATLAS_COLS;
		const row = Math.floor(i / ATLAS_COLS);
		const cx = col * cellSize + cellSize / 2;
		const cy = row * cellSize + cellSize / 2;
		ctx.fillText(ATLAS_CHARS[i], cx, cy);
		ctx.fillText(ATLAS_CHARS[i], cx + 1, cy);
		ctx.fillText(ATLAS_CHARS[i], cx, cy + 1);
	}

	const tex = new THREE.CanvasTexture(canvas);
	tex.needsUpdate = true;
	return tex;
}

/* ── Shaders with atlas UV lookup ── */
const vertexShader = `
  attribute float aOpacity;
  attribute float aSize;
  attribute float aCharIndex;
  varying vec3 vColor;
  varying float vOpacity;
  varying float vCharIndex;

  void main() {
    vColor = color;
    vOpacity = aOpacity;
    vCharIndex = aCharIndex;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (3.5 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform sampler2D uAtlas;
  uniform float uAtlasCols;
  uniform float uAtlasRows;
  varying vec3 vColor;
  varying float vOpacity;
  varying float vCharIndex;

  void main() {
    float idx = floor(vCharIndex + 0.5);
    float col = mod(idx, uAtlasCols);
    float row = floor(idx / uAtlasCols);

    // Map gl_PointCoord (0-1) to the atlas cell
    vec2 cellUV = gl_PointCoord;
    vec2 atlasUV = vec2(
      (col + cellUV.x) / uAtlasCols,
      (row + cellUV.y) / uAtlasRows
    );

    vec4 texel = texture2D(uAtlas, atlasUV);
    float alpha = texel.r * vOpacity;
    if (alpha < 0.02) discard;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

/* ── Colors ── */
const DEFAULT_COLOR = new THREE.Color("#888888");
const HOVER_CYAN = new THREE.Color("#06b6d4");
const HOVER_PINK = new THREE.Color("#ec4899");
const HOVER_INDIGO = new THREE.Color("#6366f1");

/* ── The "W" particle shape ── */
function ParticleW() {
	const pointsRef = useRef<THREE.Points>(null);
	const { pointer, viewport } = useThree();

	const COUNT = 800;
	const CANVAS_SIZE = 200;

	const { geometry, shaderMat, targets } = useMemo(() => {
		const samples = sampleLetterPositions(
			"W",
			COUNT,
			CANVAS_SIZE,
			CANVAS_SIZE,
		);
		const atlas = createCharAtlas();

		const positions = new Float32Array(COUNT * 3);
		const tgt = new Float32Array(COUNT * 3);
		const colors = new Float32Array(COUNT * 3);
		const opacities = new Float32Array(COUNT);
		const sizes = new Float32Array(COUNT);
		const charIndices = new Float32Array(COUNT);

		const scale = 8 / CANVAS_SIZE;

		for (let i = 0; i < COUNT; i++) {
			const [px, py] = samples[i] || [
				Math.random() * CANVAS_SIZE,
				Math.random() * CANVAS_SIZE,
			];
			const x = (px - CANVAS_SIZE / 2) * scale + 2.5;
			const y = -(py - CANVAS_SIZE / 2) * scale - 0.5;
			const z = (Math.random() - 0.5) * 0.5;

			tgt[i * 3] = x;
			tgt[i * 3 + 1] = y;
			tgt[i * 3 + 2] = z;

			positions[i * 3] = x + (Math.random() - 0.5) * 0.2;
			positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.2;
			positions[i * 3 + 2] = z;

			colors[i * 3] = DEFAULT_COLOR.r;
			colors[i * 3 + 1] = DEFAULT_COLOR.g;
			colors[i * 3 + 2] = DEFAULT_COLOR.b;

			opacities[i] = 0.7 + Math.random() * 0.3;
			sizes[i] = 28 + Math.random() * 32;
			charIndices[i] = Math.floor(Math.random() * ATLAS_CHARS.length);
		}

		const geo = new THREE.BufferGeometry();
		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		geo.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
		geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
		geo.setAttribute(
			"aCharIndex",
			new THREE.BufferAttribute(charIndices, 1),
		);

		const mat = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			vertexColors: true,
			transparent: true,
			depthWrite: false,
			uniforms: {
				uAtlas: { value: atlas },
				uAtlasCols: { value: ATLAS_COLS },
				uAtlasRows: { value: ATLAS_ROWS },
			},
		});

		return { geometry: geo, shaderMat: mat, targets: tgt };
	}, []);

	const timeRef = useRef(0);
	const tmpColor = useMemo(() => new THREE.Color(), []);

	useFrame((_state, delta) => {
		if (!pointsRef.current) return;
		timeRef.current += delta;

		const geo = pointsRef.current.geometry;
		const posAttr = geo.attributes.position as THREE.BufferAttribute;
		const colAttr = geo.attributes.color as THREE.BufferAttribute;
		const pos = posAttr.array as Float32Array;
		const col = colAttr.array as Float32Array;

		const mouseX = (pointer.x * viewport.width) / 2;
		const mouseY = (pointer.y * viewport.height) / 2;

		for (let i = 0; i < COUNT; i++) {
			const i3 = i * 3;

			const jx = Math.sin(timeRef.current * 0.6 + i * 0.13) * 0.04;
			const jy = Math.cos(timeRef.current * 0.5 + i * 0.17) * 0.04;

			const tx = targets[i3] + jx;
			const ty = targets[i3 + 1] + jy;
			const tz = targets[i3 + 2];

			const dx = mouseX - tx;
			const dy = mouseY - ty;
			const dist = Math.sqrt(dx * dx + dy * dy);

			let goalX = tx;
			let goalY = ty;
			if (dist < 1.8) {
				const force = (1.8 - dist) * 0.4;
				goalX -= (dx / (dist + 0.001)) * force;
				goalY -= (dy / (dist + 0.001)) * force;
			}

			pos[i3] += (goalX - pos[i3]) * 0.08;
			pos[i3 + 1] += (goalY - pos[i3 + 1]) * 0.08;
			pos[i3 + 2] += (tz - pos[i3 + 2]) * 0.08;

			const colorT = Math.max(0, 1 - dist / 3.0);
			const angle = Math.atan2(dy, dx);

			if (colorT > 0.01) {
				// Blend between indigo, cyan, and pink based on angle
				const angleFactor = (Math.sin(angle) + 1) / 2;
				const angleFactor2 = (Math.cos(angle) + 1) / 2;
				tmpColor.copy(HOVER_INDIGO).lerp(HOVER_CYAN, angleFactor * 0.6);
				tmpColor.lerp(HOVER_PINK, angleFactor2 * 0.4);
				col[i3] +=
					(THREE.MathUtils.lerp(DEFAULT_COLOR.r, tmpColor.r, colorT) -
						col[i3]) *
					0.12;
				col[i3 + 1] +=
					(THREE.MathUtils.lerp(DEFAULT_COLOR.g, tmpColor.g, colorT) -
						col[i3 + 1]) *
					0.12;
				col[i3 + 2] +=
					(THREE.MathUtils.lerp(DEFAULT_COLOR.b, tmpColor.b, colorT) -
						col[i3 + 2]) *
					0.12;
			} else {
				col[i3] += (DEFAULT_COLOR.r - col[i3]) * 0.06;
				col[i3 + 1] += (DEFAULT_COLOR.g - col[i3 + 1]) * 0.06;
				col[i3 + 2] += (DEFAULT_COLOR.b - col[i3 + 2]) * 0.06;
			}
		}

		posAttr.needsUpdate = true;
		colAttr.needsUpdate = true;
	});

	return <points ref={pointsRef} geometry={geometry} material={shaderMat} />;
}

/* ── Background scattered characters ── */
function BackgroundParticles() {
	const pointsRef = useRef<THREE.Points>(null);
	const { pointer } = useThree();

	const COUNT = 120;

	const { geometry, shaderMat, basePositions } = useMemo(() => {
		const atlas = createCharAtlas();

		const positions = new Float32Array(COUNT * 3);
		const base = new Float32Array(COUNT * 3);
		const colors = new Float32Array(COUNT * 3);
		const opacities = new Float32Array(COUNT);
		const sizes = new Float32Array(COUNT);
		const charIndices = new Float32Array(COUNT);

		for (let i = 0; i < COUNT; i++) {
			const x = (Math.random() - 0.5) * 14;
			const y = (Math.random() - 0.5) * 7;
			const z = -1 - Math.random() * 2;

			positions[i * 3] = x;
			positions[i * 3 + 1] = y;
			positions[i * 3 + 2] = z;

			base[i * 3] = x;
			base[i * 3 + 1] = y;
			base[i * 3 + 2] = z;

			const t = Math.random();
			colors[i * 3] = 0.35 + t * 0.1;
			colors[i * 3 + 1] = 0.36 + t * 0.1;
			colors[i * 3 + 2] = 0.85 + t * 0.1;

			opacities[i] = 0.15 + Math.random() * 0.2;
			sizes[i] = 20 + Math.random() * 24;
			charIndices[i] = Math.floor(Math.random() * ATLAS_CHARS.length);
		}

		const geo = new THREE.BufferGeometry();
		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		geo.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
		geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
		geo.setAttribute(
			"aCharIndex",
			new THREE.BufferAttribute(charIndices, 1),
		);

		const mat = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			vertexColors: true,
			transparent: true,
			depthWrite: false,
			uniforms: {
				uAtlas: { value: atlas },
				uAtlasCols: { value: ATLAS_COLS },
				uAtlasRows: { value: ATLAS_ROWS },
			},
		});

		return { geometry: geo, shaderMat: mat, basePositions: base };
	}, []);

	const timeRef = useRef(0);

	useFrame((_state, delta) => {
		if (!pointsRef.current) return;
		timeRef.current += delta;

		const posAttr = pointsRef.current.geometry.attributes
			.position as THREE.BufferAttribute;
		const pos = posAttr.array as Float32Array;

		for (let i = 0; i < COUNT; i++) {
			const i3 = i * 3;
			pos[i3] =
				basePositions[i3] +
				Math.sin(timeRef.current * 0.12 + i * 1.1) * 0.25;
			pos[i3 + 1] =
				basePositions[i3 + 1] +
				Math.cos(timeRef.current * 0.1 + i * 0.8) * 0.15;
			pos[i3] -= pointer.x * 0.12;
			pos[i3 + 1] -= pointer.y * 0.08;
		}

		posAttr.needsUpdate = true;
	});

	return <points ref={pointsRef} geometry={geometry} material={shaderMat} />;
}

/* ── Main exported component ── */
export function Hero3D() {
	return (
		<Canvas
			camera={{ position: [0, 0, 6], fov: 50 }}
			dpr={[1, 1.5]}
			gl={{ antialias: true, alpha: true }}
			style={{ background: "transparent" }}
		>
			<BackgroundParticles />
			<ParticleW />
		</Canvas>
	);
}
