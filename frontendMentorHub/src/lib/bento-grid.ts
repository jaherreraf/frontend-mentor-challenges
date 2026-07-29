import type { DifficultyLevel, Project } from "@/types/project.types";
const LEVEL_ORDER: Record<DifficultyLevel, number> = {
    Newbie: 1,
    Junior: 2,
    Intermediate: 3,
    Advanced: 4,
    Guru: 5,
};
export const levelIndex = (level: DifficultyLevel): number => LEVEL_ORDER[level] ?? 1;
export const difficultyColor = (level: DifficultyLevel): string => {
    if (level === "Advanced" || level === "Guru") return "bg-red-500/20 text-red-300";
    if (level === "Intermediate") return "bg-amber-500/20 text-amber-300";
    if (level === "Junior") return "bg-sky-500/20 text-sky-300";
    return "bg-emerald-500/20 text-emerald-300"; // Newbie
};
export const patternPos = (index: number): number => index % 5;
export const isTallSlot = (pos: number): boolean => pos === 0 || pos === 4;
export const isWideSlot = (pos: number): boolean => pos === 1;

export interface PlaceholderSlot {
    column: string;
    rowSpan: number;
}

export const getPlaceholderSlots = (totalProjects: number): PlaceholderSlot[] => {
    const remainder = totalProjects % 5;
    switch (remainder) {
        case 1:
            // Todo el espacio restante del bloque es un rectángulo: 1 sola card grande
            return [{ column: "2 / span 3", rowSpan: 2 }];
        case 2:
            return [
                { column: "2 / span 2", rowSpan: 1 },
                { column: "4", rowSpan: 2 },
            ];
        case 3:
            return [
                { column: "3", rowSpan: 1 },
                { column: "4", rowSpan: 2 },
            ];
        case 4:
            return [{ column: "4", rowSpan: 2 }];
        default:
            return [];
    }
};

export const getProjectStats = (projects: Project[]) => {
    const featuredCount = projects.filter((p) => p.isFeatured).length;
    const techStackCounts = {
        Vue: projects.filter((p) => p.techStack.includes("Vue")).length,
        React: projects.filter((p) => p.techStack.includes("React")).length,
        Astro: projects.filter((p) => p.techStack.includes("Astro")).length,
        Vainilla: projects.filter((p) => p.techStack.includes("Vainilla")).length,
    };
    const difficultyCounts: Record<DifficultyLevel, number> = {
        Newbie: 0,
        Junior: 0,
        Intermediate: 0,
        Advanced: 0,
        Guru: 0,
    };
    projects.forEach((p) => {
        difficultyCounts[p.difficultyLevel]++;
    });
    return {
        total: projects.length,
        featuredCount,
        techStackCounts,
        difficultyCounts,
    };
};
