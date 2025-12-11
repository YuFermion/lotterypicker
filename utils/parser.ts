import { LotteryDraw } from "../types";

export const parseLotteryHTML = (htmlString: string): LotteryDraw[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const draws: LotteryDraw[] = [];

  // Based on the user provided screenshot structure
  // Looks for rows in a table body
  const rows = doc.querySelectorAll('tr');

  rows.forEach((row) => {
    try {
      const cells = row.querySelectorAll('td');
      if (cells.length < 5) return; // Not a valid data row

      // 1. Extract Period ID (e.g., 25141)
      const id = cells[0]?.textContent?.trim() || '';
      
      // 2. Extract Date (e.g., 2025-12-10)
      // Note: The screenshot shows specific classes, we can try to be robust
      const date = cells[1]?.textContent?.trim() || '';

      // 3. Extract Red Balls
      // Class name in screenshot: "u-dltpre"
      const redCells = row.querySelectorAll('.u-dltpre');
      const redBalls: number[] = [];
      redCells.forEach(cell => {
        const num = parseInt(cell.textContent?.trim() || '0');
        if (!isNaN(num) && num > 0) redBalls.push(num);
      });

      // 4. Extract Blue Balls
      // Screenshot shows structure: td.u-dltnext > span > "02" and td.u-dltnext > "10"
      // Or simply cells with class 'u-dltnext'
      const blueCells = row.querySelectorAll('.u-dltnext');
      const blueBalls: number[] = [];
      
      blueCells.forEach(cell => {
         // Sometimes the text is directly in TD, sometimes in a SPAN
         const text = (cell as HTMLElement).innerText || cell.textContent || '';
         // Remove newlines and extra spaces
         const cleanText = text.replace(/\s+/g, ' ').trim();
         // Attempt to find numbers
         const match = cleanText.match(/\d+/);
         if (match) {
            const num = parseInt(match[0]);
            if (!isNaN(num) && num > 0) blueBalls.push(num);
         }
      });

      // Validation
      if (id && redBalls.length === 5 && blueBalls.length >= 2) {
        draws.push({
          id,
          date,
          redBalls,
          blueBalls: blueBalls.slice(0, 2) // Ensure only 2
        });
      }
    } catch (e) {
      console.warn("Row parse error:", e);
    }
  });

  return draws;
};