import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
const JournalContext = createContext(undefined);
export const JournalProvider = ({ children }) => {
    const [entries, setEntries] = useState([]);
    const { toast } = useToast();
    const addEntry = (entry) => {
        try {
            const newEntry = {
                ...entry,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
            };
            setEntries(prev => [newEntry, ...prev]);
            toast({
                title: "Entry saved successfully! 🎉",
                description: "Your journal entry has been added to your profile.",
            });
        }
        catch (error) {
            toast({
                title: "Failed to save entry",
                description: "Please try again. If the problem persists, check your connection.",
                variant: "destructive",
            });
        }
    };
    const deleteEntry = (id) => {
        try {
            setEntries(prev => prev.filter(entry => entry.id !== id));
            toast({
                title: "Entry deleted",
                description: "Your journal entry has been removed.",
            });
        }
        catch (error) {
            toast({
                title: "Failed to delete entry",
                description: "Please try again later.",
                variant: "destructive",
            });
        }
    };
    const updateEntry = (id, updates) => {
        try {
            setEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...updates } : entry));
            toast({
                title: "Entry updated",
                description: "Your changes have been saved successfully.",
            });
        }
        catch (error) {
            toast({
                title: "Failed to update entry",
                description: "Please try again later.",
                variant: "destructive",
            });
        }
    };
    return (<JournalContext.Provider value={{ entries, addEntry, deleteEntry, updateEntry }}>
      {children}
    </JournalContext.Provider>);
};
export const useJournal = () => {
    const context = useContext(JournalContext);
    if (context === undefined) {
        throw new Error('useJournal must be used within a JournalProvider');
    }
    return context;
};
