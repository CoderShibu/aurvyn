import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Hero3DElement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- SETUP SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // Dynamic color light sources
    const light1 = new THREE.PointLight(0xff94b2, 12, 50);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x2dd4bf, 10, 50);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(0, 10, 10);
    scene.add(keyLight);

    // --- GEOMETRY & MORPHING SETUP ---
    const radius = 2.0;
    const detail = 5; // smooth sphere
    const geometry = new THREE.IcosahedronGeometry(radius, detail);
    
    // Store original positions for math displacement
    const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const originalPositions = positionAttr.clone();

    // --- PREMIUM TRANSMISSIVE GLASS MATERIAL ---
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.92,       // high glass transparency
      ior: 1.55,                 // index of refraction
      thickness: 1.4,            // refraction bending
      clearcoat: 1.0,            // shiny outer shell
      clearcoatRoughness: 0.08,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- INTERACTION AND SPINNING ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocity = { x: 0.003, y: 0.003 }; // slow drift initial velocity
    let targetTiltX = 0;
    let targetTiltY = 0;

    const handlePointerDown = () => {
      isDragging = true;
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Relative drag rotation
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y,
        };

        mesh.rotation.y += deltaMove.x * 0.008;
        mesh.rotation.x += deltaMove.y * 0.008;

        // update velocity based on drag speed
        velocity = {
          x: deltaMove.y * 0.001,
          y: deltaMove.x * 0.001,
        };
      } else {
        // Subtle tilt towards pointer coordinates
        const rect = container.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width - 0.5;
        const my = (e.clientY - rect.top) / rect.height - 0.5;
        targetTiltX = my * 0.35;
        targetTiltY = mx * 0.35;
      }

      previousMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // --- RESIZE LIFECYCLE ---
    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    // --- THEME COLOR ALIGNMENT ---
    const getThemeColors = () => {
      if (typeof window === "undefined") return { rose: 0xff94b2, teal: 0x2dd4bf };
      const style = getComputedStyle(document.documentElement);
      const roseVal = style.getPropertyValue("--brand-rose").trim();
      const redVal = style.getPropertyValue("--brand-red").trim();

      const parseColor = (val: string, fallback: number): number => {
        if (!val) return fallback;
        if (val.startsWith("#")) return parseInt(val.replace("#", "0x"), 16);
        try {
          return new THREE.Color(val).getHex();
        } catch (e) {
          return fallback;
        }
      };

      return {
        rose: parseColor(roseVal, 0xff94b2),
        red: parseColor(redVal, 0xf24455),
      };
    };

    const updateLightsForTheme = () => {
      const themeColors = getThemeColors();
      light1.color.setHex(themeColors.rose);
      light2.color.setHex(themeColors.red);
    };

    // Initialize colors
    updateLightsForTheme();

    window.addEventListener("theme-change", updateLightsForTheme);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // 1. Organic morphing deformation (Sine waves over vertices)
      const positionAttr = geometry.attributes.position;
      const posArray = positionAttr.array as Float32Array;
      const origArray = originalPositions.array as Float32Array;

      const waveSpeed = time * 0.85;

      for (let i = 0; i < positionAttr.count; i++) {
        const i3 = i * 3;
        const ox = origArray[i3];
        const oy = origArray[i3 + 1];
        const oz = origArray[i3 + 2];

        // Normalize vector to get direction from center
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const nx = ox / len;
        const ny = oy / len;
        const nz = oz / len;

        // Apply a compound sine/cosine wave deformation
        const wave =
          Math.sin(ox * 1.2 + waveSpeed) * Math.cos(oy * 1.2 + waveSpeed) * 0.16 +
          Math.sin(oz * 1.6 - waveSpeed * 0.7) * 0.10 +
          Math.cos(ox * 0.6 - waveSpeed * 1.2) * 0.08;

        // Scale original coordinates along normal direction by (1 + wave)
        const displacement = 1.0 + wave;
        posArray[i3] = ox * displacement;
        posArray[i3 + 1] = oy * displacement;
        posArray[i3 + 2] = oz * displacement;
      }

      positionAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      // 2. Mesh rotation & inertial drift
      if (!isDragging) {
        mesh.rotation.y += velocity.y;
        mesh.rotation.x += velocity.x;

        // Apply friction to drag velocity
        velocity.x *= 0.96;
        velocity.y *= 0.96;

        // Add small baseline background rotation
        mesh.rotation.y += 0.0035;
        mesh.rotation.x += 0.002;

        // Interpolate mesh offset to mouse tilt coordinates
        mesh.position.y += (targetTiltX - mesh.position.y) * 0.05;
        mesh.position.x += (targetTiltY - mesh.position.x) * 0.05;
      }

      // 3. Move point lights around the sphere to cast shifting refractions
      const r = 5;
      light1.position.x = Math.sin(time * 0.5) * r;
      light1.position.z = Math.cos(time * 0.5) * r;
      light1.position.y = Math.cos(time * 0.3) * r;

      light2.position.x = Math.cos(time * 0.4) * r;
      light2.position.z = Math.sin(time * 0.4) * r;
      light2.position.y = Math.sin(time * 0.25) * r;

      renderer.render(scene, camera);
    };

    animate();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("theme-change", updateLightsForTheme);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <canvas ref={canvasRef} className="block h-full w-full bg-transparent" />
    </div>
  );
}
