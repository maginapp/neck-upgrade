(() => {
  const GET_STATUS_MESSAGE = 'popup:get-page-wobble-status';
  const SET_CONFIG_MESSAGE = 'popup:set-page-wobble-config';
  const TRANSITION = 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1)';

  interface WobbleConfig {
    angle: number;
    cycleSeconds: number;
    randomAngle: boolean;
  }

  interface WobbleStatus extends WobbleConfig {
    enabled: boolean;
    nextChangeAt: number | null;
  }

  interface WobbleController {
    getStatus: () => WobbleStatus;
    update: (enabled: boolean, config: WobbleConfig) => WobbleStatus;
  }

  interface ContentScriptHost {
    __neckUpgradePageWobble__?: WobbleController;
  }

  type StyleProperty = 'transform' | 'transform-origin' | 'transition' | 'will-change';

  const host = globalThis as typeof globalThis & ContentScriptHost;

  if (!host.__neckUpgradePageWobble__) {
    const page = document.documentElement;
    const styleProperties: StyleProperty[] = [
      'transform',
      'transform-origin',
      'transition',
      'will-change',
    ];
    const originalStyles = new Map(
      styleProperties.map((property) => [
        property,
        {
          value: page.style.getPropertyValue(property),
          priority: page.style.getPropertyPriority(property),
        },
      ])
    );
    const computedTransform = getComputedStyle(page).transform;
    const baseTransform = computedTransform === 'none' ? '' : computedTransform;

    let enabled = false;
    let angle = 15;
    let cycleSeconds = 60;
    let randomAngle = false;
    let direction = 1;
    let currentRotation = 0;
    let nextChangeAt: number | null = null;
    let timer: number | undefined;

    const normalizeConfig = (config?: Partial<WobbleConfig>): WobbleConfig => ({
      angle: Math.min(180, Math.max(0, Math.round(Number(config?.angle) || 0))),
      cycleSeconds: Math.min(3600, Math.max(1, Math.round(Number(config?.cycleSeconds) || 60))),
      randomAngle: config?.randomAngle === true,
    });

    const getStatus = (): WobbleStatus => ({
      enabled,
      angle,
      cycleSeconds,
      randomAngle,
      nextChangeAt,
    });

    const getRandomRotation = () => {
      if (angle === 0) {
        return 0;
      }

      const minimumDifference = Math.max(1, Math.round(angle * 0.2));
      let candidate = currentRotation;
      for (let attempt = 0; attempt < 8; attempt++) {
        candidate = Math.round(Math.random() * angle * 2 - angle);
        if (Math.abs(candidate - currentRotation) >= minimumDifference) {
          break;
        }
      }
      return candidate;
    };

    const applyAngle = (advanceDirection = false) => {
      if (randomAngle) {
        currentRotation = getRandomRotation();
      } else {
        if (advanceDirection) {
          direction *= -1;
        }
        currentRotation = direction * angle;
      }

      const rotate = `rotate(${currentRotation}deg)`;
      page.style.setProperty(
        'transform',
        [baseTransform, rotate].filter(Boolean).join(' '),
        'important'
      );
    };

    const stopTimer = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
      nextChangeAt = null;
    };

    const scheduleNextChange = () => {
      stopTimer();
      if (!enabled) {
        return;
      }

      nextChangeAt = Date.now() + cycleSeconds * 1000;
      timer = window.setTimeout(() => {
        applyAngle(true);
        scheduleNextChange();
      }, cycleSeconds * 1000);
    };

    const restorePageStyles = () => {
      styleProperties.forEach((property) => {
        const original = originalStyles.get(property);
        if (original?.value) {
          page.style.setProperty(property, original.value, original.priority);
        } else {
          page.style.removeProperty(property);
        }
      });
    };

    const update = (nextEnabled: boolean, config: WobbleConfig) => {
      const normalizedConfig = normalizeConfig(config);
      const wasEnabled = enabled;
      const cycleChanged = cycleSeconds !== normalizedConfig.cycleSeconds;
      angle = normalizedConfig.angle;
      cycleSeconds = normalizedConfig.cycleSeconds;
      randomAngle = normalizedConfig.randomAngle;
      enabled = nextEnabled;

      if (!enabled) {
        stopTimer();
        direction = 1;
        currentRotation = 0;
        restorePageStyles();
        return getStatus();
      }

      page.style.setProperty('transform-origin', '50% 50%', 'important');
      page.style.setProperty('transition', TRANSITION, 'important');
      page.style.setProperty('will-change', 'transform', 'important');
      applyAngle();

      if (!wasEnabled || cycleChanged || timer === undefined) {
        scheduleNextChange();
      }
      return getStatus();
    };

    const controller: WobbleController = { getStatus, update };
    host.__neckUpgradePageWobble__ = controller;

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.type === GET_STATUS_MESSAGE) {
        sendResponse(controller.getStatus());
      }
      if (message?.type === SET_CONFIG_MESSAGE) {
        sendResponse(controller.update(Boolean(message.enabled), message.config));
      }
      return false;
    });
  }
})();
