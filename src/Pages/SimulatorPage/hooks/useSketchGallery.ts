import { useEffect, useState } from "react";
import axios from "../../../Services/axiosInstance";
import type { Cat } from "../applySketch.types";

export function useSketchGallery(apiBase: string, activeCat: Cat) {
    const [availableSketches, setAvailableSketches] = useState<string[]>([]);

    useEffect(() => {
        let alive = true;

        const fetchSketches = async () => {
            try {
                const res = await axios.get<string[]>(`${apiBase}/gallery/${activeCat}`);
                if (!alive) return;
                setAvailableSketches(Array.isArray(res.data) ? res.data : []);
            } catch {
                if (!alive) return;
                setAvailableSketches([]);
            }
        };

        fetchSketches();
        return () => {
            alive = false;
        };
    }, [activeCat, apiBase]);

    return availableSketches;
}
