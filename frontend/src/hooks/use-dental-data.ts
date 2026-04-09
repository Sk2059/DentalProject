import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, ENDPOINTS } from '@/lib/api-config';

interface Service {
    title: string;
    description: string;
    icon: string;
    features: string[];
    price: string;
}

interface Stat {
    icon: string;
    value: string;
    label: string;
}

interface DentalData {
    services: Service[];
    stats: Stat[];
}

const fetchDentalData = async (): Promise<DentalData> => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.getData}`);
        if (!response.ok) {
            throw new Error('Failed to fetch dental data');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching dental data:', error);
        throw error;
    }
};

export const useDentalData = () => {
    return useQuery({
        queryKey: ['dentalData'],
        queryFn: fetchDentalData,
        retry: 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}; 