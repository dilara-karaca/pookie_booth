import type { FrameCategory, FrameDesign } from "../types";

export const categories: Array<{ id: FrameCategory; label: string; blurb: string }> = [
  { id: "classic", label: "Classic", blurb: "Clean color borders" },
  { id: "lovely", label: "Lovely", blurb: "Hearts, bows, and love notes" },
  { id: "sweet", label: "Sweet", blurb: "Fruit, flowers, and clouds" },
  { id: "gingham", label: "Gingham", blurb: "Checks, stripes, and cloth" },
  { id: "retro", label: "Retro", blurb: "Y2K stars and groovy shapes" },
  { id: "special", label: "Special", blurb: "Little celebration themes" },
];

export const frameDesigns: FrameDesign[] = [
  design("classic-white", "White", "classic", "#FFFEFB", "#E7DCD2", [], "solid", "#40354B"),
  design("classic-black", "Black", "classic", "#1C1722", "#3A3344", [], "solid", "#FFF9F0"),
  design("classic-baby-pink", "Baby Pink", "classic", "#FFD4E0", "#FF8FAB", [], "solid", "#40354B"),
  design("classic-lavender", "Lavender", "classic", "#E6D6F5", "#B48CC8", [], "solid", "#40354B"),
  design("classic-baby-blue", "Baby Blue", "classic", "#D3E9FF", "#7EB6F0", [], "solid", "#243056"),
  design("classic-butter", "Butter Yellow", "classic", "#FFE9A8", "#F0C94A", [], "solid", "#40354B"),
  design("classic-mint", "Mint", "classic", "#D2F6E4", "#7DCFAB", [], "solid", "#214237"),
  design("classic-peach", "Peach", "classic", "#FFDCCB", "#F3A784", [], "solid", "#40354B"),
  design("classic-burgundy", "Burgundy", "classic", "#7A3048", "#C46B84", [], "solid", "#FFF4F6"),
  design("classic-navy", "Navy", "classic", "#243056", "#8EADD6", [], "solid", "#FFF9F0"),

  design("lovely-pink-hearts", "Pink Hearts", "lovely", "#FFE6EF", "#FF8FAB", ["#FF8FAB", "#FF5D8F"], "hearts", "#6B2A45"),
  design("lovely-red-hearts", "Red Hearts", "lovely", "#FFF1F1", "#E23D4A", ["#E23D4A", "#FF8A93"], "hearts", "#7A2430"),
  design("lovely-bows", "Ribbon Bows", "lovely", "#FFF5FB", "#F2A4C8", ["#F2A4C8", "#CDB4DB"], "bows", "#6B3A58"),
  design("lovely-love-notes", "Love Notes", "lovely", "#FFEAF2", "#FF6B8A", ["#FF6B8A", "#CDB4DB"], "love", "#6B2A45"),

  design("sweet-strawberry", "Strawberry", "sweet", "#FFF6F7", "#E23B4A", ["#E23B4A", "#3E8F4A"], "strawberry", "#6B2A3A"),
  design("sweet-cherry", "Cherry", "sweet", "#FFF7F4", "#D63A45", ["#D63A45", "#3E8F4A"], "cherry", "#6B2A3A"),
  design("sweet-daisy", "Daisy", "sweet", "#FFFEF8", "#F2C14E", ["#FFFDF8", "#F2C14E", "#7DCFAB"], "daisy", "#3E5A32"),
  design("sweet-tiny-flowers", "Tiny Flowers", "sweet", "#F7FFF6", "#F2A4C8", ["#F2A4C8", "#FFE66D", "#A2D2FF", "#CDB4DB"], "flowers", "#3E4A38"),
  design("sweet-clouds", "Cute Clouds", "sweet", "#F4F8FF", "#FFFFFF", ["#FFFFFF", "#A2D2FF"], "clouds", "#243056"),

  design("gingham-pink", "Pink Gingham", "gingham", "#FFE4EC", "#FF8FAB", ["#FF8FAB"], "gingham", "#6B2A45"),
  design("gingham-blue", "Blue Gingham", "gingham", "#E7F3FF", "#7EB6F0", ["#7EB6F0"], "gingham", "#243056"),
  design("gingham-yellow", "Yellow Checkered", "gingham", "#FFF6D4", "#F0C94A", ["#F0C94A"], "checkers", "#5A4518"),
  design("gingham-stripes", "Pastel Stripes", "gingham", "#FFF9F0", "#FF8FAB", ["#FFC2D1", "#CDB4DB", "#A2D2FF", "#FFE66D"], "stripes", "#40354B"),
  design("gingham-retro", "Retro Checkers", "gingham", "#FFF9F0", "#40354B", ["#FF8FAB", "#FFE66D"], "checkers", "#40354B"),

  design("retro-stars", "Retro Stars", "retro", "#2A2150", "#FFE66D", ["#FFE66D", "#FF8FAB", "#A2D2FF"], "stars", "#FFF9F0"),
  design("retro-disco", "Disco", "retro", "#1C1230", "#FF8FAB", ["#FF8FAB", "#FFE66D", "#7DFFD2", "#A2D2FF"], "disco", "#FFF9F0"),
  design("retro-groovy", "Groovy Flowers", "retro", "#FFF1E4", "#FF8A5B", ["#FF8A5B", "#FFE66D", "#CDB4DB", "#7DCFAB"], "groovy", "#5A2E22"),
  design("retro-shapes", "Colorful Shapes", "retro", "#FFF9F0", "#40354B", ["#FF8FAB", "#A2D2FF", "#FFE66D", "#CDB4DB"], "shapes", "#40354B"),
  design("retro-y2k-hearts", "Y2K Hearts", "retro", "#FFD6E8", "#FF4F8B", ["#FF4F8B", "#7AF0FF", "#FFE66D"], "y2k-hearts", "#402038"),

  design("special-birthday", "Birthday", "special", "#FFF6E8", "#FF8FAB", ["#FF8FAB", "#A2D2FF", "#FFE66D", "#CDB4DB"], "birthday", "#5A3A22"),
  design("special-valentine", "Valentine's Day", "special", "#FFE5EC", "#E23D4A", ["#E23D4A", "#FF8FAB"], "valentine", "#7A2430"),
  design("special-christmas", "Christmas", "special", "#1F4D3A", "#F4D35E", ["#F4FFF8", "#E23D4A", "#F4D35E"], "christmas", "#FFF9F0"),
  design("special-new-year", "New Year", "special", "#1B1740", "#F4D35E", ["#F4D35E", "#FFF9F0", "#FF8FAB"], "newyear", "#FFF6D4"),
];

function design(
  id: string,
  name: string,
  category: FrameCategory,
  backgroundColor: string,
  accentColor: string,
  patternColors: string[],
  patternId: FrameDesign["patternId"],
  textColor: string,
): FrameDesign {
  return {
    id,
    name,
    category,
    backgroundColor,
    accentColor,
    patternColors: patternColors.length > 0 ? patternColors : [accentColor],
    patternId,
    textColor,
  };
}

const byId = new Map(frameDesigns.map((item) => [item.id, item]));

export function getDesign(id: string): FrameDesign {
  return byId.get(id) ?? frameDesigns[0];
}

export function designsByCategory(category: FrameCategory): FrameDesign[] {
  return frameDesigns.filter((item) => item.category === category);
}
