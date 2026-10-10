import { analyzeDistressSignal } from './aiDetectionService';

export class VoiceRecognitionService {
  private recognition: any | null = null;
  private onThreatDetected: (threatType: string) => void;
  private language: string;
  private debounceTimer: number | null = null;
  private lastAnalyzedTranscript: string = '';

  constructor(onThreatDetected: (threatType: string) => void, language: string = 'en-US') {
    this.onThreatDetected = onThreatDetected;
    this.language = language;
    
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.language;

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const fullTranscript = (finalTranscript + interimTranscript).trim().toLowerCase();
        console.log('Voice Transcript:', fullTranscript);

        // Only analyze if transcript is substantive and changed
        if (fullTranscript.length > 10 && fullTranscript !== this.lastAnalyzedTranscript) {
          if (this.debounceTimer) {
            window.clearTimeout(this.debounceTimer);
          }
          this.debounceTimer = window.setTimeout(() => {
            this.lastAnalyzedTranscript = fullTranscript;
            this.analyzeWithGemini(fullTranscript);
          }, 1500); // 1.5 seconds debounce
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
      };

      this.recognition.onend = () => {
        // Restart if it was supposed to be active
        if (this.isActive) {
          this.recognition.start();
        }
      };
    }
  }

  private async analyzeWithGemini(transcript: string) {
    try {
      const result = await analyzeDistressSignal(transcript);
      if (result.isThreat && result.confidence > 0.6) {
        console.log(`Gemini detected threat: ${result.threatType} (Confidence: ${result.confidence})`);
        this.onThreatDetected(result.threatType);
        this.stop(); // Stop to prevent multiple triggers
      }
    } catch (e) {
      console.error('Gemini analysis failed', e);
    }
  }

  private isActive: boolean = false;

  start(): void {
    if (this.recognition && !this.isActive) {
      this.isActive = true;
      try {
        this.recognition.start();
        console.log(`Voice SOS Monitoring Started (${this.language})`);
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  }

  stop(): void {
    if (this.recognition && this.isActive) {
      this.isActive = false;
      this.recognition.stop();
      if (this.debounceTimer) {
        window.clearTimeout(this.debounceTimer);
      }
      console.log('Voice SOS Monitoring Stopped');
    }
  }
}
