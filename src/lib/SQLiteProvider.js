import { entries, details } from '../stores/diaryStore';

export class SqLiteProvider { 
    entries = {
        loadEntries: async () => {
            const res = await fetch("/api/entries");
            const json = await res.json();
            entries.set(json);
        }
    }

    details = {
        loadDetails: async (entry_id) => {
            const res = await fetch(`/api/details?entry_id=${entry_id}`);
            const json = await res.json();
            details.set(json);
        }
    }
}