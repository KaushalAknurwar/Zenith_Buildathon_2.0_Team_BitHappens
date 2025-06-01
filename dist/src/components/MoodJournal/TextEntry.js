import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from 'lucide-react';
import { useJournal } from '@/contexts/JournalContext';
import { useToast } from '@/components/ui/use-toast';
const TextEntry = ({ textEntry, setTextEntry, handleSaveEntry }) => {
    const { addEntry } = useJournal();
    const { toast } = useToast();
    const handleSave = () => {
        if (!textEntry.trim())
            return;
        addEntry({
            type: 'text',
            content: textEntry,
            mood: '😌',
            title: 'Journal Entry',
            privacy: 'private'
        });
        setTextEntry('');
        handleSaveEntry();
    };
    return (<div className="w-full">
      <div className="space-y-4">
        <Textarea placeholder="How are you feeling today?" className="min-h-[200px] text-lg bg-zinc-900/90 text-white placeholder:text-gray-400 border-zinc-800" value={textEntry} onChange={(e) => setTextEntry(e.target.value)}/>
        <div className="flex justify-end gap-2">
          <Button onClick={handleSave} className="bg-duo-green hover:bg-duo-green/90">
            <Save className="w-4 h-4 mr-2"/>
            Save Entry
          </Button>
        </div>
      </div>
    </div>);
};
export default TextEntry;
