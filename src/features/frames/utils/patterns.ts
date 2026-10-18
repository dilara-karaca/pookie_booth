import type { FrameDesign, PatternId } from "../types";

export const PATTERN_IDS: PatternId[] = [
  "solid",
  "hearts",
  "bows",
  "love",
  "strawberry",
  "cherry",
  "daisy",
  "flowers",
  "clouds",
  "gingham",
  "stripes",
  "checkers",
  "stars",
  "disco",
  "groovy",
  "shapes",
  "y2k-hearts",
  "birthday",
  "valentine",
  "christmas",
  "newyear",
];

const patternSet = new Set<string>(PATTERN_IDS);

export function isPatternId(value: string): value is PatternId {
  return patternSet.has(value);
}

export function paintPattern(
  ctx: CanvasRenderingContext2D,
  design: FrameDesign,
  width: number,
  height: number,
  scale: number,
): void {
  if (design.patternId === "solid") return;

  ctx.save();
  const colors = design.patternColors;
  const paint = patternPainters[design.patternId];
  paint(ctx, width, height, scale, colors);
  ctx.restore();
}

type Painter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  colors: string[],
) => void;

const patternPainters: Record<Exclude<PatternId, "solid">, Painter> = {
  hearts: (ctx, width, height, scale, colors) => {
    tile(width, height, 54 * scale, 48 * scale, (x, y, column, row) => {
      ctx.fillStyle = colors[(column + row) % colors.length] ?? colors[0];
      ctx.globalAlpha = 0.9;
      traceHeart(ctx, x, y, 9 * scale);
      ctx.fill();
    });
  },
  bows: (ctx, width, height, scale, colors) => {
    tile(width, height, 78 * scale, 70 * scale, (x, y, column, row) => {
      drawBow(ctx, x, y, 16 * scale, colors[(column + row) % colors.length] ?? colors[0]);
    });
  },
  love: (ctx, width, height, scale, colors) => {
    tile(width, height, 58 * scale, 52 * scale, (x, y, column, row) => {
      if ((column + row) % 2 === 0) {
        ctx.fillStyle = colors[0];
        traceHeart(ctx, x, y, 8 * scale);
        ctx.fill();
      } else {
        ctx.strokeStyle = colors[1] ?? colors[0];
        ctx.lineWidth = 1.5 * scale;
        ctx.beginPath();
        ctx.arc(x, y, 6 * scale, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  },
  strawberry: (ctx, width, height, scale) => {
    tile(width, height, 70 * scale, 64 * scale, (x, y) => {
      drawStrawberry(ctx, x, y, 16 * scale);
    });
  },
  cherry: (ctx, width, height, scale) => {
    tile(width, height, 76 * scale, 70 * scale, (x, y) => {
      drawCherry(ctx, x, y, 16 * scale);
    });
  },
  daisy: (ctx, width, height, scale, colors) => {
    tile(width, height, 68 * scale, 62 * scale, (x, y) => {
      drawFlower(ctx, x, y, 12 * scale, colors[0] ?? "#fff", colors[1] ?? "#F2C14E");
    });
  },
  flowers: (ctx, width, height, scale, colors) => {
    tile(width, height, 52 * scale, 48 * scale, (x, y, column, row) => {
      const petal = colors[(column + row) % colors.length] ?? colors[0];
      drawFlower(ctx, x, y, 9 * scale, petal, "#FFF9F0");
    });
  },
  clouds: (ctx, width, height, scale, colors) => {
    tile(width, height, 86 * scale, 64 * scale, (x, y, column) => {
      drawCloud(ctx, x, y, 18 * scale, colors[column % colors.length] ?? "#fff");
    });
  },
  gingham: (ctx, width, height, scale, colors) => {
    const size = 22 * scale;
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = colors[0];
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        const column = Math.floor(x / size);
        const row = Math.floor(y / size);
        if ((column + row) % 2 === 0) ctx.fillRect(x, y, size + 0.5, size + 0.5);
      }
    }
    ctx.restore();
  },
  stripes: (ctx, width, height, scale, colors) => {
    const band = 16 * scale;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-0.45);
    const span = Math.hypot(width, height);
    for (let index = 0, y = -span; y < span; y += band, index += 1) {
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = colors[index % colors.length] ?? colors[0];
      ctx.fillRect(-span, y, span * 2, band);
    }
    ctx.restore();
  },
  checkers: (ctx, width, height, scale, colors) => {
    const size = 28 * scale;
    ctx.save();
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        const column = Math.floor(x / size);
        const row = Math.floor(y / size);
        if ((column + row) % 2 === 0) {
          ctx.globalAlpha = 0.88;
          ctx.fillStyle = colors[(column + row) % colors.length] ?? colors[0];
          ctx.fillRect(x, y, size + 0.5, size + 0.5);
        }
      }
    }
    ctx.restore();
  },
  stars: (ctx, width, height, scale, colors) => {
    tile(width, height, 56 * scale, 52 * scale, (x, y, column, row) => {
      ctx.fillStyle = colors[(column + row) % colors.length] ?? colors[0];
      traceStar(ctx, x, y, (column + row) % 2 === 0 ? 9 * scale : 5 * scale);
      ctx.fill();
    });
  },
  disco: (ctx, width, height, scale, colors) => {
    tile(width, height, 48 * scale, 48 * scale, (x, y, column, row) => {
      ctx.fillStyle = colors[(column + row) % colors.length] ?? colors[0];
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(x, y, (column + row) % 3 === 0 ? 8 * scale : 4 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(x - 2 * scale, y - 2 * scale, 1.4 * scale, 0, Math.PI * 2);
      ctx.fill();
    });
  },
  groovy: (ctx, width, height, scale, colors) => {
    tile(width, height, 64 * scale, 60 * scale, (x, y, column, row) => {
      drawFlower(
        ctx,
        x,
        y,
        13 * scale,
        colors[(column + row) % colors.length] ?? colors[0],
        colors[(column + 1) % colors.length] ?? "#FFE66D",
      );
    });
  },
  shapes: (ctx, width, height, scale, colors) => {
    tile(width, height, 50 * scale, 50 * scale, (x, y, column, row) => {
      ctx.fillStyle = colors[(column + row) % colors.length] ?? colors[0];
      const kind = (column + row * 2) % 4;
      ctx.beginPath();
      if (kind === 0) {
        ctx.arc(x, y, 7 * scale, 0, Math.PI * 2);
      } else if (kind === 1) {
        ctx.moveTo(x, y - 8 * scale);
        ctx.lineTo(x + 7 * scale, y + 6 * scale);
        ctx.lineTo(x - 7 * scale, y + 6 * scale);
        ctx.closePath();
      } else if (kind === 2) {
        roundRect(ctx, x - 6 * scale, y - 6 * scale, 12 * scale, 12 * scale, 3 * scale);
      } else {
        traceStar(ctx, x, y, 7 * scale, 4);
      }
      ctx.fill();
    });
  },
  "y2k-hearts": (ctx, width, height, scale, colors) => {
    tile(width, height, 58 * scale, 52 * scale, (x, y, column, row) => {
      if ((column + row) % 3 === 0) {
        ctx.fillStyle = colors[2] ?? colors[0];
        traceStar(ctx, x, y, 5 * scale, 4);
        ctx.fill();
        return;
      }
      ctx.fillStyle = colors[(column + row) % 2] ?? colors[0];
      traceHeart(ctx, x, y, 8 * scale);
      ctx.fill();
      ctx.strokeStyle = colors[1] ?? "#fff";
      ctx.lineWidth = 1.2 * scale;
      traceHeart(ctx, x, y - 1.5 * scale, 5 * scale);
      ctx.stroke();
    });
  },
  birthday: (ctx, width, height, scale, colors) => {
    tile(width, height, 46 * scale, 46 * scale, (x, y, column, row) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(((column * 3 + row) % 5) * 0.35);
      ctx.fillStyle = colors[(column + row) % colors.length] ?? colors[0];
      ctx.fillRect(-7 * scale, -2.5 * scale, 14 * scale, 5 * scale);
      ctx.restore();
      if ((column + row) % 4 === 0) {
        drawBalloon(ctx, x, y + 8 * scale, 8 * scale, colors[(column + 1) % colors.length] ?? colors[0]);
      }
    });
  },
  valentine: (ctx, width, height, scale, colors) => {
    tile(width, height, 50 * scale, 46 * scale, (x, y, column, row) => {
      ctx.fillStyle = colors[(column + row) % colors.length] ?? colors[0];
      traceHeart(ctx, x, y, (column + row) % 2 === 0 ? 9 * scale : 5 * scale);
      ctx.fill();
    });
  },
  christmas: (ctx, width, height, scale, colors) => {
    tile(width, height, 72 * scale, 78 * scale, (x, y, column, row) => {
      if ((column + row) % 2 === 0) {
        drawTree(ctx, x, y, 14 * scale);
      } else {
        drawSnowflake(ctx, x, y, 10 * scale, colors[0] ?? "#fff");
      }
      if ((column + row) % 3 === 0) {
        ctx.fillStyle = colors[1] ?? "#E23D4A";
        ctx.beginPath();
        ctx.arc(x + 12 * scale, y - 10 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  },
  newyear: (ctx, width, height, scale, colors) => {
    tile(width, height, 54 * scale, 50 * scale, (x, y, column, row) => {
      ctx.strokeStyle = colors[column % colors.length] ?? colors[0];
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 1.4 * scale;
      if ((column + row) % 2 === 0) {
        traceStar(ctx, x, y, 8 * scale);
        ctx.fill();
      } else {
        ctx.beginPath();
        for (let arm = 0; arm < 8; arm += 1) {
          const angle = (arm * Math.PI) / 4;
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * 9 * scale, y + Math.sin(angle) * 9 * scale);
        }
        ctx.stroke();
      }
    });
  },
};

function tile(
  width: number,
  height: number,
  stepX: number,
  stepY: number,
  draw: (x: number, y: number, column: number, row: number) => void,
): void {
  let row = 0;
  for (let y = stepY * 0.45; y < height + stepY; y += stepY) {
    const stagger = row % 2 === 0 ? 0 : stepX * 0.5;
    let column = 0;
    for (let x = stepX * 0.3 + stagger; x < width + stepX; x += stepX) {
      draw(x, y, column, row);
      column += 1;
    }
    row += 1;
  }
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function traceHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const top = y - size * 0.35;
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.55);
  ctx.bezierCurveTo(x - size * 1.05, y - size * 0.1, x - size * 0.45, y - size, x, top);
  ctx.bezierCurveTo(x + size * 0.45, y - size, x + size * 1.05, y - size * 0.1, x, y + size * 0.55);
  ctx.closePath();
}

function traceStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  points = 5,
): void {
  ctx.beginPath();
  for (let index = 0; index < points * 2; index += 1) {
    const arm = index % 2 === 0 ? radius : radius * 0.42;
    const angle = -Math.PI / 2 + (index * Math.PI) / points;
    const px = x + Math.cos(angle) * arm;
    const py = y + Math.sin(angle) * arm;
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawFlower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  petal: string,
  center: string,
): void {
  ctx.fillStyle = petal;
  for (let index = 0; index < 6; index += 1) {
    const angle = (index * Math.PI) / 3;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * radius * 0.55,
      y + Math.sin(angle) * radius * 0.55,
      radius * 0.38,
      radius * 0.22,
      angle,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

function drawBow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x - size * 0.55, y, size * 0.48, size * 0.32, -0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + size * 0.55, y, size * 0.48, size * 0.32, 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - size * 0.08, y + size * 0.05);
  ctx.lineTo(x - size * 0.42, y + size * 0.85);
  ctx.lineTo(x, y + size * 0.42);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + size * 0.08, y + size * 0.05);
  ctx.lineTo(x + size * 0.42, y + size * 0.85);
  ctx.lineTo(x, y + size * 0.42);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, size * 0.16, 0, Math.PI * 2);
  ctx.fill();
}

function drawStrawberry(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.fillStyle = "#E23B4A";
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.12, size * 0.42, size * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3E8F4A";
  ctx.beginPath();
  ctx.ellipse(x, y - size * 0.38, size * 0.26, size * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFE9A0";
  for (const [dx, dy] of [
    [-0.12, 0.02],
    [0.12, 0.08],
    [0, 0.26],
    [-0.14, 0.24],
  ] as const) {
    ctx.beginPath();
    ctx.arc(x + dx * size, y + dy * size, size * 0.045, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCherry(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.strokeStyle = "#3E8F4A";
  ctx.lineWidth = Math.max(1, size * 0.08);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - size * 0.28, y + size * 0.02);
  ctx.quadraticCurveTo(x - size * 0.05, y - size * 0.7, x, y - size * 0.9);
  ctx.moveTo(x + size * 0.28, y + size * 0.02);
  ctx.quadraticCurveTo(x + size * 0.05, y - size * 0.7, x, y - size * 0.9);
  ctx.stroke();
  ctx.fillStyle = "#D63A45";
  ctx.beginPath();
  ctx.arc(x - size * 0.28, y + size * 0.1, size * 0.26, 0, Math.PI * 2);
  ctx.arc(x + size * 0.28, y + size * 0.1, size * 0.26, 0, Math.PI * 2);
  ctx.fill();
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.arc(x - size * 0.32, y + size * 0.05, size * 0.26, 0, Math.PI * 2);
  ctx.arc(x, y - size * 0.12, size * 0.34, 0, Math.PI * 2);
  ctx.arc(x + size * 0.34, y + size * 0.06, size * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - size * 0.38, y + size * 0.02, size * 0.84, size * 0.26);
  ctx.globalAlpha = 1;
}

function drawSnowflake(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.1);
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let index = 0; index < 6; index += 1) {
    const angle = (index * Math.PI) / 3;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
  }
  ctx.stroke();
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.fillStyle = "#2F6B45";
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.5, y);
  ctx.lineTo(x - size * 0.5, y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.35);
  ctx.lineTo(x + size * 0.68, y + size * 0.55);
  ctx.lineTo(x - size * 0.68, y + size * 0.55);
  ctx.fill();
  ctx.fillStyle = "#F4D35E";
  ctx.fillRect(x - size * 0.08, y + size * 0.55, size * 0.16, size * 0.28);
}

function drawBalloon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.08);
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.35);
  ctx.lineTo(x, y + size);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.28, size * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();
}
