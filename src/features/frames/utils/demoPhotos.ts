const cache = new Map<string, string>();

export function getDemoPhoto(scene: DemoScene): string {
  const cached = cache.get(scene);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  scenes[scene](ctx, canvas.width, canvas.height);
  const url = canvas.toDataURL("image/jpeg", 0.86);
  cache.set(scene, url);
  return url;
}

export type DemoScene = "sunset" | "sky" | "blush" | "night" | "meadow" | "studio";

const scenes: Record<DemoScene, (ctx: CanvasRenderingContext2D, width: number, height: number) => void> = {
  sunset(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#FF8FAB");
    sky.addColorStop(0.45, "#FFD0A8");
    sky.addColorStop(1, "#FFE66D");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#FFF4C8";
    ctx.beginPath();
    ctx.arc(width * 0.72, height * 0.42, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#F08A6A";
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 1.05, width * 0.7, 180, 0, 0, Math.PI * 2);
    ctx.fill();
  },
  sky(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#8EC5FF");
    sky.addColorStop(1, "#EAF5FF");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#FFFFFF";
    blob(ctx, 180, 170, 70);
    blob(ctx, 430, 250, 90);
    blob(ctx, 640, 160, 60);
  },
  blush(ctx, width, height) {
    const wash = ctx.createLinearGradient(0, 0, width, height);
    wash.addColorStop(0, "#FFD0DE");
    wash.addColorStop(1, "#E7D6F8");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#FF6B8A";
    heart(ctx, width * 0.5, height * 0.48, 90);
  },
  night(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#241B45");
    sky.addColorStop(1, "#5C4A8A");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#FFE66D";
    for (const [x, y, r] of [
      [120, 90, 8],
      [250, 180, 5],
      [420, 80, 7],
      [560, 210, 4],
      [680, 120, 9],
      [180, 320, 4],
      [500, 360, 6],
    ] as const) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  meadow(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#C9E8FF");
    sky.addColorStop(0.55, "#E7F8D8");
    sky.addColorStop(1, "#7DCFAB");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#F2C14E";
    ctx.beginPath();
    ctx.arc(width * 0.3, height * 0.62, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    for (let petal = 0; petal < 6; petal += 1) {
      const angle = (petal * Math.PI) / 3;
      ctx.beginPath();
      ctx.ellipse(
        width * 0.3 + Math.cos(angle) * 34,
        height * 0.62 + Math.sin(angle) * 34,
        16,
        10,
        angle,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  },
  studio(ctx, width, height) {
    const wash = ctx.createLinearGradient(0, 0, 0, height);
    wash.addColorStop(0, "#FFF3B0");
    wash.addColorStop(1, "#FFC2D1");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#40354B";
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.42, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFE66D";
    ctx.beginPath();
    ctx.arc(width * 0.5 - 24, height * 0.38, 8, 0, Math.PI * 2);
    ctx.arc(width * 0.5 + 24, height * 0.38, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFE66D";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.46, 28, 0.2, Math.PI - 0.2);
    ctx.stroke();
  },
};

function blob(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.beginPath();
  ctx.arc(x - size * 0.4, y, size * 0.45, 0, Math.PI * 2);
  ctx.arc(x, y - size * 0.2, size * 0.55, 0, Math.PI * 2);
  ctx.arc(x + size * 0.45, y, size * 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.7);
  ctx.bezierCurveTo(x - size * 1.3, y - size * 0.1, x - size * 0.5, y - size, x, y - size * 0.25);
  ctx.bezierCurveTo(x + size * 0.5, y - size, x + size * 1.3, y - size * 0.1, x, y + size * 0.7);
  ctx.fill();
}
