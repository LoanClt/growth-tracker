import { supabase } from "@/lib/supabaseClient";

export interface FormData {
  revenue: number;
  trl: number;
  ip: string;
  date: string;
  username: string;
}

export interface Account {
  username: string;
  password: string;
  formOpen: boolean;
}

export const saveFormData = async (
  data: Omit<FormData, 'date' | 'username'>,
  username: string
): Promise<void> => {
  const formEntry = {
    ...data,
    date: new Date().toISOString(),
    username,
  };
  const { error } = await supabase.from("form_data").insert([formEntry]);
  if (error) throw new Error(error.message);
  closeFormForUser(username);
};

export const getUserData = async (username: string): Promise<FormData[]> => {
  const { data, error } = await supabase
    .from("form_data")
    .select("*")
    .eq("username", username)
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

export const getAllData = async (): Promise<FormData[]> => {
  const { data, error } = await supabase
    .from("form_data")
    .select("*")
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

export const createAccount = async (username: string, password: string): Promise<boolean> => {
  // Check if account already exists
  const { data: existing, error: selectError } = await supabase
    .from('users')
    .select('username')
    .eq('username', username);
  if (selectError) throw new Error(selectError.message);
  if (existing && existing.length > 0) return false;
  const { data, error } = await supabase.from('users').insert([{ username, password, form_open: true }]);
  console.log('Supabase insert result:', data, error); // Debug log
  if (error) throw new Error(error.message);
  return true;
};

export const getAllAccounts = async (): Promise<Account[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

export const getAllUsernames = async (): Promise<string[]> => {
  const { data, error } = await supabase.from('users').select('username');
  if (error) throw new Error(error.message);
  return (data || []).map((acc: { username: string }) => acc.username);
};

export const deleteAccount = async (username: string): Promise<boolean> => {
  const { error } = await supabase.from('users').delete().eq('username', username);
  if (error) throw new Error(error.message);
  return true;
};

export const updateAccountCredentials = async (
  oldUsername: string,
  newUsername: string,
  newPassword: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('users')
    .update({ username: newUsername, password: newPassword })
    .eq('username', oldUsername);
  if (error) throw new Error(error.message);
  return true;
};

export const isFormOpenForUser = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('users')
    .select('form_open')
    .eq('username', username)
    .single();
  if (error) throw new Error(error.message);
  return data?.form_open ?? false;
};

export const toggleFormForUser = async (username: string, isOpen: boolean): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({ form_open: isOpen })
    .eq('username', username);
  if (error) throw new Error(error.message);
};

export const closeFormForUser = async (username: string): Promise<void> => {
  await toggleFormForUser(username, false);
};
