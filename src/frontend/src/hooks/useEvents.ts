import { createActor } from "@/backend";
import { sampleEvents } from "@/data/sampleEvents";
import type { Event } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useEvents() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      if (!actor) return sampleEvents;
      const events = await actor.getEvents();
      return events.length > 0 ? events : sampleEvents;
    },
    enabled: !isFetching,
    initialData: sampleEvents,
    staleTime: 30_000,
  });
}

export function useEvent(id: bigint | undefined) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Event | null>({
    queryKey: ["event", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) {
        return sampleEvents.find((e) => e.id === id) ?? null;
      }
      const event = await actor.getEvent(id);
      if (event) return event;
      return sampleEvents.find((e) => e.id === id) ?? null;
    },
    enabled: !isFetching && id !== undefined,
  });
}

export function useEventsByCategory(category: string) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Event[]>({
    queryKey: ["events", "category", category],
    queryFn: async () => {
      if (!actor || category === "All") return sampleEvents;
      const events = await actor.getEventsByCategory(category);
      return events.length > 0
        ? events
        : sampleEvents.filter((e) => e.category === category);
    },
    enabled: !isFetching,
    initialData:
      category === "All"
        ? sampleEvents
        : sampleEvents.filter((e) => e.category === category),
    staleTime: 30_000,
  });
}
