interface Comment {
  text?: string;
  /**
   * @default rtl
   */
  mode?: 'ltr' | 'rtl' | 'top' | 'bottom';
  /**
   * Specified in seconds. Not required in live mode.
   * @default media?.currentTime
   */
  time?: number;
  style?: Partial<CSSStyleDeclaration> | CanvasRenderingContext2D;
  /**
   * A custom render to draw comment.
   * When it exist, `text` and `style` will be ignored.
   */
  render?(): HTMLElement | HTMLCanvasElement;
}

interface DanmakuOption {
  /**
   * The stage to display comments will be appended to container.
   */
  container: HTMLElement;
  /**
   * If it's not provided, Danmaku will be in live mode.
   */
  media?: HTMLMediaElement;
  /**
   * Preseted comments, used in media mode
   */
  comments?: Comment[];
  /**
   * Canvas engine may more efficient than DOM however it costs more memory.
   * @default dom
   */
  engine?: 'dom' | 'canvas';
  /**
   * The speed of comments in `ltr` and `rtl` mode.
   */
  speed?: number;
}

declare class Danmaku {
  constructor(option: DanmakuOption);
  /**
   * The speed of comments in `ltr` and `rtl` mode.
   */
  get speed(): number;
  set speed(s: number);
  /**
   * Destroy the instance and release memory.
   */
  destroy(): Danmaku;
  emit(comment: Comment): Danmaku;
  show(): Danmaku;
  hide(): Danmaku;
  /**
   * Clear current stage.
   */
  clear(): Danmaku;
  /**
   * Do it when you resize container.
   */
  resize(): Danmaku;
}

export default Danmaku;
