/**
 * Customer Query
 * Query customer data from customers_backup table
 */ export async function findCustomerByPhone(supabase, phone) {
  console.log(`Querying customer with phone: ${phone}`);
  // Clean phone number (remove non-digits)
  const cleanPhone = phone.replace(/\D/g, '');
  // Query from customers_backup table
  const { data, error } = await supabase.from('customers_backup').select('*').or(`contactnumber.eq.${cleanPhone}`).single();
  if (error) {
    console.error('Query error:', error);
    return null;
  }
  if (data) {
    console.log(`✅ Customer found: ${data.name} (${data.code})`);
  } else {
    console.log('❌ Customer not found');
  }
  return data;
}
