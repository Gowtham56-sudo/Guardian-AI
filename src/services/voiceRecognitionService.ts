export class VoiceRecognitionService {
  private recognition: any | null = null;
  private onKeywordDetected: () => void;
  private keywords: string[] = ['help', 'sos', 'emergency', 'save me'];

  constructor(onKeywordDetected: () => void) {
    this.onKeywordDetected = onKeywordDetected;
    
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('')
          .toLowerCase();

        console.log('Voice Transcript:', transcript);

        if (this.keywords.some(keyword => transcript.includes(keyword))) {
          console.log('SOS Keyword Detected via Voice!');
          this.onKeywordDetected();
          this.stop(); // Stop to prevent multiple triggers in quick succession
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

  private isActive: boolean = false;

  start(): void {
    if (this.recognition && !this.isActive) {
      this.isActive = true;
      try {
        this.recognition.start();
        console.log('Voice SOS Monitoring Started');
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  }

  stop(): void {
    if (this.recognition && this.isActive) {
      this.isActive = false;
      this.recognition.stop();
      console.log('Voice SOS Monitoring Stopped');
    }
  }
}
