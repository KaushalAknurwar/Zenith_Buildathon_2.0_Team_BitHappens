import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Video, Square } from 'lucide-react';
const VideoRecorder = ({ onSaveVideo }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const { toast } = useToast();
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };
            mediaRecorder.onstop = () => {
                const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
                onSaveVideo(videoBlob);
            };
            mediaRecorder.start();
            setIsRecording(true);
            // Start timer
            timerRef.current = window.setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
            toast({
                title: "Recording Started",
                description: "Your video journal entry is now being recorded.",
            });
        }
        catch (error) {
            toast({
                title: "Error",
                description: "Could not access camera. Please check your permissions.",
                variant: "destructive",
            });
        }
    };
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            setIsRecording(false);
            setRecordingTime(0);
            toast({
                title: "Recording Complete",
                description: "Your video entry has been saved successfully.",
            });
        }
    };
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    return (<Card className="p-6 space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover"/>
        {isRecording && (<div className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded-full text-white text-sm font-medium animate-pulse">
            {formatTime(recordingTime)}
          </div>)}
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={isRecording ? stopRecording : startRecording} className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}>
          {isRecording ? (<>
              <Square className="w-4 h-4 mr-2"/>
              Stop Recording
            </>) : (<>
              <Video className="w-4 h-4 mr-2"/>
              Start Recording
            </>)}
        </Button>
      </div>
    </Card>);
};
export default VideoRecorder;
