"use client";

import dynamic from "next/dynamic";
import type { PanoView } from "./Panorama360";
import type { ModelBlock } from "./ProjectModel3D";

// Three.js stays out of the server bundle and out of first paint.
const Panorama360 = dynamic(() => import("./Panorama360"), { ssr: false });
const ProjectModel3D = dynamic(() => import("./ProjectModel3D"), { ssr: false });

export default function DelCosta2Interactive({
  views,
  blocks,
  text,
}: {
  views: PanoView[];
  blocks: ModelBlock[];
  text: Record<
    | "watermark" | "visitLabel" | "visitTitle" | "visitHint" | "visitLoad"
    | "modelLabel" | "modelTitle" | "modelHint" | "modelLoad" | "modelReset",
    string
  >;
}) {
  return (
    <>
      <section className="bg-ivory">
        <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8">
          <p className="eyebrow text-gold-dark">{text.visitLabel}</p>
          <h2 className="heading-display mt-3 text-h2 text-foreground">{text.visitTitle}</h2>
          <div className="mt-10">
            <Panorama360 views={views} watermark={text.watermark} hint={text.visitHint} loadLabel={text.visitLoad} />
          </div>
        </div>
      </section>
      <section className="bg-ivory-dark">
        <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8">
          <p className="eyebrow text-gold-dark">{text.modelLabel}</p>
          <h2 className="heading-display mt-3 text-h2 text-foreground">{text.modelTitle}</h2>
          <div className="mt-10">
            <ProjectModel3D
              src="/models/del-costa-2.glb"
              blocks={blocks}
              watermark={text.watermark}
              hint={text.modelHint}
              loadLabel={text.modelLoad}
              resetLabel={text.modelReset}
            />
          </div>
        </div>
      </section>
    </>
  );
}
