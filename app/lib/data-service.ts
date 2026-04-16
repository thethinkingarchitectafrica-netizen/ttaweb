import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as staticContent from "./content";

/**
 * Standard content fetcher with fallback logic.
 * Tries Supabase first, then falls back to static content.
 */
export async function getSiteConfig(key: string, fallback: any) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) return fallback;
    return data.value;
  } catch {
    return fallback;
  }
}

export async function getSessions() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("date", { ascending: false });

    if (error || !data || data.length === 0) return staticContent.sessions;
    
    // Map DB fields to Type (camelCase)
    return data.map(s => ({
      ...s,
      thumbnailUrl: s.thumbnail_url,
      videoUrl: s.video_url,
      tags: s.tags || []
    }));
  } catch {
    return staticContent.sessions;
  }
}

export async function getEvents() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return {
        upcomingEvent: staticContent.upcomingEvent,
        pastEvents: staticContent.pastEvents
      };
    }
    
    const upcoming = data.find(e => e.is_upcoming);
    const past = data.filter(e => !e.is_upcoming);
    
    return {
      upcomingEvent: upcoming || staticContent.upcomingEvent,
      pastEvents: past.length > 0 ? past : staticContent.pastEvents
    };
  } catch {
    return {
      upcomingEvent: staticContent.upcomingEvent,
      pastEvents: staticContent.pastEvents
    };
  }
}

export async function getTeam() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return staticContent.team;
    return data;
  } catch {
    return staticContent.team;
  }
}

export async function getStats() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return staticContent.stats;
    return data;
  } catch (err) {
    return staticContent.stats;
  }
}
