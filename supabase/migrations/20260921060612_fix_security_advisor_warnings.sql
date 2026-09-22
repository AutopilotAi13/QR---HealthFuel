-- Revoke EXECUTE on is_admin() from anon role (it's only needed in RLS policies)
REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;

-- Fix set_updated_at search path
ALTER FUNCTION set_updated_at() SET search_path = public;
