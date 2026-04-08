import { adminData } from '../utils/adminData';

export class RecordingService {
  private mediaRecorders: Partial<Record<'audio' | 'video', MediaRecorder>> = {};
  private chunks: Partial<Record<'audio' | 'video', Blob[]>> = {};
  private streams: Partial<Record<'audio' | 'video', MediaStream>> = {};

  isRecording(type: 'audio' | 'video'): boolean {
    const recorder = this.mediaRecorders[type];
    return !!recorder && recorder.state !== 'inactive';
  }

  async startRecording(type: 'audio' | 'video' = 'video'): Promise<void> {
    try {
      if (this.isRecording(type)) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      });

      const mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorders[type] = mediaRecorder;
      this.streams[type] = stream;
      this.chunks[type] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.chunks[type]?.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const kindChunks = this.chunks[type] ?? [];
        const blob = new Blob(kindChunks, { type: type === 'video' ? 'video/webm' : 'audio/webm' });
        const url = URL.createObjectURL(blob);
        adminData.addRecording(type, url, blob.type || (type === 'video' ? 'video/webm' : 'audio/webm'));
        console.log(`Recording saved: ${url}`);
        // In a real app, we would upload this to Firebase Storage
        
        // Stop all tracks to release camera/mic for this recording type.
        this.streams[type]?.getTracks().forEach(track => track.stop());
        delete this.streams[type];
        delete this.chunks[type];
        delete this.mediaRecorders[type];
      };

      mediaRecorder.start();
      console.log(`${type} recording started automatically`);
    } catch (error) {
      console.error("Recording failed:", error);
    }
  }

  stopRecording(type: 'audio' | 'video'): void {
    const recorder = this.mediaRecorders[type];
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      console.log(`${type} recording stopped`);
    }
  }

  stopAllRecordings(): void {
    this.stopRecording('audio');
    this.stopRecording('video');
  }
}

export const recordingService = new RecordingService();
