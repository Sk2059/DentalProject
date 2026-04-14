import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";

export interface Service {
  id?: number;
  title: string;
  description: string;
  icon: string;
  features?: string[];
  price: string;
  image?: string | null;
  is_featured?: boolean;
}

const SERVICE_FEATURES_STORAGE_KEY = "service-features-map";

type ServiceFeaturesMap = Record<string, string[]>;

function getStoredFeaturesMap(): ServiceFeaturesMap {
  try {
    const raw = localStorage.getItem(SERVICE_FEATURES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ServiceFeaturesMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function setServiceCharacteristics(serviceId: number | string, features: string[]) {
  const map = getStoredFeaturesMap();
  const cleaned = features.map((f) => f.trim()).filter(Boolean);
  map[String(serviceId)] = cleaned;
  localStorage.setItem(SERVICE_FEATURES_STORAGE_KEY, JSON.stringify(map));
}

export function removeServiceCharacteristics(serviceId: number | string) {
  const map = getStoredFeaturesMap();
  delete map[String(serviceId)];
  localStorage.setItem(SERVICE_FEATURES_STORAGE_KEY, JSON.stringify(map));
}

function applyStoredCharacteristics(services: Service[]): Service[] {
  const map = getStoredFeaturesMap();
  return services.map((service) => {
    const key = String(service.id ?? "");
    const stored = key ? map[key] : undefined;
    return {
      ...service,
      features: stored && stored.length > 0 ? stored : service.features,
    };
  });
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const data = await fetchJson<Service[]>(`${API_BASE_URL}${ENDPOINTS.services}`);
      return applyStoredCharacteristics(data);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedServices() {
  return useQuery({
    queryKey: ["services", "featured"],
    queryFn: () => fetchJson<Service[]>(`${API_BASE_URL}${ENDPOINTS.featuredServices}`),
    staleTime: 1000 * 60 * 5,
  });
}
