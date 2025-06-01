import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
const emotions = [
    { id: 'happy', label: 'Happy', icon: '😊' },
    { id: 'sad', label: 'Sad', icon: '😢' },
    { id: 'anxious', label: 'Anxious', icon: '😰' },
    { id: 'excited', label: 'Excited', icon: '🤩' },
    { id: 'calm', label: 'Calm', icon: '😌' },
    { id: 'frustrated', label: 'Frustrated', icon: '😤' },
];
const EmotionTagger = ({ selectedEmotions, onEmotionToggle }) => {
    return (<Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">How are you feeling?</h3>
      <div className="grid grid-cols-3 gap-2">
        {emotions.map((emotion) => (<Button key={emotion.id} variant={selectedEmotions.includes(emotion.id) ? "default" : "outline"} className="flex items-center space-x-2" onClick={() => onEmotionToggle(emotion.id)}>
            <span>{emotion.icon}</span>
            <span>{emotion.label}</span>
          </Button>))}
      </div>
    </Card>);
};
export default EmotionTagger;
