export class RecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  async startRecording(type: 'audio' | 'video' = 'video'): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      });

      this.mediaRecorder = new MediaRecorder(stream);
      this.chunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: type === 'video' ? 'video/webm' : 'audio/webm' });
        const url = URL.createObjectURL(blob);
        console.log(`Recording saved: ${url}`);
        // In a real app, we would upload this to Firebase Storage
        
        // Stop all tracks to release camera/mic
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      console.log(`${type} recording started automatically`);
    } catch (error) {
      console.error("Recording failed:", error);
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      console.log("Recording stopped");
    }
  }
}

export const recordingService = new RecordingService();
