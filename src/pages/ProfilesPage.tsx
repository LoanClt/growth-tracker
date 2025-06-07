import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        setError(error.message);
      } else {
        setProfiles(data || []);
      }
      setLoading(false);
    }
    fetchProfiles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1>Profiles</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>{JSON.stringify(profile)}</li>
        ))}
      </ul>
    </div>
  );
} 