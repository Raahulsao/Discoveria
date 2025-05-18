declare module 'canvas-confetti' {
  interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: ('square' | 'circle')[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  interface GlobalOptions extends Options {
    resize?: boolean;
    useWorker?: boolean;
  }

  interface CreateTypes {
    (options?: Options): Promise<null>;
    reset: () => void;
  }

  interface Module {
    (options?: Options): Promise<null>;
    create: (canvas: HTMLCanvasElement, options?: GlobalOptions) => CreateTypes;
    reset: () => void;
  }

  const confetti: Module;
  export = confetti;
}
