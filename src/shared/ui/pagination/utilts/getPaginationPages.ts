export function getPaginationPages(
    current: number,
    total: number,
    siblings: number = 1,
): (number | string)[] {
    // Всегда показываем первые 2 и последние 2
    const alwaysShowFirst = 2;
    const alwaysShowLast = 2;

    // Если страниц мало — показываем все
    if (total <= alwaysShowFirst + alwaysShowLast + 2 * siblings + 3) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // 👇 Первые 2 страницы
    pages.push(1);
    pages.push(2);

    // Вычисляем центр
    let start = Math.max(3, current - siblings);
    let end = Math.min(total - 2, current + siblings);

    // Если есть разрыв — ставим '...'
    if (start > 3) {
        pages.push('...');
    }

    // Центр
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    // Если есть разрыв — ставим '...'
    if (end < total - 2) {
        pages.push('...');
    }

    // 👇 Последние 2 страницы
    pages.push(total - 1);
    pages.push(total);

    return pages;
}