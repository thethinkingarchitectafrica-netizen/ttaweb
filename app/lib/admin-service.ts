import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function logAction(action: string, targetName?: string, targetId?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("activity_logs").insert([{
      user_email: user.email,
      action,
      target_name: targetName,
      target_id: targetId?.toString()
    }]);
  } catch (err) {
    console.error("Failed to log action:", err);
  }
}

export async function getAdminLogs() {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  
  if (error) throw error;
  return data;
}

export async function getSubmissions() {
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateSubmissionStatus(id: string, status: 'read' | 'unread' | 'archived') {
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id);
  
  if (error) throw error;
}

export async function getSubscribers() {
  const { data, error } = await supabase
    .from("newsletter_subscriptions")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteSubscriber(email: string) {
  const { error } = await supabase
    .from("newsletter_subscriptions")
    .delete()
    .eq("email", email);
  
  if (error) throw error;
}
