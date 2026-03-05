import { useEffect, useMemo, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { to, useSpring } from "@react-spring/web";
import type { Cat, Frame } from "../applySketch.types";
import { CAT_RULES, OVERLAY_BASE } from "../applySketch.constants";

export function useOverlayController({
    ready,
    isMobile,
    activeCat,
    userImage,
    currentSketch,
    scaleMin,
    scaleMax,
    workAreaRef,
}: {
    ready: boolean;
    isMobile: boolean;
    activeCat: Cat;
    userImage: string | null;
    currentSketch: string | null;
    scaleMin: number;
    scaleMax: number;
    workAreaRef: React.RefObject<HTMLDivElement>;
}) {
    const [frame, setFrame] = useState<Frame>({
        translate: [0, 0],
        rotate: 0,
        scale: [1, 1],
    });

    const frameRef = useRef<Frame>(frame);
    useEffect(() => {
        frameRef.current = frame;
    }, [frame]);

    const [{ x, y, scale, rotateZ }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: 1,
        rotateZ: 0,
    }));

    const lastInitKeyRef = useRef<string>("");
    const hasUserMovedRef = useRef(false);
    const prevDepsRef = useRef({ userImage, currentSketch, activeCat });

    const computeCentered = (cat: Cat) => {
        const el = workAreaRef.current;
        if (!el) return null;

        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return null;

        const base = Math.min(w, h);
        const targetPx = base * CAT_RULES[cat].initialTargetRatio;

        const initialScale = Math.max(scaleMin, Math.min(scaleMax, targetPx / OVERLAY_BASE));
        const scaled = OVERLAY_BASE * initialScale;

        const cx = Math.max(14, w / 2 - scaled / 2);
        const cy = Math.max(14, h / 2 - scaled / 2);

        return { cx, cy, initialScale };
    };

    const centerAndInitScale = (cat: Cat, force = false) => {
        if (!ready) return;

        const key = `${cat}::${userImage || ""}::${currentSketch || ""}`;
        if (!force && lastInitKeyRef.current === key) return;
        if (!force && hasUserMovedRef.current) return;

        const data = computeCentered(cat);
        if (!data) return;

        lastInitKeyRef.current = key;

        if (isMobile) {
            api.start({ x: data.cx, y: data.cy, scale: data.initialScale, rotateZ: 0 });
        } else {
            setFrame({ translate: [data.cx, data.cy], rotate: 0, scale: [data.initialScale, data.initialScale] });
        }
    };

    const requestCenter = (force = false) => {
        if (!ready) return;

        let tries = 0;
        const tick = () => {
            tries += 1;
            const before = lastInitKeyRef.current;
            centerAndInitScale(activeCat, force);

            const after = lastInitKeyRef.current;
            const didInit = before !== after;

            if (!didInit && tries < 10) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    const resetInit = () => {
        hasUserMovedRef.current = false;
        lastInitKeyRef.current = "";
    };

    const rotate = () => {
        if (!ready) return;
        hasUserMovedRef.current = true;
        if (isMobile) api.start({ rotateZ: (rotateZ.get() + 90) % 360 });
        else setFrame((prev) => ({ ...prev, rotate: (prev.rotate + 90) % 360 }));
    };

    const reset = () => {
        if (!ready) return;
        resetInit();
        requestCenter(true);
    };

    const bindMobile = useGesture(
        {
            onDragStart: () => {
                hasUserMovedRef.current = true;
            },
            onDrag: ({ offset: [dx, dy] }) => {
                hasUserMovedRef.current = true;
                api.start({ x: dx, y: dy });
            },
            onPinchStart: () => {
                hasUserMovedRef.current = true;
            },
            onPinch: ({ offset: [s, a] }) => {
                hasUserMovedRef.current = true;
                const clamped = Math.max(scaleMin, Math.min(scaleMax, s));
                api.start({ scale: clamped, rotateZ: a });
            },
        },
        {
            drag: { from: () => [x.get(), y.get()] },
            pinch: {
                from: () => [scale.get(), rotateZ.get()],
                scaleBounds: { min: scaleMin, max: scaleMax },
                rubberband: true,
                preventDefault: true,
            },
            eventOptions: { passive: false },
        }
    );

    const bindDesktop = useGesture(
        {
            onDragStart: () => {
                hasUserMovedRef.current = true;
            },
            onDrag: ({ offset: [dx, dy] }) => {
                hasUserMovedRef.current = true;
                setFrame((prev) => ({ ...prev, translate: [dx, dy] }));
            },
            onWheel: ({ event, delta: [, dy] }) => {
                event.preventDefault();
                hasUserMovedRef.current = true;
                setFrame((prev) => {
                    const factor = Math.exp(-dy / 320);
                    const next = prev.scale[0] * factor;
                    const clamped = Math.max(scaleMin, Math.min(scaleMax, next));
                    return { ...prev, scale: [clamped, clamped] };
                });
            },
            onPinchStart: () => {
                hasUserMovedRef.current = true;
            },
            onPinch: ({ offset: [s, a] }) => {
                hasUserMovedRef.current = true;
                setFrame((prev) => {
                    const clamped = Math.max(scaleMin, Math.min(scaleMax, s));
                    return { ...prev, scale: [clamped, clamped], rotate: a };
                });
            },
        },
        {
            drag: { from: () => frameRef.current.translate },
            eventOptions: { passive: false },
        }
    );
    useEffect(() => {
        if (!ready) return;

        const depsChanged =
            prevDepsRef.current.userImage !== userImage ||
            prevDepsRef.current.currentSketch !== currentSketch ||
            prevDepsRef.current.activeCat !== activeCat;
        if (depsChanged || lastInitKeyRef.current === "") {
            prevDepsRef.current = { userImage, currentSketch, activeCat };
            resetInit();
            requestCenter(true);
        }
    }, [ready, userImage, currentSketch, activeCat]);

    useEffect(() => {
        if (!ready) return;
        const el = workAreaRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => {
            requestCenter(false);
        });
        ro.observe(el);
        return () => ro.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready]);

    const desktopStyle = useMemo(() => {
        return {
            position: "absolute" as const,
            left: 0,
            top: 0,
            transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg) scale(${frame.scale[0]}, ${frame.scale[1]})`,
            transformOrigin: "center center",
            width: OVERLAY_BASE,
            height: OVERLAY_BASE,
            opacity: 0.88,
            cursor: "grab",
            userSelect: "none" as const,
            willChange: "transform",
            touchAction: "none" as const,
        };
    }, [frame]);

    const mobileTransform = useMemo(() => {
        return to([x, y, scale, rotateZ], (tx, ty, s, r) => `translate(${tx}px, ${ty}px) rotate(${r}deg) scale(${s})`);
    }, [x, y, scale, rotateZ]);

    const mobileStyle = useMemo(() => {
        return {
            position: "absolute" as const,
            left: 0,
            top: 0,
            width: OVERLAY_BASE,
            height: OVERLAY_BASE,
            opacity: 0.88,
            touchAction: "none" as const,
            willChange: "transform",
            transformOrigin: "center center",
            cursor: "grab",
            userSelect: "none" as const,
            transform: mobileTransform,
        };
    }, [mobileTransform]);

    return {
        frame,
        x,
        y,
        scale,
        rotateZ,
        bindMobile,
        bindDesktop,
        mobileStyle,
        desktopStyle,
        resetInit,
        requestCenter,
        rotate,
        reset,
    };
}