import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../../../Services/axiosInstance";
import type { CanvasItem, TabKey } from "../components/types";

export function useCanvases(apiBase: string) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<CanvasItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<TabKey>("all");

    const refresh = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const res = await axios.get<CanvasItem[]>(`${apiBase}/canvases`);
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch {
            setItems([]);
            setError("נכשל לטעון קאנבסים");
        } finally {
            setLoading(false);
        }
    }, [apiBase]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const counts = useMemo(() => {
        const base: Record<TabKey, number> = { all: items.length, "80×25": 0, "50×40": 0, "80×60": 0 };
        for (const c of items) base[c.size] += 1;
        return base;
    }, [items]);

    const filtered = useMemo(() => {
        if (tab === "all") return items;
        return items.filter((c) => c.size === tab);
    }, [items, tab]);

    return { loading, error, items, filtered, tab, setTab, counts, refresh };
}
