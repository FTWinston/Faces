const enum Dimension {
    Sensitivity, // Anger is positive, Fear is negative
    Attention, // Anticipation is positive, Surprise is negative
    Pleasantness, // Joy is positive, Sadness is negative
    Aptitude, // Trust is positive, Disgust is negative
}

const enum Emotion {
    Joy = 1, // positive Pleasantness
    Trust = 2, // positive Aptitude
    Fear = 3 , // negative Sensitivity
    Surprise = 4, // negative Attention
    Sadness = 5, // negative Pleasantness
    Disgust = 6, // negative Aptitude
    Anger = 7, // positive Sensitivity
    Anticipation = 8, // positive Attention
}

// Numerically describing a single position on Plutchik's wheel of emotions:
// https://en.wikipedia.org/wiki/Contrasting_and_categorization_of_emotions#Plutchik.27s_wheel_of_emotions
// Treating it as a point in 4 dimensions, somewhat like the "hourglass of emotions" model.

export class EmotionalState {
    constructor(public sensitivity: number, public attention: number, public pleasantness: number, public aptitude: number) {}

    public describe() {
        const emotions = this.sortEmotionsBySignificance();

        const primaryEmotion = emotions[0][0];
        const secondaryEmotion = emotions[1][0];
        const primaryValue = emotions[0][1];
        const secondaryValue = emotions[1][1];

        const descriptionCutoff = 0.02;
        const complexScaleCutoff = 0.35;

        if (primaryValue > -descriptionCutoff && primaryValue < descriptionCutoff) {
            return 'nothing';
        }

        if (secondaryValue / primaryValue < complexScaleCutoff) {
            return EmotionalState.describeSimpleState(primaryEmotion, primaryValue);
        }

        return EmotionalState.describeCombinedState(primaryEmotion, secondaryEmotion, Math.max(primaryValue, secondaryValue));
    }

    private sortEmotionsBySignificance() {
        let emotions: [Emotion, number][] = [
            [this.sensitivity >= 0 ? Emotion.Anger : Emotion.Fear, Math.abs(this.sensitivity)],
            [this.attention >= 0 ? Emotion.Anticipation : Emotion.Surprise, Math.abs(this.attention)],
            [this.pleasantness >= 0 ? Emotion.Joy : Emotion.Sadness, Math.abs(this.pleasantness)],
            [this.aptitude >= 0 ? Emotion.Trust : Emotion.Disgust, Math.abs(this.aptitude)],
        ];

        emotions.sort((em1, em2) => em1[1] > em2[1] ? 1 : -1);

        return emotions;
    }

    private static describeSimpleState(emotion: Emotion, intensity: number) {
        switch (emotion) {
            case Emotion.Joy:
                return EmotionalState.describeByIntensity(intensity, 'serenity', 'joy', 'ecstasy');
            case Emotion.Trust:
                return EmotionalState.describeByIntensity(intensity, 'acceptance', 'trust', 'admiration');
            case Emotion.Fear:
                return EmotionalState.describeByIntensity(intensity, 'apprehension', 'fear', 'terror');
            case Emotion.Surprise:
                return EmotionalState.describeByIntensity(intensity, 'distraction', 'surprise', 'amazement');
            case Emotion.Sadness:
                return EmotionalState.describeByIntensity(intensity, 'pensiveness', 'sadness', 'grief');
            case Emotion.Disgust:
                return EmotionalState.describeByIntensity(intensity, 'boredom', 'disgust', 'loathing');
            case Emotion.Anger:
                return EmotionalState.describeByIntensity(intensity, 'annoyance', 'anger', 'rage');
            case Emotion.Anticipation:
                return EmotionalState.describeByIntensity(intensity, 'interest', 'anticipation', 'vigilance');
            default:
                return 'unknown';
        }
    }

    private static describeCombinedState(em1: Emotion, em2: Emotion, intensity: number) {
        if (em1 > em2) {
            let tmp = em1;
            em1 = em2;
            em2 = tmp;
        }

        switch (em1) {
            case Emotion.Joy:
                switch (em2) {
                    case Emotion.Trust:
                        return EmotionalState.describeByIntensity(intensity, 'acknowledgement', 'love', 'devotion');
                    case Emotion.Fear:
                        return EmotionalState.getIntensityPrefix(intensity) + 'guilt';
                    case Emotion.Surprise:
                        return EmotionalState.getIntensityPrefix(intensity) + 'delight'; // or frivolity
                    case Emotion.Disgust:
                        return EmotionalState.getIntensityPrefix(intensity) + 'morbidness'; // or gloat
                    case Emotion.Anger:
                        return EmotionalState.getIntensityPrefix(intensity) + 'pride';
                    case Emotion.Anticipation:
                        return EmotionalState.describeByIntensity(intensity, 'bemusement', 'optimism', 'zeal');
                }
                break;

            case Emotion.Trust:
                switch (em2) {
                    case Emotion.Fear:
                        return EmotionalState.describeByIntensity(intensity, 'acquiescence', 'submission', 'subservience');
                    case Emotion.Surprise:
                        return EmotionalState.getIntensityPrefix(intensity) + 'curiosity';
                    case Emotion.Sadness:
                        return EmotionalState.getIntensityPrefix(intensity) + 'sentimentality';
                    case Emotion.Disgust:
                        return EmotionalState.getIntensityPrefix(intensity) + 'morbidness';
                    case Emotion.Anger:
                        return EmotionalState.getIntensityPrefix(intensity) + 'pride'; // or rivalry
                    case Emotion.Anticipation:
                        return EmotionalState.getIntensityPrefix(intensity) + 'hope';
                }
                break;
                
            case Emotion.Fear:
                switch (em2) {
                    case Emotion.Surprise:
                        return EmotionalState.describeByIntensity(intensity, 'wariness', 'awe', 'petrification');
                    case Emotion.Sadness:
                        return EmotionalState.getIntensityPrefix(intensity) + 'despair';
                    case Emotion.Disgust:
                        return EmotionalState.getIntensityPrefix(intensity) + 'shame'; // or coercion
                    case Emotion.Anticipation:
                        return EmotionalState.getIntensityPrefix(intensity) + 'anxiety';
                }
                break;
            
            case Emotion.Surprise:
                switch (em2) {
                    case Emotion.Sadness:
                        return EmotionalState.describeByIntensity(intensity, 'dismay', 'disapproval', 'horror');
                    case Emotion.Disgust:
                        return EmotionalState.getIntensityPrefix(intensity) + 'unbelief';
                    case Emotion.Anger:
                        return EmotionalState.getIntensityPrefix(intensity) + 'outrage'; // or rejection
                }
                break;
                
            case Emotion.Sadness:
                switch (em2) {
                    case Emotion.Disgust:
                        return EmotionalState.describeByIntensity(intensity, 'listlessness',  'remorse', 'shame');
                    case Emotion.Anger:
                        return EmotionalState.getIntensityPrefix(intensity) + 'envy';
                    case Emotion.Anticipation:
                        return EmotionalState.getIntensityPrefix(intensity) + 'pessimism'; // or frustration
                }
                break;
            
            case Emotion.Disgust:
                switch (em2) {
                    case Emotion.Anger:
                        return EmotionalState.describeByIntensity(intensity, 'impatience', 'contempt', 'hatred');
                    case Emotion.Anticipation:
                        return EmotionalState.getIntensityPrefix(intensity) + 'cynisism';
                }
                break;
                
            case Emotion.Anger:
                switch (em2) {
                    case Emotion.Anticipation:
                        return EmotionalState.describeByIntensity(intensity, 'disfavor', 'aggressiveness', 'domination');
                }
                break;
        }
        
        return 'unknown combination';
    }

    private static describeByIntensity(intensity: number, weakName: string, midName: string, strongName: string) {
        if (intensity <= 0.1111) {
            return 'slight ' + weakName;
        }
        else if (intensity <= 0.2222) {
            return weakName;
        }
        else if (intensity <= 0.3333) {
            return 'significant ' + weakName;
        }
        else if (intensity <= 0.4444) {
            return 'moderate ' + midName;
        }
        else if (intensity <= 0.5555) {
            return midName;
        }
        else if (intensity <= 0.6666) {
            return 'significant ' + midName;
        }
        else if (intensity <= 0.7777) {
            return strongName;
        }
        else if (intensity <= 0.8888) {
            return 'intense ' + strongName;
        }
        else {
            return 'complete ' + strongName;
        }
    }
    
    private static getIntensityPrefix(intensity: number) {
        if (intensity < 0.15) {
            return 'slight ';
        }
        else if (intensity < 0.35) {
            return 'mild ';
        }
        else if (intensity < 0.70) {
            return '';
        }
        else if (intensity < 0.85) {
            return 'strong ';
        }
        else {
            return 'intense ';
        }
    }
}