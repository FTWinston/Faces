import { EmotionalState } from './EmotionalState';

export abstract class FaceRenderer {
    public abstract draw(ctx: CanvasRenderingContext2D, width: number, height: number, emotion: EmotionalState): void;
}