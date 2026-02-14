export function calculateLevel(xp) {
  if (xp >= 2000) return { level: 5, title: "Placement Warrior" };
  if (xp >= 1200) return { level: 4, title: "Aptitude Ninja" };
  if (xp >= 700) return { level: 3, title: "Expert" };
  if (xp >= 300) return { level: 2, title: "Challenger" };
  return { level: 1, title: "Beginner" };
}
