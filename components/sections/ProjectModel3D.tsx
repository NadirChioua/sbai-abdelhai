"use client";

import { useEffect, useRef, useState } from "react";

export type ModelBlock = { id: string; label: string; desc: string };

/**
 * Interactive 3D model (Three.js, loaded on demand). One GLB, one node per
 * block: drag to orbit, wheel / pinch to zoom, tap a block to read its card.
 * Everything shown comes from the single source-of-truth model of the project.
 */
export default function ProjectModel3D({
  src,
  blocks,
  watermark,
  hint,
  loadLabel,
  resetLabel,
}: {
  src: string;
  blocks: ModelBlock[];
  watermark: string;
  hint: string;
  loadLabel: string;
  resetLabel: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<ModelBlock | null>(null);

  useEffect(() => {
    if (!active || !mountRef.current) return;
    const mount = mountRef.current;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.shadowMap.enabled = true;
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      // sky gradient (warm horizon → blue zenith), matches the baked golden-afternoon light
      const sky = document.createElement("canvas");
      sky.width = 2; sky.height = 256;
      const g2 = sky.getContext("2d")!;
      const grad = g2.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, "#7fa6cf"); grad.addColorStop(0.55, "#c9d8e4"); grad.addColorStop(1, "#efe3cc");
      g2.fillStyle = grad; g2.fillRect(0, 0, 2, 256);
      const skyTex = new THREE.CanvasTexture(sky); skyTex.colorSpace = THREE.SRGBColorSpace;
      scene.background = skyTex;
      scene.fog = new THREE.Fog("#e6dcc8", 280, 760);
      const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 1, 3000);
      const home = new THREE.Vector3(-150, 150, 170);
      camera.position.copy(home);

      scene.add(new THREE.HemisphereLight("#fff8ec", "#8a8270", 1.4));
      const sun = new THREE.DirectionalLight("#ffe2b0", 2.4);
      sun.position.set(-160, 180, 90);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.6;
      Object.assign(sun.shadow.camera, { left: -160, right: 160, top: 160, bottom: -160, far: 600 });
      scene.add(sun);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.maxPolarAngle = Math.PI * 0.47;
      controls.minDistance = 40;
      controls.maxDistance = 520;
      controls.target.set(0, 0, 0);

      const draco = new DRACOLoader();
      draco.setDecoderPath("/draco/");
      const loader = new GLTFLoader();
      loader.setDRACOLoader(draco);

      const pickable: import("three").Mesh[] = [];
      const blockOf = new Map<import("three").Mesh, string>();
      const meshesOf = new Map<string, import("three").Mesh[]>();
      const originals = new Map<import("three").Mesh, import("three").Material | import("three").Material[]>();
      let highlighted: import("three").Mesh[] = [];
      const hl = new THREE.MeshStandardMaterial({ color: "#c9a24b", emissive: "#8c6d2c", emissiveIntensity: 0.35 });
      const waters: import("three").Mesh[] = [];

      loader.load(
        src,
        (gltf) => {
          if (disposed) return;
          gltf.scene.traverse((o) => {
            const m = o as import("three").Mesh;
            if (m.isMesh) {
              const mat = m.material as import("three").MeshStandardMaterial;
              const name = mat?.name ?? "";
              if (name.startsWith("BAKED_")) {
                // light + shadows are baked into the texture: display unlit, exactly as rendered
                m.material = new THREE.MeshBasicMaterial({ map: mat.map, fog: true });
                m.castShadow = name !== "BAKED_Sol";
                m.receiveShadow = false;
              } else if (name.startsWith("WATER")) {
                m.material = new THREE.MeshPhysicalMaterial({
                  color: "#4fc6d8", roughness: 0.05, metalness: 0, transmission: 0.35, transparent: true,
                  opacity: 0.92, clearcoat: 1, clearcoatRoughness: 0.05,
                });
                waters.push(m);
              } else {
                m.castShadow = true;
                m.receiveShadow = true;
              }
              // glTF splits multi-material meshes into sibling primitives: walk up to the block node
              let n: import("three").Object3D | null = m;
              while (n && !blocks.some((b) => b.id === n!.name)) n = n.parent;
              if (n) {
                pickable.push(m);
                blockOf.set(m, n.name);
                meshesOf.set(n.name, [...(meshesOf.get(n.name) ?? []), m]);
              }
            }
          });
          scene.add(gltf.scene);
          setProgress(100);
        },
        (e) => e.total && setProgress(Math.round((e.loaded / e.total) * 100)),
      );

      const ray = new THREE.Raycaster();
      const ptr = new THREE.Vector2();
      let down = { x: 0, y: 0 };
      const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY });
      const onUp = (e: PointerEvent) => {
        if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return; // was a drag
        const r = renderer.domElement.getBoundingClientRect();
        ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ptr, camera);
        const hit = ray.intersectObjects(pickable, false)[0];
        highlighted.forEach((m) => (m.material = originals.get(m)!));
        highlighted = [];
        if (!hit) return setSelected(null);
        const id = blockOf.get(hit.object as import("three").Mesh) ?? "";
        highlighted = meshesOf.get(id) ?? [];
        highlighted.forEach((m) => {
          originals.set(m, m.material);
          m.material = hl;
        });
        setSelected(blocks.find((b) => b.id === id) ?? null);
      };
      renderer.domElement.addEventListener("pointerdown", onDown);
      renderer.domElement.addEventListener("pointerup", onUp);

      resetRef.current = () => {
        camera.position.copy(home);
        controls.target.set(0, 0, 0);
      };

      const onResize = () => {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(mount);

      let raf = 0;
      const clock = new THREE.Clock();
      const tick = () => {
        const t = clock.getElapsedTime();
        waters.forEach((w) => {
          const mm = w.material as import("three").MeshPhysicalMaterial;
          mm.clearcoatRoughness = 0.05 + 0.03 * Math.sin(t * 1.3);
        });
        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        renderer.domElement.removeEventListener("pointerdown", onDown);
        renderer.domElement.removeEventListener("pointerup", onUp);
        controls.dispose();
        draco.dispose();
        scene.traverse((o) => {
          const m = o as import("three").Mesh;
          if (m.isMesh) {
            m.geometry.dispose();
            (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [active, src, blocks]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory-dark md:aspect-[16/9]">
      <div ref={mountRef} className="absolute inset-0 touch-none" />
      {!active && (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="absolute inset-0 flex items-center justify-center bg-charcoal/40 text-on-dark"
        >
          <span className="border border-gold bg-charcoal/80 px-6 py-3 text-sm uppercase tracking-[0.2em]">
            {loadLabel}
          </span>
        </button>
      )}
      {active && progress < 100 && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-sand">
          <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {active && (
        <>
          <p className="pointer-events-none absolute left-4 top-4 bg-charcoal/70 px-3 py-1.5 text-xs text-on-dark">
            {hint}
          </p>
          <button
            type="button"
            onClick={() => resetRef.current()}
            className="absolute right-4 top-4 bg-charcoal/70 px-3 py-1.5 text-xs text-on-dark hover:bg-charcoal"
          >
            {resetLabel}
          </button>
        </>
      )}
      {selected && (
        <div className="absolute bottom-14 left-4 max-w-xs border-l-2 border-gold bg-ivory/95 p-4 shadow-lg">
          <p className="heading-display text-lg text-foreground">{selected.label}</p>
          <p className="mt-1 text-sm text-secondary">{selected.desc}</p>
        </div>
      )}
      <p className="pointer-events-none absolute bottom-3 right-3 bg-charcoal/85 px-3 py-1.5 text-xs tracking-wide text-gold">
        {watermark}
      </p>
    </div>
  );
}
