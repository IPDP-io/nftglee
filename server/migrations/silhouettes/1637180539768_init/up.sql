SET check_function_bodies = false;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  _new record;
begin
  _new := new;
  _new. "updated_at" = now();
  return _new;
end;
$$;
CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    display_name text,
    avatar_url text,
    address text,
    mnemonic text,
    pubkey text
);
CREATE VIEW public.currentuser AS
 SELECT users.id,
    users.created_at,
    users.updated_at,
    users.display_name,
    users.avatar_url,
    users.address,
    users.mnemonic,
    users.pubkey
   FROM public.users;
CREATE TABLE public.nfts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    asset text NOT NULL,
    ticket integer NOT NULL,
    type text
);
CREATE VIEW public.tickets AS
 SELECT accounts.user_id,
    accounts.ticket,
    accounts.email,
    accounts.active
   FROM auth.accounts;
ALTER TABLE ONLY public.nfts
    ADD CONSTRAINT nfts_asset_key UNIQUE (asset);
ALTER TABLE ONLY public.nfts
    ADD CONSTRAINT nfts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
