import { PageWobbleConfig } from '@/types/app';

export const PAGE_WOBBLE_STORAGE_KEY = 'page_wobble_config';

export const PAGE_WOBBLE_LIMITS = {
  angle: { min: 0, max: 180 },
  cycleSeconds: { min: 1, max: 3600 },
} as const;

const PAGE_WOBBLE_CYCLE_SEGMENTS = [
  { startSeconds: 1, endSeconds: 60, stepSeconds: 1 },
  { startSeconds: 60, endSeconds: 180, stepSeconds: 5 },
  { startSeconds: 180, endSeconds: 300, stepSeconds: 15 },
  { startSeconds: 300, endSeconds: 900, stepSeconds: 30 },
  { startSeconds: 900, endSeconds: 3600, stepSeconds: 60 },
] as const;

export const PAGE_WOBBLE_CYCLE_SLIDER_MAX = PAGE_WOBBLE_CYCLE_SEGMENTS.reduce(
  (total, segment) => total + (segment.endSeconds - segment.startSeconds) / segment.stepSeconds,
  0
);

export const DEFAULT_PAGE_WOBBLE_CONFIG: PageWobbleConfig = {
  angle: 15,
  cycleSeconds: 60,
  randomAngle: false,
};

const normalizeNumber = (value: unknown, min: number, max: number, fallback: number) => {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.round(parsedValue)));
};

export const getPageWobbleCycleSeconds = (sliderPosition: number) => {
  let remainingPosition = normalizeNumber(sliderPosition, 0, PAGE_WOBBLE_CYCLE_SLIDER_MAX, 0);

  for (const segment of PAGE_WOBBLE_CYCLE_SEGMENTS) {
    const segmentPositions = (segment.endSeconds - segment.startSeconds) / segment.stepSeconds;
    if (remainingPosition <= segmentPositions) {
      return segment.startSeconds + remainingPosition * segment.stepSeconds;
    }
    remainingPosition -= segmentPositions;
  }

  return PAGE_WOBBLE_LIMITS.cycleSeconds.max;
};

export const getPageWobbleCyclePosition = (seconds: number) => {
  const normalizedSeconds = normalizeNumber(
    seconds,
    PAGE_WOBBLE_LIMITS.cycleSeconds.min,
    PAGE_WOBBLE_LIMITS.cycleSeconds.max,
    DEFAULT_PAGE_WOBBLE_CONFIG.cycleSeconds
  );
  let left = 0;
  let right = PAGE_WOBBLE_CYCLE_SLIDER_MAX;

  while (left < right) {
    const middle = Math.floor((left + right) / 2);
    if (getPageWobbleCycleSeconds(middle) < normalizedSeconds) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }

  const previousPosition = Math.max(0, left - 1);
  return Math.abs(getPageWobbleCycleSeconds(previousPosition) - normalizedSeconds) <=
    Math.abs(getPageWobbleCycleSeconds(left) - normalizedSeconds)
    ? previousPosition
    : left;
};

export const normalizePageWobbleConfig = (value: unknown): PageWobbleConfig => {
  const config = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  // 兼容旧版按分钟保存的 cycleMinutes 字段。
  const storedCycleSeconds =
    config.cycleSeconds ??
    (Number.isFinite(Number(config.cycleMinutes)) ? Number(config.cycleMinutes) * 60 : undefined);
  const normalizedCycleSeconds = normalizeNumber(
    storedCycleSeconds,
    PAGE_WOBBLE_LIMITS.cycleSeconds.min,
    PAGE_WOBBLE_LIMITS.cycleSeconds.max,
    DEFAULT_PAGE_WOBBLE_CONFIG.cycleSeconds
  );

  return {
    angle: normalizeNumber(
      config.angle,
      PAGE_WOBBLE_LIMITS.angle.min,
      PAGE_WOBBLE_LIMITS.angle.max,
      DEFAULT_PAGE_WOBBLE_CONFIG.angle
    ),
    cycleSeconds: getPageWobbleCycleSeconds(getPageWobbleCyclePosition(normalizedCycleSeconds)),
    randomAngle: config.randomAngle === true,
  };
};

export const getPageWobbleRemainingSeconds = (
  nextChangeAt: number | null,
  cycleSeconds: number,
  now = Date.now()
) => {
  if (!nextChangeAt || cycleSeconds <= 0) {
    return null;
  }

  const cycleMilliseconds = cycleSeconds * 1000;
  const remainingMilliseconds = nextChangeAt - now;
  if (remainingMilliseconds > 0) {
    return Math.ceil(remainingMilliseconds / 1000);
  }

  const elapsedAfterChange = Math.abs(remainingMilliseconds) % cycleMilliseconds;
  return Math.ceil((cycleMilliseconds - elapsedAfterChange) / 1000);
};

export const isPageWobbleSupportedUrl = (url?: string) => {
  if (!url) {
    return false;
  }

  try {
    const protocol = new URL(url).protocol;
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};
