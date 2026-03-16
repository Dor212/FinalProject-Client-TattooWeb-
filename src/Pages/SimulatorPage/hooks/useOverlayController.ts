import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type RefObject,
} from "react";
import { useGesture } from "@use-gesture/react";
import type { Cat, Frame } from "../applySketch.types";
import { CAT_RULES, OVERLAY_BASE } from "../applySketch.constants";

type Rect = {
    left: number;
    top: number;
    width: number;
    height: number;
};

type OverlaySnapshot = {
    translate: [number, number];
    rotate: number;
    scale: number;
};

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

const getContainedRect = (
    containerWidth: number,
    containerHeight: number,
    mediaWidth: number,
    mediaHeight: number
): Rect | null => {
    if (!containerWidth || !containerHeight || !mediaWidth || !mediaHeight) return null;

    const containerRatio = containerWidth / containerHeight;
    const mediaRatio = mediaWidth / mediaHeight;

    if (mediaRatio > containerRatio) {
        const width = containerWidth;
        const height = width / mediaRatio;
        return {
            left: 0,
            top: (containerHeight - height) / 2,
            width,
            height,
        };
    }

    const height = containerHeight;
    const width = height * mediaRatio;

    return {
        left: (containerWidth - width) / 2,
        top: 0,
        width,
        height,
    };
};

const loadImageSize = (src: string) =>
    new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const width = img.naturalWidth || img.width;
            const height = img.naturalHeight || img.height;

            if (!width || !height) {
                reject(new Error("Could not read image size"));
                return;
            }

            resolve({ width, height });
        };
        img.onerror = () => reject(new Error("Could not load image"));
        img.src = src;
    });

export function useOverlayController({
    ready,
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
    workAreaRef: RefObject<HTMLDivElement | null>;
}) {
    const [frame, setFrame] = useState<Frame>({
        translate: [0, 0],
        rotate: 0,
        scale: [1, 1],
    });

    const frameRef = useRef(frame);
    useEffect(() => {
        frameRef.current = frame;
    }, [frame]);

    const lastInitKeyRef = useRef("");
    const hasUserMovedRef = useRef(false);
    const prevDepsRef = useRef({ userImage, currentSketch, activeCat });
    const userImageSizeRef = useRef<{ width: number; height: number } | null>(null);
    const imageRectRef = useRef<Rect | null>(null);

    const getImageRect = useCallback((): Rect | null => {
        const el = workAreaRef.current;
        const size = userImageSizeRef.current;
        if (!el || !size) return null;

        return getContainedRect(el.clientWidth, el.clientHeight, size.width, size.height);
    }, [workAreaRef]);

    const getSnapshot = useCallback((): OverlaySnapshot => {
        return {
            translate: frameRef.current.translate,
            rotate: frameRef.current.rotate,
            scale: frameRef.current.scale[0],
        };
    }, []);

    const applySnapshot = useCallback(
        (next: OverlaySnapshot) => {
            const clampedScale = clamp(next.scale, scaleMin, scaleMax);

            setFrame({
                translate: next.translate,
                rotate: next.rotate,
                scale: [clampedScale, clampedScale],
            });
        },
        [scaleMax, scaleMin]
    );

    const computeCentered = useCallback(
        (cat: Cat) => {
            const rect = getImageRect();
            if (!rect) return null;

            const base = Math.min(rect.width, rect.height);
            const targetPx = base * CAT_RULES[cat].initialTargetRatio;
            const initialScale = clamp(targetPx / OVERLAY_BASE, scaleMin, scaleMax);

            return {
                rect,
                translate: [
                    rect.left + rect.width / 2 - OVERLAY_BASE / 2,
                    rect.top + rect.height / 2 - OVERLAY_BASE / 2,
                ] as [number, number],
                initialScale,
            };
        },
        [getImageRect, scaleMax, scaleMin]
    );

    const centerAndInitScale = useCallback(
        (cat: Cat, force = false) => {
            if (!ready) return false;

            const key = `${cat}::${userImage || ""}::${currentSketch || ""}`;
            if (!force && lastInitKeyRef.current === key) return false;
            if (!force && hasUserMovedRef.current) return false;

            const data = computeCentered(cat);
            if (!data) return false;

            lastInitKeyRef.current = key;
            imageRectRef.current = data.rect;

            applySnapshot({
                translate: data.translate,
                rotate: 0,
                scale: data.initialScale,
            });

            return true;
        },
        [applySnapshot, computeCentered, currentSketch, ready, userImage]
    );

    const requestCenter = useCallback(
        (force = false) => {
            if (!ready) return;

            let tries = 0;

            const tick = () => {
                tries += 1;
                const didInit = centerAndInitScale(activeCat, force);

                if (!didInit && tries < 10) {
                    requestAnimationFrame(tick);
                }
            };

            requestAnimationFrame(tick);
        },
        [activeCat, centerAndInitScale, ready]
    );

    const resetInit = useCallback(() => {
        hasUserMovedRef.current = false;
        lastInitKeyRef.current = "";
    }, []);

    const rotate = useCallback(() => {
        if (!ready) return;

        hasUserMovedRef.current = true;
        const snapshot = getSnapshot();

        applySnapshot({
            ...snapshot,
            rotate: (snapshot.rotate + 90) % 360,
        });
    }, [applySnapshot, getSnapshot, ready]);

    const reset = useCallback(() => {
        if (!ready) return;
        resetInit();
        requestCenter(true);
    }, [ready, requestCenter, resetInit]);

    const remapToNextImageRect = useCallback(
        (nextRect: Rect) => {
            const prevRect = imageRectRef.current;
            if (!prevRect) {
                imageRectRef.current = nextRect;
                return;
            }

            const snapshot = getSnapshot();

            const prevCenterX = snapshot.translate[0] + OVERLAY_BASE / 2;
            const prevCenterY = snapshot.translate[1] + OVERLAY_BASE / 2;

            const relCenterX = prevRect.width
                ? (prevCenterX - prevRect.left) / prevRect.width
                : 0.5;
            const relCenterY = prevRect.height
                ? (prevCenterY - prevRect.top) / prevRect.height
                : 0.5;

            const prevBase = Math.min(prevRect.width, prevRect.height);
            const nextBase = Math.min(nextRect.width, nextRect.height);

            const nextScale = prevBase
                ? clamp(snapshot.scale * (nextBase / prevBase), scaleMin, scaleMax)
                : snapshot.scale;

            imageRectRef.current = nextRect;

            applySnapshot({
                translate: [
                    nextRect.left + relCenterX * nextRect.width - OVERLAY_BASE / 2,
                    nextRect.top + relCenterY * nextRect.height - OVERLAY_BASE / 2,
                ],
                rotate: snapshot.rotate,
                scale: nextScale,
            });
        },
        [applySnapshot, getSnapshot, scaleMax, scaleMin]
    );

    const bindMobile = useGesture(
        {
            onDragStart: () => {
                hasUserMovedRef.current = true;
            },
            onDrag: ({ offset: [dx, dy] }) => {
                hasUserMovedRef.current = true;
                setFrame((prev) => ({ ...prev, translate: [dx, dy] }));
            },
            onPinchStart: () => {
                hasUserMovedRef.current = true;
            },
            onPinch: ({ offset: [s, a] }) => {
                hasUserMovedRef.current = true;
                const clamped = clamp(s, scaleMin, scaleMax);
                setFrame((prev) => ({
                    ...prev,
                    scale: [clamped, clamped],
                    rotate: a,
                }));
            },
        },
        {
            drag: {
                from: () => frameRef.current.translate,
                filterTaps: true,
            },
            pinch: {
                from: () =>
                    [frameRef.current.scale[0], frameRef.current.rotate] as [number, number],
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
                    const clamped = clamp(next, scaleMin, scaleMax);
                    return { ...prev, scale: [clamped, clamped] };
                });
            },
            onPinchStart: () => {
                hasUserMovedRef.current = true;
            },
            onPinch: ({ offset: [s, a] }) => {
                hasUserMovedRef.current = true;
                const clamped = clamp(s, scaleMin, scaleMax);
                setFrame((prev) => ({
                    ...prev,
                    scale: [clamped, clamped],
                    rotate: a,
                }));
            },
        },
        {
            drag: {
                from: () => frameRef.current.translate,
                filterTaps: true,
            },
            pinch: {
                from: () =>
                    [frameRef.current.scale[0], frameRef.current.rotate] as [number, number],
                scaleBounds: { min: scaleMin, max: scaleMax },
                rubberband: true,
            },
            eventOptions: { passive: false },
        }
    );

    useEffect(() => {
        if (!userImage) {
            userImageSizeRef.current = null;
            imageRectRef.current = null;
            return;
        }

        let cancelled = false;

        loadImageSize(userImage)
            .then((size) => {
                if (cancelled) return;
                userImageSizeRef.current = size;
                resetInit();
                requestCenter(true);
            })
            .catch(() => {
                if (cancelled) return;
                userImageSizeRef.current = null;
                imageRectRef.current = null;
            });

        return () => {
            cancelled = true;
        };
    }, [requestCenter, resetInit, userImage]);

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
    }, [activeCat, currentSketch, ready, requestCenter, resetInit, userImage]);

    useEffect(() => {
        if (!ready) return;

        const el = workAreaRef.current;
        if (!el) return;

        const ro = new ResizeObserver(() => {
            const nextRect = getImageRect();
            if (!nextRect) return;

            if (!imageRectRef.current || lastInitKeyRef.current === "") {
                requestCenter(true);
                return;
            }

            remapToNextImageRect(nextRect);
        });

        ro.observe(el);
        return () => ro.disconnect();
    }, [getImageRect, ready, remapToNextImageRect, requestCenter, workAreaRef]);

    const commonStyle = useMemo(
        () => ({
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
        }),
        [frame]
    );

    return {
        frame,
        bindMobile,
        bindDesktop,
        mobileStyle: commonStyle,
        desktopStyle: commonStyle,
        resetInit,
        requestCenter,
        rotate,
        reset,
        getSnapshot,
        getImageRect,
    };
}