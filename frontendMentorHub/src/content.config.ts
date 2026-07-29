import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projectsCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        difficultyLevel: z.enum(["Newbie", "Junior", "Intermediate", "Advanced", "Guru"]),
        techStack: z.array(z.string()),
        demoUrl: z.string().url(),
        githubUrl: z.string().url(),
        image: z.string(),
        isFeatured: z.boolean().default(false),
    }),
});

export const collections = {
    projects: projectsCollection,
};
