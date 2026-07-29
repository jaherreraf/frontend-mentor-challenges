export type DifficultyLevel = "Newbie" | "Junior" | "Intermediate" | "Advanced" | "Guru";

export interface Project {
    title: string;
    description: string;
    image: string;
    difficultyLevel: DifficultyLevel;
    techStack: string[];
    isFeatured: boolean;
    demoUrl: string;
    githubUrl: string;
}
