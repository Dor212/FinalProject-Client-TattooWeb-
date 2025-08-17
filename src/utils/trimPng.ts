export async function trimTransparentPNG(src: string, alphaThreshold = 1): Promise<string> {
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.crossOrigin = "anonymous";
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = (e) => rej(e);
    img.src = src;
  });

  const w = img.naturalWidth, h = img.naturalHeight;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  if (!ctx || !w || !h) return src;
  c.width = w; c.height = h;
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, w, h);

  let top = 0, left = 0, right = w - 1, bottom = h - 1, found = false;
  for (let y = 0; y < h && !found; y++) for (let x = 0; x < w; x++) if (data[(y*w+x)*4+3] >= alphaThreshold) { top=y; found=true; break; }
  found = false;
  for (let y = h-1; y >= 0 && !found; y--) for (let x = 0; x < w; x++) if (data[(y*w+x)*4+3] >= alphaThreshold) { bottom=y; found=true; break; }
  found = false;
  for (let x = 0; x < w && !found; x++) for (let y = top; y <= bottom; y++) if (data[(y*w+x)*4+3] >= alphaThreshold) { left=x; found=true; break; }
  found = false;
  for (let x = w-1; x >= 0 && !found; x--) for (let y = top; y <= bottom; y++) if (data[(y*w+x)*4+3] >= alphaThreshold) { right=x; found=true; break; }

  const newW = Math.max(1, right - left + 1);
  const newH = Math.max(1, bottom - top + 1);
  if (newW <= 0 || newH <= 0) return src;

  const out = document.createElement("canvas");
  out.width = newW; out.height = newH;
  const octx = out.getContext("2d");
  if (!octx) return src;
  octx.drawImage(img, left, top, newW, newH, 0, 0, newW, newH);
  return out.toDataURL("image/png");
}