import type { ProfileAnalysisResult } from '@/types';

export const MOCK_PROFILE_PERSONA = {
    vibe_check: "An outstanding and highly versatile developer footprint. Renders extremely clean UI layouts coupled with robust system backends. Documentation is treated as a first-class citizen, showing a developer who values sustainability and team alignment.",
    archetype: "Full-Stack System Architect",
    strengths: [
        "First-rate design system aesthetics (heavy TypeScript + React adoption)",
        "Stellar documentation habits (detailed, engaging READMEs across core repos)",
        "Strong automation and DevOps integration in personal projects"
    ],
    growth_areas: [
        "A lot of lone-wolf solo projects; could benefit from contributing to higher-traffic open-source repositories",
        "Consider packaging helper utilities into published npm or PyPI packages"
    ],
    vibe_score: 92,
    contribution_style: "Polished Creator"
};

export const MOCK_PROFILE_RESULT: ProfileAnalysisResult = {
    profile: {
        username: "VanshKaushal",
        name: "Vansh Kaushal",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        bio: "Full-Stack Engineer & AI Enthusiast. Building premium user experiences, robust microservices, and agentic workflows.",
        company: "Acme Tech Labs",
        location: "Delhi, India",
        followers: 124,
        following: 58,
        public_repos: 28,
        total_stars: 485,
        total_forks: 92,
        html_url: "https://github.com/VanshKaushal"
    },
    languages: [
        { name: "TypeScript", percentage: 42.5, color: "#3178c6" },
        { name: "React", percentage: 24.1, color: "#61dafb" },
        { name: "Python", percentage: 18.4, color: "#3572A5" },
        { name: "CSS/Tailwind", percentage: 8.2, color: "#563d7c" },
        { name: "HTML", percentage: 4.3, color: "#e34c26" },
        { name: "Shell", percentage: 2.5, color: "#89e051" }
    ],
    commits: [
        { month: "2026-01", count: 42 },
        { month: "2026-02", count: 68 },
        { month: "2026-03", count: 110 },
        { month: "2026-04", count: 85 },
        { month: "2026-05", count: 143 }
    ],
    repositories: [
        {
            name: "Analyzer",
            description: "AI-powered repository reviewer and full profile diagnostics analyzer. Built with FastAPI and Vite.",
            stars: 154,
            forks: 32,
            language: "Python",
            size: 420,
            url: "https://github.com/VanshKaushal/Analyzer",
            vibe_score: 98
        },
        {
            name: "react-premium-ui",
            description: "A gorgeous collection of premium, animated, and accessible Tailwind CSS components for Vite & Next.js.",
            stars: 120,
            forks: 22,
            language: "TypeScript",
            size: 890,
            url: "https://github.com/VanshKaushal/react-premium-ui",
            vibe_score: 95
        },
        {
            name: "agentic-orchestrator",
            description: "Experimental local task running and code execution agent leveraging Gemini and Llama 3.",
            stars: 84,
            forks: 15,
            language: "Python",
            size: 210,
            url: "https://github.com/VanshKaushal/agentic-orchestrator",
            vibe_score: 88
        },
        {
            name: "portfolio-website",
            description: "My personal sleek portfolio built using Astro, TailwindCSS, and Framer Motion. 100% lighthouse score.",
            stars: 65,
            forks: 8,
            language: "TypeScript",
            size: 1500,
            url: "https://github.com/VanshKaushal/portfolio-website",
            vibe_score: 92
        },
        {
            name: "fastapi-celery-boilerplate",
            description: "Production ready backend boilerplate with async celery workers, redis broker, and postgreSQL migrations.",
            stars: 42,
            forks: 11,
            language: "Python",
            size: 180,
            url: "https://github.com/VanshKaushal/fastapi-celery-boilerplate",
            vibe_score: 85
        },
        {
            name: "tailwind-gradients-plugin",
            description: "A simple Tailwind CSS plugin to easily generate dynamic glassmorphism and ambient mesh gradients.",
            stars: 20,
            forks: 4,
            language: "JavaScript",
            size: 92,
            url: "https://github.com/VanshKaushal/tailwind-gradients-plugin",
            vibe_score: 80
        }
    ],
    persona: MOCK_PROFILE_PERSONA
};
