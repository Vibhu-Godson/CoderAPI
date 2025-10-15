import React, { useState } from "react";
import { Tldraw, TLStore, createTLStore, defaultShapeUtils } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

export default function BoardPanel() {
    // Create a TLDraw store to hold the drawing state
    const [store] = useState<TLStore>(() => {
        const s = createTLStore({ shapeUtils: defaultShapeUtils });
        return s;
    });

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Tldraw store={store} />
        </div>
    );
}
