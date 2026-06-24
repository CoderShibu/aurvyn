import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- SETUP SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.z = 220;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // transparent background to let layout gradients show through
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // --- COLOR HELPER ---
    const getThemeColors = () => {
      if (typeof window === "undefined") return { rose: 0xff94b2, red: 0xf24455 };
      const style = getComputedStyle(document.documentElement);
      const roseVal = style.getPropertyValue("--brand-rose").trim();
      const redVal = style.getPropertyValue("--brand-red").trim();

      // Fallback helper to parse hex colors
      const parseColor = (val: string, fallback: number): number => {
        if (!val) return fallback;
        if (val.startsWith("#")) {
          return parseInt(val.replace("#", "0x"), 16);
        }
        // If it is HSL or RGB format, let THREE.Color parse it
        try {
          const c = new THREE.Color(val);
          return c.getHex();
        } catch (e) {
          return fallback;
        }
      };

      return {
        rose: parseColor(roseVal, 0xff94b2),
        red: parseColor(redVal, 0xf24455),
      };
    };

    let colors = getThemeColors();
    const particleColor = new THREE.Color(colors.rose);
    const lineColor = new THREE.Color(colors.red);

    // --- PARTICLE CREATION ---
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Bounded box size for particles
    const boxWidth = 320;
    const boxHeight = 200;
    const boxDepth = 150;

    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * boxWidth;
      positions[i * 3 + 1] = (Math.random() - 0.5) * boxHeight;
      positions[i * 3 + 2] = (Math.random() - 0.5) * boxDepth;

      // Velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.35;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.35;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Dynamic color attribute for particles (fade closer ones)
    const particleMaterial = new THREE.PointsMaterial({
      color: particleColor,
      size: 3,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);

    // --- CONNECTIONS (LINES) CREATION ---
    const maxConnections = 600;
    const linePositions = new Float32Array(maxConnections * 2 * 3); // 2 points per line, 3 coords
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      linewidth: 1,
    });

    const lineSystem = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(lineSystem);

    // --- INTERACTIVE MOUSE TRACKING ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to [-0.5, 0.5]
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener("mousemove", onMouseMove);

    // --- LISTEN TO THEME CHANGES ---
    const onThemeChange = () => {
      colors = getThemeColors();
      particleColor.setHex(colors.rose);
      lineColor.setHex(colors.red);
      particleMaterial.color.copy(particleColor);
      particleMaterial.needsUpdate = true;
    };

    window.addEventListener("theme-change", onThemeChange);

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

    // --- ANIMATION LOOP ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // 1. Move particles
      const posAttr = particlesGeometry.getAttribute("position") as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Apply velocity
        posArray[i3] += velocities[i3];
        posArray[i3 + 1] += velocities[i3 + 1];
        posArray[i3 + 2] += velocities[i3 + 2];

        // Boundary checks (bounce)
        const limitX = boxWidth / 2;
        const limitY = boxHeight / 2;
        const limitZ = boxDepth / 2;

        if (Math.abs(posArray[i3]) > limitX) {
          velocities[i3] *= -1;
          posArray[i3] = Math.sign(posArray[i3]) * limitX;
        }
        if (Math.abs(posArray[i3 + 1]) > limitY) {
          velocities[i3 + 1] *= -1;
          posArray[i3 + 1] = Math.sign(posArray[i3 + 1]) * limitY;
        }
        if (Math.abs(posArray[i3 + 2]) > limitZ) {
          velocities[i3 + 2] *= -1;
          posArray[i3 + 2] = Math.sign(posArray[i3 + 2]) * limitZ;
        }
      }
      posAttr.needsUpdate = true;

      // 2. Compute connections
      const linePosAttr = linesGeometry.getAttribute("position") as THREE.BufferAttribute;
      const lineColAttr = linesGeometry.getAttribute("color") as THREE.BufferAttribute;
      const linePosArray = linePosAttr.array as Float32Array;
      const lineColArray = lineColAttr.array as Float32Array;

      let lineCount = 0;
      const connectionDist = 65; // threshold distance to draw connections

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x1 = posArray[i3];
        const y1 = posArray[i3 + 1];
        const z1 = posArray[i3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const x2 = posArray[j3];
          const y2 = posArray[j3 + 1];
          const z2 = posArray[j3 + 2];

          // Calculate distance squared (faster than sqrt)
          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectionDist * connectionDist) {
            const dist = Math.sqrt(distSq);
            // Fade lines that are farther away
            const alpha = 1.0 - dist / connectionDist;

            if (lineCount < maxConnections) {
              const idx = lineCount * 6; // 2 points * 3 coordinates

              // Start point position
              linePosArray[idx] = x1;
              linePosArray[idx + 1] = y1;
              linePosArray[idx + 2] = z1;

              // End point position
              linePosArray[idx + 3] = x2;
              linePosArray[idx + 4] = y2;
              linePosArray[idx + 5] = z2;

              // Setup vertex colors with theme gradient + distance alpha
              const colorIdx = lineCount * 6;
              const r = lineColor.r;
              const g = lineColor.g;
              const b = lineColor.b;

              // Node 1 color
              lineColArray[colorIdx] = r * alpha;
              lineColArray[colorIdx + 1] = g * alpha;
              lineColArray[colorIdx + 2] = b * alpha;

              // Node 2 color
              lineColArray[colorIdx + 3] = r * alpha;
              lineColArray[colorIdx + 4] = g * alpha;
              lineColArray[colorIdx + 5] = b * alpha;

              lineCount++;
            }
          }
        }
      }

      // Fill remaining line buffers with 0s to prevent render artifacts
      const remainingIndex = lineCount * 6;
      linePosArray.fill(0, remainingIndex);
      lineColArray.fill(0, remainingIndex);

      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;
      linesGeometry.setDrawRange(0, lineCount * 2);

      // 3. Mouse interactions (Smooth inertia rotation)
      targetRotationY = mouseX * 0.18;
      targetRotationX = mouseY * 0.12;

      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05;

      // Slow constant base rotation
      scene.rotation.z += 0.0006;

      renderer.render(scene, camera);
    };

    animate();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("theme-change", onThemeChange);
      window.removeEventListener("resize", onResize);

      // Dispose resources to prevent GPU memory leaks
      particlesGeometry.dispose();
      particleMaterial.dispose();
      linesGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full bg-transparent" />
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div
        className="absolute right-[-10%] top-1/3 size-[520px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(242,68,85,0.18), transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute left-[-8%] top-[60%] size-[360px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,148,178,0.10), transparent 60%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
