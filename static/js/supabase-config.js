/**
 * LA DOCE — supabase-config.js
 * Centralized Supabase connection settings
 */

const SUPABASE_URL = 'https://ugspkldvjfjjoytfuzoh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnc3BrbGR2amZqam95dGZ1em9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjgyOTAsImV4cCI6MjA5Mzc0NDI5MH0.p7Y6JfHzwMvdT4H4TygXfvs78-xCXPV8KCGyqlcE4oM';

// Usamos "db" para evitar conflictos con la librería global "supabase"
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
