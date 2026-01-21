import { useState, useEffect, useRef } from 'react';
import { processesApi } from '../api/processesApi';
import type { ProcessListItem } from '../types';

export const useAvailableTribunals = (processes: ProcessListItem[]): string[] => {
    const [availableTribunals, setAvailableTribunals] = useState<string[]>([]);
    const tribunalsFetchedRef = useRef(false);

    useEffect(() => {
        const fetchAllTribunals = async () => {
            if (tribunalsFetchedRef.current) return;
            tribunalsFetchedRef.current = true;

            try {
                const response = await processesApi.list({ limit: 100 });
                const allTribunals = new Set<string>();

                response.data.forEach((process) => {
                    if (process.tribunal) {
                        allTribunals.add(process.tribunal);
                    }
                });

                let currentCursor = response.nextCursor;
                while (currentCursor) {
                    const nextResponse = await processesApi.list({ limit: 100, cursor: currentCursor });
                    nextResponse.data.forEach((process) => {
                        if (process.tribunal) {
                            allTribunals.add(process.tribunal);
                        }
                    });
                    currentCursor = nextResponse.nextCursor;
                }

                setAvailableTribunals(Array.from(allTribunals).sort());
            } catch (error) {
                console.warn('Failed to fetch all tribunals, using loaded processes', error);
                const tribunalsFromProcesses = Array.from(
                    new Set(processes.map((process) => process.tribunal).filter(Boolean))
                ).sort();
                setAvailableTribunals(tribunalsFromProcesses);
                tribunalsFetchedRef.current = false;
            }
        };

        fetchAllTribunals();
    }, [processes]);

    return availableTribunals;
};
