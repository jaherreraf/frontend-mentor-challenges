export function initFmHubFilters() {
    const projectCards = document.querySelectorAll<HTMLElement>(".project-card");
    const placeholderCards = document.querySelectorAll<HTMLElement>(".placeholder-card");
    const difficultyButtons = document.querySelectorAll<HTMLElement>(".difficulty-btn");
    const toolButtons = document.querySelectorAll<HTMLElement>(".tool-btn");
    const favoriteToggle = document.getElementById("favorite-toggle");
    const searchInput = document.getElementById("project-search") as HTMLInputElement | null;
    const noResults = document.getElementById("no-results");

    const state = {
        difficulty: "All",
        tool: "All",
        favoritesOnly: false,
        search: "",
    };

    const LEVEL_ORDER: Record<string, number> = {
        Newbie: 1,
        Junior: 2,
        Intermediate: 3,
        Advanced: 4,
        Guru: 5,
    };

    const isDefaultState = () =>
        state.difficulty === "All" && state.tool === "All" && !state.favoritesOnly && state.search === "";

    function sortProjectCards(cards: HTMLElement[]) {
        return cards.sort((a, b) => {
            const levelA = LEVEL_ORDER[a.getAttribute("data-level") || "Newbie"] || 1;
            const levelB = LEVEL_ORDER[b.getAttribute("data-level") || "Newbie"] || 1;
            if (levelB !== levelA) return levelB - levelA;
            const featA = a.getAttribute("data-featured") === "true" ? 1 : 0;
            const featB = b.getAttribute("data-featured") === "true" ? 1 : 0;
            return featB - featA;
        });
    }

    function reorderCards() {
        const grid = document.querySelector<HTMLElement>(".projects-bento");
        if (!grid) return;
        const cardsArray = Array.from(projectCards);
        const placeholders = grid.querySelectorAll<HTMLElement>(".placeholder-card");
        sortProjectCards(cardsArray);
        cardsArray.forEach((card) => grid.appendChild(card));
        placeholders.forEach((p) => grid.appendChild(p));
    }

    function applyFilters() {
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const level = card.getAttribute("data-level");
            const cardTools = (card.getAttribute("data-tools") || "").split(",");
            const isFeatured = card.getAttribute("data-featured") === "true";
            const title = card.getAttribute("data-title") || "";

            const matchesDifficulty = state.difficulty === "All" || level === state.difficulty;
            const matchesTool = state.tool === "All" || cardTools.includes(state.tool);
            const matchesFavorite = !state.favoritesOnly || isFeatured;
            const matchesSearch = state.search === "" || title.includes(state.search);

            const visible = matchesDifficulty && matchesTool && matchesFavorite && matchesSearch;
            if (visible) visibleCount++;

            if (visible) {
                card.style.display = "";
                card.style.opacity = "1";
                card.style.transform = "scale(1)";
            } else {
                card.style.opacity = "0";
                card.style.transform = "scale(0.95)";
                setTimeout(() => {
                    if (card.style.opacity === "0") card.style.display = "none";
                }, 300);
            }
        });

        reorderCards();

        const showPlaceholders = isDefaultState();
        placeholderCards.forEach((card) => {
            card.style.display = showPlaceholders ? "" : "none";
        });

        noResults?.classList.toggle("hidden", visibleCount !== 0);
    }

    difficultyButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            state.difficulty = btn.getAttribute("data-difficulty") || "All";
            difficultyButtons.forEach((b) => b.classList.toggle("active", b === btn));
            applyFilters();
        });
    });

    toolButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            state.tool = btn.getAttribute("data-tool") || "All";
            toolButtons.forEach((b) => b.classList.toggle("active", b === btn));
            applyFilters();
        });
    });

    favoriteToggle?.addEventListener("click", () => {
        state.favoritesOnly = !state.favoritesOnly;
        favoriteToggle.classList.toggle("active", state.favoritesOnly);
        applyFilters();
    });

    let searchDebounce: ReturnType<typeof setTimeout>;
    searchInput?.addEventListener("input", () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            state.search = searchInput.value.trim().toLowerCase();
            applyFilters();
        }, 150);
    });

    document.querySelector<HTMLElement>('[data-difficulty="All"]')?.classList.add("active");
    document.querySelector<HTMLElement>('[data-tool="All"]')?.classList.add("active");
}
