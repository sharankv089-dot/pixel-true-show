
-- Create kod_users table for storing user details
CREATE TABLE public.kod_users (
  uid UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  phone TEXT,
  balance NUMERIC NOT NULL DEFAULT 100000,
  role TEXT NOT NULL DEFAULT 'Customer' CHECK (role = 'Customer'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_tokens table for JWT token storage
CREATE TABLE public.user_tokens (
  tid UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL,
  uid UUID NOT NULL REFERENCES public.kod_users(uid) ON DELETE CASCADE,
  expiry TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kod_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for kod_users
CREATE POLICY "Users can view their own profile"
ON public.kod_users FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.kod_users FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_tokens
CREATE POLICY "Users can view their own tokens"
ON public.user_tokens FOR SELECT
USING (uid IN (SELECT k.uid FROM public.kod_users k WHERE k.user_id = auth.uid()));

CREATE POLICY "Users can insert their own tokens"
ON public.user_tokens FOR INSERT
WITH CHECK (uid IN (SELECT k.uid FROM public.kod_users k WHERE k.user_id = auth.uid()));

CREATE POLICY "Users can delete their own tokens"
ON public.user_tokens FOR DELETE
USING (uid IN (SELECT k.uid FROM public.kod_users k WHERE k.user_id = auth.uid()));
