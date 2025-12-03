// Quick test to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yyfyjhuvrxpxfrzbryqf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZnlqaHV2cnhweGZyemJyeXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODM0MDcsImV4cCI6MjA3OTY1OTQwN30.DkRbqkwJofW-cH6MTk48_U6cJdOt9F2Lo106VtnGHdk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  console.log('Testing Supabase connection...');
  
  const testEmail = `testuser${Date.now()}@gmail.com`;
  const testPassword = 'testpass123';
  const testName = 'Test User';
  
  console.log('Attempting to sign up:', testEmail);
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: testName,
      },
    },
  });
  
  if (error) {
    console.error('❌ Signup Error:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Signup Success!');
    console.log('User:', data.user?.email);
    console.log('Session:', data.session ? 'Created' : 'Waiting for confirmation');
    console.log('Full response:', JSON.stringify(data, null, 2));
  }
}

testSignup().catch(console.error);
