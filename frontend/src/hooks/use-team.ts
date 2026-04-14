import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  experience: string;
  specialization: string;
  image: string | null;
  is_featured: boolean;
  seniority: number;
  created_at: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

function normalizeTeamMember(member: TeamMember): TeamMember {
  if (!member.image) return member;
  if (member.image.startsWith("http://") || member.image.startsWith("https://")) return member;
  return { ...member, image: `${API_BASE_URL}${member.image}` };
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team", "all"],
    queryFn: async () => {
      const data = await fetchJson<TeamMember[]>(`${API_BASE_URL}${ENDPOINTS.team}`);
      return data.map(normalizeTeamMember);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedTeamMembers() {
  return useQuery({
    queryKey: ["team", "featured"],
    queryFn: async () => {
      const data = await fetchJson<TeamMember[]>(`${API_BASE_URL}${ENDPOINTS.featuredTeam}`);
      return data.map(normalizeTeamMember);
    },
    staleTime: 1000 * 60 * 5,
  });
}
