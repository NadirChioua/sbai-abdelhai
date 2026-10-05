"use client";

import { useEffect, useRef, useState } from "react";

export type PanoView = { id: string; label: string; src: string };

/**
 * 360° viewer: equirectangular renders mapped on an inverted sphere.
 * Drag / swipe to look around, wheel or pinch to zoom, buttons switch views.
 */
export default function Panorama360({
  views,
  watermark,
  hint,
  loadLabel,
}: {
  views: PanoView[];
  watermark: string;
  hint: string;
  loadLabel: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const setTexRef = useRef<(src: string) => void>(() => {});
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active || !mountRef.current) return;
    const mount = mountRef.current;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100);
      const geo = new THREE.SphereGeometry(50, 64, 32);
      geo.scale(-1, 1, 1);
      const mat = new THREE.MeshBasicMaterial();
      scene.add(new THREE.Mesh(geo, mat));
      const loader = new THREE.TextureLoader();
      setTexRef.current = (s: string) =>
        loader.load(s, (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          mat.map?.dispose();
          mat.map = t;
          mat.needsUpdate = true;
        });

      let lon = 0, lat = 0, drag: { x: number; y: number; lon: number; lat: number } | null = null;
      const el = renderer.domElement;
      const onDown = (e: PointerEvent) => {
        drag = { x: e.clientX, y: e.clientY, lon, lat };
        el.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!drag) return;
        lon = drag.lon - (e.clientX - drag.x) * 0.12;
        lat = Math.max(-85, Math.min(85, drag.lat + (e.clientY - drag.y) * 0.12));
      };
      const onUp = () => (drag = null);
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        camera.fov = Math.max(35, Math.min(90, camera.fov + e.deltaY * 0.03));
        camera.updateProjectionMatrix();
      };
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("wheel", onWheel, { passive: false });
      const ro = new ResizeObserver(() => {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      });
      ro.observe(mount);
      let raf = 0;
      const tick = () => {
        const phi = THREE.MathUtils.degToRad(90 - lat), th = THREE.MathUtils.degToRad(lon);
        camera.lookAt(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th));
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();
      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("wheel", onWheel);
        mat.map?.dispose();
        mat.dispose();
        geo.dispose();
        renderer.dispose();
        el.remove();
      };
      setTexRef.current(views[0].src);
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [active, views]);

  const show = (i: number) => {
    setCurrent(i);
    setTexRef.current(views[i].src);
  };

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal md:aspect-[16/9]">
        <div ref={mountRef} className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing" />
        {!active && (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="absolute inset-0 flex items-center justify-center text-on-dark"
          >
            <span className="border border-gold bg-charcoal/80 px-6 py-3 text-sm uppercase tracking-[0.2em]">
              {loadLabel}
            </span>
          </button>
        )}
        {active && (
          <p className="pointer-events-none absolute left-4 top-4 bg-charcoal/70 px-3 py-1.5 text-xs text-on-dark">
            {hint}
          </p>
        )}
        <p className="pointer-events-none absolute bottom-3 right-3 bg-charcoal/85 px-3 py-1.5 text-xs tracking-wide text-gold">
          {watermark}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="tablist">
        {views.map((v, i) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={i === current}
            disabled={!active}
            onClick={() => show(i)}
            className={`border px-4 py-2 text-sm transition-colors disabled:opacity-50 ${
              i === current ? "border-gold bg-gold text-gold-on" : "border-sand text-foreground hover:border-gold"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
