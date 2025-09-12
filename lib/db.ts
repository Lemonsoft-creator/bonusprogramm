'use client';
// A tiny abstraction so the UI can either use Supabase (if configured) or fall back to in-memory demo data.
import { supabase } from "./supabaseClient";

export type UserRow = { id: string; first_name: string; last_name: string; email: string; total_points: number; };
export type LedgerRow = { id: string; user_id: string; date: string; points: number; rule: string; note?: string; };

export const db = {
  async getUsers(): Promise<UserRow[]> {
    if (!supabase) {
      return [
        { id: 'u1', first_name: 'Max', last_name: 'Mustermann', email: 'max@example.com', total_points: 162 },
        { id: 'u2', first_name: 'Erika', last_name: 'Muster', email: 'erika@example.com', total_points: 176 },
        { id: 'u3', first_name: 'Luca', last_name: 'Bernasconi', email: 'luca@example.com', total_points: 210 },
        { id: 'u4', first_name: 'Samira', last_name: 'Khan', email: 'samira@example.com', total_points: 140 },
      ];
    }
    const { data, error } = await supabase.from('users').select('*').order('total_points', { ascending: false });
    if (error) { console.error(error); return []; }
    return data as any;
  }
};
