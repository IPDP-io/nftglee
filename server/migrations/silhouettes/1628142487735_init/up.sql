--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7 (Debian 12.7-1.pgdg100+1)
-- Dumped by pg_dump version 12.7 (Debian 12.7-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO postgres;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: create_constraint_if_not_exists(text, text, text); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.create_constraint_if_not_exists(t_name text, c_name text, constraint_sql text) RETURNS void
    LANGUAGE plpgsql
    AS $$
  BEGIN
    -- Look for our constraint
    IF NOT EXISTS (SELECT constraint_name
                   FROM information_schema.constraint_column_usage
                   WHERE constraint_name = c_name) THEN
        EXECUTE 'ALTER TABLE ' || t_name || ' ADD CONSTRAINT ' || c_name || ' ' || constraint_sql;
    END IF;
  END;
$$;


ALTER FUNCTION auth.create_constraint_if_not_exists(t_name text, c_name text, constraint_sql text) OWNER TO postgres;

--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


ALTER FUNCTION hdb_catalog.gen_hasura_uuid() OWNER TO postgres;

--
-- Name: insert_event_log(text, text, text, text, json); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    id text;
    payload json;
    session_variables json;
    server_version_num int;
    trace_context json;
  BEGIN
    id := gen_random_uuid();
    server_version_num := current_setting('server_version_num');
    IF server_version_num >= 90600 THEN
      session_variables := current_setting('hasura.user', 't');
      trace_context := current_setting('hasura.tracecontext', 't');
    ELSE
      BEGIN
        session_variables := current_setting('hasura.user');
      EXCEPTION WHEN OTHERS THEN
                  session_variables := NULL;
      END;
      BEGIN
        trace_context := current_setting('hasura.tracecontext');
      EXCEPTION WHEN OTHERS THEN
        trace_context := NULL;
      END;
    END IF;
    payload := json_build_object(
      'op', op,
      'data', row_data,
      'session_variables', session_variables,
      'trace_context', trace_context
    );
    INSERT INTO hdb_catalog.event_log
                (id, schema_name, table_name, trigger_name, payload)
    VALUES
    (id, schema_name, table_name, trigger_name, payload);
    RETURN id;
  END;
$$;


ALTER FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) OWNER TO postgres;

--
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.set_current_timestamp_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_providers; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.account_providers (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    account_id uuid NOT NULL,
    auth_provider text NOT NULL,
    auth_provider_unique_id text NOT NULL
);


ALTER TABLE auth.account_providers OWNER TO postgres;

--
-- Name: account_roles; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.account_roles (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    account_id uuid NOT NULL,
    role text NOT NULL
);


ALTER TABLE auth.account_roles OWNER TO postgres;

--
-- Name: accounts; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.accounts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    active boolean DEFAULT false NOT NULL,
    email public.citext,
    new_email public.citext,
    password_hash text,
    default_role text DEFAULT 'user'::text NOT NULL,
    is_anonymous boolean DEFAULT false NOT NULL,
    custom_register_data jsonb,
    otp_secret text,
    mfa_enabled boolean DEFAULT false NOT NULL,
    ticket uuid DEFAULT public.gen_random_uuid() NOT NULL,
    ticket_expires_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT proper_email CHECK ((email OPERATOR(public.~*) '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::public.citext)),
    CONSTRAINT proper_new_email CHECK ((new_email OPERATOR(public.~*) '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::public.citext))
);


ALTER TABLE auth.accounts OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE auth.migrations OWNER TO postgres;

--
-- Name: providers; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.providers (
    provider text NOT NULL
);


ALTER TABLE auth.providers OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.refresh_tokens (
    refresh_token uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    account_id uuid NOT NULL
);


ALTER TABLE auth.refresh_tokens OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.roles (
    role text NOT NULL
);


ALTER TABLE auth.roles OWNER TO postgres;

--
-- Name: event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.event_invocation_logs OWNER TO postgres;

--
-- Name: event_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_log (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    trigger_name text NOT NULL,
    payload jsonb NOT NULL,
    delivered boolean DEFAULT false NOT NULL,
    error boolean DEFAULT false NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    locked timestamp with time zone,
    next_retry_at timestamp without time zone,
    archived boolean DEFAULT false NOT NULL
);


ALTER TABLE hdb_catalog.event_log OWNER TO postgres;

--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


ALTER TABLE hdb_catalog.hdb_action_log OWNER TO postgres;

--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_cron_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_cron_events OWNER TO postgres;

--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


ALTER TABLE hdb_catalog.hdb_metadata OWNER TO postgres;

--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_scheduled_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_scheduled_events OWNER TO postgres;

--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


ALTER TABLE hdb_catalog.hdb_schema_notifications OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Name: migration_settings; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.migration_settings (
    setting text NOT NULL,
    value text NOT NULL
);


ALTER TABLE hdb_catalog.migration_settings OWNER TO postgres;

--
-- Name: schema_migrations; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);


ALTER TABLE hdb_catalog.schema_migrations OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: currentuser; Type: VIEW; Schema: public; Owner: postgres
--

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


ALTER TABLE public.currentuser OWNER TO postgres;

--
-- Name: nfts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nfts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    asset text NOT NULL,
    ticket integer NOT NULL,
    type text
);


ALTER TABLE public.nfts OWNER TO postgres;

--
-- Name: tickets; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.tickets AS
 SELECT accounts.user_id,
    accounts.ticket,
    accounts.email,
    accounts.active
   FROM auth.accounts;


ALTER TABLE public.tickets OWNER TO postgres;

--
-- Data for Name: account_providers; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.account_providers (id, created_at, updated_at, account_id, auth_provider, auth_provider_unique_id) FROM stdin;
\.


--
-- Data for Name: account_roles; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.account_roles (id, created_at, account_id, role) FROM stdin;
9ecd8573-f3d6-48d5-b925-d8a9dbb0fc51	2021-08-04 20:02:15.008263+00	13731468-aba5-43fe-a6d6-59f339e9d625	user
d37c3e74-9973-4f29-8788-1f3d13a9cbbf	2021-08-04 20:09:07.622795+00	f60391c3-3cc8-48e2-8ee9-8df0745fc50e	user
365aa923-af29-4877-a415-a1c587cf614f	2021-08-04 20:09:36.285347+00	85233090-f13d-4e7e-96bd-7b321068bb2d	user
6388f98e-6c56-4cab-80f9-8efc09ba83d5	2021-08-04 20:10:30.297405+00	a8ab3624-372a-4917-b7dc-e39ea5265afb	user
42a69dcd-73c8-4ed0-bf27-240e44d970ad	2021-08-04 20:17:13.757699+00	5669c64c-978a-43bd-b46d-1600220a9b94	user
dec20a86-f96e-4c88-91fe-1bde43089093	2021-08-04 20:50:58.662955+00	57e9137a-2c1f-41c6-bba1-857b0d8ac9b7	user
0a683692-98f1-4ee2-b458-bf7583a90590	2021-08-04 20:54:19.978515+00	7815c236-cf8c-4b7f-8046-0a6a104fdd7c	user
f442151d-f49f-45af-8a9e-0b2fd58d3bb1	2021-08-04 22:52:48.802049+00	0c956524-d919-44a1-b23c-938b6f9b36b4	user
82226f0d-5516-4983-940a-b37f6ac3ee85	2021-08-05 00:09:08.887989+00	e0ddc0d9-3f3d-43aa-b05b-5753a24caa5e	user
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.accounts (id, created_at, updated_at, user_id, active, email, new_email, password_hash, default_role, is_anonymous, custom_register_data, otp_secret, mfa_enabled, ticket, ticket_expires_at) FROM stdin;
13731468-aba5-43fe-a6d6-59f339e9d625	2021-08-04 20:02:15.008263+00	2021-08-04 20:02:15.008263+00	d8209502-5822-4a83-869d-549d69d0cb1e	f	test@coinos.io	\N	$2a$10$tTQxqdkaeeVxHv9lLEtQR.ZnbcWtJJCw1R72lLH2dEFFHXHCTGGmi	user	f	\N	\N	f	6f3bbd0a-0a94-4c91-ba06-dd57e5fdfe23	2021-08-04 21:02:14.938+00
f60391c3-3cc8-48e2-8ee9-8df0745fc50e	2021-08-04 20:09:07.622795+00	2021-08-04 20:09:07.622795+00	5914bc06-ef5c-46bb-afbc-89220290af6c	f	test2@coinos.io	\N	$2a$10$aC.raNkBUO3YkY6F1KkV3eNAJ0C.eHlGTw.D/do9ingB/KsksEJkS	user	f	\N	\N	f	1d48fbf0-5ee5-4557-b845-73daa75fe876	2021-08-04 21:09:07.552+00
85233090-f13d-4e7e-96bd-7b321068bb2d	2021-08-04 20:09:36.285347+00	2021-08-04 20:09:36.285347+00	0c065468-7e5f-4d51-8bde-32040d0c4c2c	f	test3@coinos.io	\N	$2a$10$G.OOwnP7MZ2kKTbBn6K.tevI2pH.NsV.HFuWIb4WPGqbckGbhyTG6	user	f	\N	\N	f	bd00a845-7b9d-4f5b-8d53-e23407f92c3b	2021-08-04 21:09:36.197+00
a8ab3624-372a-4917-b7dc-e39ea5265afb	2021-08-04 20:10:30.297405+00	2021-08-04 20:15:45.260673+00	c678f942-0401-47ab-8a6f-c2ca89bf732a	t	test4@coinos.io	\N	$2a$10$/sNAoaNnaIRIJK3N6TyldOmiv1bICFv5MtLgdBfHMDjZ6sz5GQl4y	user	f	\N	\N	f	b3ee2de0-88af-4b8d-9fcc-1d6de3ba3b2d	2021-08-04 20:15:45.252+00
5669c64c-978a-43bd-b46d-1600220a9b94	2021-08-04 20:17:13.757699+00	2021-08-04 20:17:25.545422+00	af6a33e3-3201-4f6c-b17d-f2680459b5b1	t	test5@coinos.io	\N	$2a$10$ys2Zl1tcj0G7zwnSsG5vOOu1t561tzkLyWFok8Nqy2hGkme1nve.i	user	f	\N	\N	f	c07c2598-762e-4d1e-9e37-df69df85e49c	2021-08-04 20:17:25.541+00
57e9137a-2c1f-41c6-bba1-857b0d8ac9b7	2021-08-04 20:50:58.662955+00	2021-08-04 20:51:11.789966+00	26ab532f-cf7d-4ee6-b5b7-aad8451d1a2e	t	test6@coinos.io	\N	$2a$10$6iHP5ToR4EiGcIBdT.EqveDhYgIr7E9OaouRXIFQ6t881DjNfcddu	user	f	\N	\N	f	acbb997d-a32a-4493-841e-090e2791c951	2021-08-04 20:51:11.788+00
7815c236-cf8c-4b7f-8046-0a6a104fdd7c	2021-08-04 20:54:19.978515+00	2021-08-04 20:54:28.672915+00	a46aa2ee-614c-43ad-9ee7-27f45eae9bd9	t	test7@coinos.io	\N	$2a$10$7Sn0ur4l36CTcWc8.3XaAOiXHsFvbT7q69DKfIz0dBUuKvJc5wbl6	user	f	\N	\N	f	e4a27757-0485-48bc-baad-ef16a54157f2	2021-08-04 20:54:28.667+00
0c956524-d919-44a1-b23c-938b6f9b36b4	2021-08-04 22:52:48.802049+00	2021-08-04 22:53:08.61433+00	251b5724-db31-472e-aca9-a3dc4678fb7b	t	test8@coinos.io	\N	$2a$10$hvg7QlwQPMrYIth8QvVF9.U3UKMeQCuS.ZCpZT0YYjIrOoIDD8jhW	user	f	\N	\N	f	405f677e-ccb6-4be5-bdde-b1a03c6a4bda	2021-08-04 22:53:08.612+00
e0ddc0d9-3f3d-43aa-b05b-5753a24caa5e	2021-08-05 00:09:08.887989+00	2021-08-05 00:09:33.403342+00	803b7b04-16a0-4ee7-8605-31f10cae0ca7	t	test9@coinos.io	\N	$2a$10$jBQW1U4s4UZT1p9id4DHPOrLT4w0fRVvI9bishq1VTLrYlyfcYvLe	user	f	\N	\N	f	d83afe5d-94cd-44a6-bb6a-dda062e6a675	2021-08-05 00:09:33.401+00
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2021-08-04 18:28:05.028892
1	create-initial-tables	3f2f999bab5439c18c4c56210fe9a2bfcfa2ba55	2021-08-04 18:28:05.045268
\.


--
-- Data for Name: providers; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.providers (provider) FROM stdin;
github
facebook
twitter
google
apple
linkedin
windowslive
spotify
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.refresh_tokens (refresh_token, created_at, expires_at, account_id) FROM stdin;
86d8c87c-b5ea-4104-83b2-5e4ec8fdf878	2021-08-04 20:17:25.560396+00	2021-09-03 20:17:25.555+00	5669c64c-978a-43bd-b46d-1600220a9b94
b022a6ac-c85e-4506-b525-d79ec7aba6d5	2021-08-04 20:17:25.693365+00	2021-09-03 20:17:25.691+00	5669c64c-978a-43bd-b46d-1600220a9b94
8f3fe416-2f0d-4e2a-a9db-0283745084f0	2021-08-04 20:17:49.219837+00	2021-09-03 20:17:49.217+00	5669c64c-978a-43bd-b46d-1600220a9b94
7be58aea-f0ce-4e0e-9bf3-6d055e4d4055	2021-08-04 20:40:31.75541+00	2021-09-03 20:40:31.753+00	5669c64c-978a-43bd-b46d-1600220a9b94
e389bf86-2648-4b96-a441-777ec3dd0c41	2021-08-04 20:43:03.031077+00	2021-09-03 20:43:03.028+00	5669c64c-978a-43bd-b46d-1600220a9b94
751ac546-0d26-4521-a957-c33b32d9a3e9	2021-08-04 20:51:11.796658+00	2021-09-03 20:51:11.794+00	57e9137a-2c1f-41c6-bba1-857b0d8ac9b7
27b655fe-b104-43f3-9976-057de62d8b84	2021-08-04 20:54:28.681123+00	2021-09-03 20:54:28.678+00	7815c236-cf8c-4b7f-8046-0a6a104fdd7c
8372752c-78bf-4092-be06-103eabf29379	2021-08-04 22:53:08.621487+00	2021-09-03 22:53:08.619+00	0c956524-d919-44a1-b23c-938b6f9b36b4
b1573dab-8fc6-4d34-aed8-996294daef46	2021-08-05 00:09:33.409565+00	2021-09-04 00:09:33.407+00	e0ddc0d9-3f3d-43aa-b05b-5753a24caa5e
f2c4168d-6af8-4537-88ce-cf2ab3bc612a	2021-08-05 04:00:34.007172+00	2021-09-04 04:00:34.005+00	e0ddc0d9-3f3d-43aa-b05b-5753a24caa5e
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.roles (role) FROM stdin;
user
anonymous
me
\.


--
-- Data for Name: event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: event_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_log (id, schema_name, table_name, trigger_name, payload, delivered, error, tries, created_at, locked, next_retry_at, archived) FROM stdin;
\.


--
-- Data for Name: hdb_action_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action_log (id, action_name, input_payload, request_headers, session_variables, response_payload, errors, created_at, response_received_at, status) FROM stdin;
\.


--
-- Data for Name: hdb_cron_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_cron_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_events (id, trigger_name, scheduled_time, status, tries, created_at, next_retry_at) FROM stdin;
\.


--
-- Data for Name: hdb_metadata; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_metadata (id, metadata, resource_version) FROM stdin;
1	{"sources":[{"kind":"postgres","name":"silhouettes","tables":[{"object_relationships":[{"using":{"foreign_key_constraint_on":"account_id"},"name":"account"},{"using":{"foreign_key_constraint_on":"auth_provider"},"name":"provider"}],"table":{"schema":"auth","name":"account_providers"}},{"object_relationships":[{"using":{"foreign_key_constraint_on":"account_id"},"name":"account"},{"using":{"foreign_key_constraint_on":"role"},"name":"roleByRole"}],"table":{"schema":"auth","name":"account_roles"}},{"object_relationships":[{"using":{"foreign_key_constraint_on":"default_role"},"name":"role"},{"using":{"manual_configuration":{"remote_table":{"schema":"public","name":"users"},"insertion_order":null,"column_mapping":{"user_id":"id"}}},"name":"user"}],"table":{"schema":"auth","name":"accounts"},"array_relationships":[{"using":{"foreign_key_constraint_on":{"column":"account_id","table":{"schema":"auth","name":"account_providers"}}},"name":"account_providers"},{"using":{"foreign_key_constraint_on":{"column":"account_id","table":{"schema":"auth","name":"account_roles"}}},"name":"account_roles"},{"using":{"foreign_key_constraint_on":{"column":"account_id","table":{"schema":"auth","name":"refresh_tokens"}}},"name":"refresh_tokens"}]},{"table":{"schema":"auth","name":"migrations"}},{"table":{"schema":"auth","name":"providers"}},{"object_relationships":[{"using":{"foreign_key_constraint_on":"account_id"},"name":"account"}],"table":{"schema":"auth","name":"refresh_tokens"}},{"table":{"schema":"auth","name":"roles"},"array_relationships":[{"using":{"foreign_key_constraint_on":{"column":"role","table":{"schema":"auth","name":"account_roles"}}},"name":"account_roles"},{"using":{"foreign_key_constraint_on":{"column":"default_role","table":{"schema":"auth","name":"accounts"}}},"name":"accounts"}]},{"select_permissions":[{"role":"user","permission":{"columns":["address","avatar_url","display_name","mnemonic","pubkey","created_at","updated_at","id"],"filter":{"id":{"_eq":"X-Hasura-User-Id"}}}}],"table":{"schema":"public","name":"currentuser"}},{"table":{"schema":"public","name":"nfts"}},{"table":{"schema":"public","name":"tickets"}},{"table":{"schema":"public","name":"users"}}],"configuration":{"connection_info":{"use_prepared_statements":false,"database_url":{"from_env":"HASURA_GRAPHQL_DATABASE_URL"},"isolation_level":"read-committed"}}}],"version":3}	30
\.


--
-- Data for Name: hdb_scheduled_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_scheduled_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_events (id, webhook_conf, scheduled_time, retry_conf, payload, header_conf, status, tries, created_at, next_retry_at, comment) FROM stdin;
\.


--
-- Data for Name: hdb_schema_notifications; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_schema_notifications (id, notification, resource_version, instance_id, updated_at) FROM stdin;
1	{"metadata":false,"remote_schemas":[],"sources":[]}	30	b1bd7dc1-bcc4-499d-8538-74c84b71d8b1	2021-08-04 19:21:28.121764+00
\.


--
-- Data for Name: hdb_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_version (hasura_uuid, version, upgraded_on, cli_state, console_state) FROM stdin;
8c170954-c957-4df8-8035-f6c7ecaeaa99	46	2021-08-04 19:10:53.751592+00	{"settings": {"migration_mode": "true"}, "migrations": {"silhouettes": {"1625340131884": false, "1625340143244": false, "1627097885369": false, "1627098019391": false, "1627187807020": false, "1627449370795": false, "1627449422024": false, "1627536825330": false, "1627664508540": false, "1627664632132": false, "1627676512297": false, "1627882732834": false}}, "isStateCopyCompleted": true}	{"onboardingShown": true, "console_notifications": {"admin": {"date": "2021-08-05T05:33:55.874Z", "read": "default", "showBadge": false}}, "telemetryNotificationShown": true}
\.


--
-- Data for Name: migration_settings; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.migration_settings (setting, value) FROM stdin;
migration_mode	true
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.schema_migrations (version, dirty) FROM stdin;
\.


--
-- Data for Name: nfts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nfts (id, asset, ticket, type) FROM stdin;
2e0c8fc4-5924-476c-9bae-ff13fa9004bc	1a9b1a2d7dc56e4b8a20648df951eb8071bc57ead38d3e5f258ff06fed3ae08c	1	ticket
01c7b758-7f00-4540-9376-9037221c3e47	1e8103d390067e07e2efd061c3dab739298138c56dc534437ea4148c1902dd02	1	poster
82960390-701d-49b9-ae32-6b58364f0e0b	ae6a5c6c57ecfea9e4985c309364bb942d28a21fae9fd0cfa9364fe0c125f884	1	artwork
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, created_at, updated_at, display_name, avatar_url, address, mnemonic, pubkey) FROM stdin;
d8209502-5822-4a83-869d-549d69d0cb1e	2021-08-04 20:02:15.008263+00	2021-08-04 20:02:17.283669+00	test@coinos.io	\N	Xa1NKwQUxDXwxEEvTMfCKXT27Zm9NkWfdD	hospital laptop mad grow oven claim rotate clean fog lion boat trap	\N
5914bc06-ef5c-46bb-afbc-89220290af6c	2021-08-04 20:09:07.622795+00	2021-08-04 20:09:09.312466+00	test2@coinos.io	\N	Xa1NKwQUxDXwxEEvTMfCKXT27Zm9NkWfdD	hospital laptop mad grow oven claim rotate clean fog lion boat trap	\N
0c065468-7e5f-4d51-8bde-32040d0c4c2c	2021-08-04 20:09:36.285347+00	2021-08-04 20:09:37.998938+00	test3@coinos.io	\N	Xa1NKwQUxDXwxEEvTMfCKXT27Zm9NkWfdD	hospital laptop mad grow oven claim rotate clean fog lion boat trap	\N
c678f942-0401-47ab-8a6f-c2ca89bf732a	2021-08-04 20:10:30.297405+00	2021-08-04 20:10:32.762115+00	test4@coinos.io	\N	Xa1NKwQUxDXwxEEvTMfCKXT27Zm9NkWfdD	hospital laptop mad grow oven claim rotate clean fog lion boat trap	\N
af6a33e3-3201-4f6c-b17d-f2680459b5b1	2021-08-04 20:17:13.757699+00	2021-08-04 20:17:15.405502+00	test5@coinos.io	\N	Xa1NKwQUxDXwxEEvTMfCKXT27Zm9NkWfdD	hospital laptop mad grow oven claim rotate clean fog lion boat trap	\N
26ab532f-cf7d-4ee6-b5b7-aad8451d1a2e	2021-08-04 20:50:58.662955+00	2021-08-04 20:51:00.30677+00	test6@coinos.io	\N	XE6EuEf6iaGvnAbakXQe5aBuamiQ7pSUea	hazard bread endorse dinosaur perfect lamp noise hat surge ecology pattern struggle	\N
a46aa2ee-614c-43ad-9ee7-27f45eae9bd9	2021-08-04 20:54:19.978515+00	2021-08-04 20:54:21.939144+00	test7@coinos.io	\N	XF4qLAktkdGAEvBmoS6S458ThzfmjvanCE	neck stay speed close wage jealous actual squeeze vivid planet poem lecture	\N
251b5724-db31-472e-aca9-a3dc4678fb7b	2021-08-04 22:52:48.802049+00	2021-08-04 22:52:50.998194+00	test8@coinos.io	\N	XTNgysjKyCc4MqEkjnERFiSmz3w2ihP1cp	leaf chimney wild island decade toss cause annual nominee solar leopard basic	\N
803b7b04-16a0-4ee7-8605-31f10cae0ca7	2021-08-05 00:09:08.887989+00	2021-08-05 00:09:10.493007+00	test9@coinos.io	\N	XBomCxiaSCubSEqesGBLfG1XSrxcdRUGFq	pulse stage guide diesel caution proof random bracket manual sample melt present	\N
\.


--
-- Name: account_providers account_providers_account_id_auth_provider_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_providers
    ADD CONSTRAINT account_providers_account_id_auth_provider_key UNIQUE (account_id, auth_provider);


--
-- Name: account_providers account_providers_auth_provider_auth_provider_unique_id_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_providers
    ADD CONSTRAINT account_providers_auth_provider_auth_provider_unique_id_key UNIQUE (auth_provider, auth_provider_unique_id);


--
-- Name: account_providers account_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_providers
    ADD CONSTRAINT account_providers_pkey PRIMARY KEY (id);


--
-- Name: account_roles account_roles_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_roles
    ADD CONSTRAINT account_roles_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_email_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_email_key UNIQUE (email);


--
-- Name: accounts accounts_new_email_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_new_email_key UNIQUE (new_email);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_user_id_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_user_id_key UNIQUE (user_id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: providers providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (provider);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (refresh_token);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role);


--
-- Name: account_roles user_roles_account_id_role_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_roles
    ADD CONSTRAINT user_roles_account_id_role_key UNIQUE (account_id, role);


--
-- Name: event_invocation_logs event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: migration_settings migration_settings_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.migration_settings
    ADD CONSTRAINT migration_settings_pkey PRIMARY KEY (setting);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: nfts nfts_asset_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nfts
    ADD CONSTRAINT nfts_asset_key UNIQUE (asset);


--
-- Name: nfts nfts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nfts
    ADD CONSTRAINT nfts_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: event_invocation_logs_event_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_invocation_logs_event_id_idx ON hdb_catalog.event_invocation_logs USING btree (event_id);


--
-- Name: event_log_created_at_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_created_at_idx ON hdb_catalog.event_log USING btree (created_at);


--
-- Name: event_log_delivered_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_delivered_idx ON hdb_catalog.event_log USING btree (delivered);


--
-- Name: event_log_locked_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_locked_idx ON hdb_catalog.event_log USING btree (locked);


--
-- Name: event_log_trigger_name_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_trigger_name_idx ON hdb_catalog.event_log USING btree (trigger_name);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: account_providers set_auth_account_providers_updated_at; Type: TRIGGER; Schema: auth; Owner: postgres
--

CREATE TRIGGER set_auth_account_providers_updated_at BEFORE UPDATE ON auth.account_providers FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: accounts set_auth_accounts_updated_at; Type: TRIGGER; Schema: auth; Owner: postgres
--

CREATE TRIGGER set_auth_accounts_updated_at BEFORE UPDATE ON auth.accounts FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: users set_public_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: account_providers account_providers_account_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_providers
    ADD CONSTRAINT account_providers_account_id_fkey FOREIGN KEY (account_id) REFERENCES auth.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account_providers account_providers_auth_provider_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_providers
    ADD CONSTRAINT account_providers_auth_provider_fkey FOREIGN KEY (auth_provider) REFERENCES auth.providers(provider) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: account_roles account_roles_account_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_roles
    ADD CONSTRAINT account_roles_account_id_fkey FOREIGN KEY (account_id) REFERENCES auth.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account_roles account_roles_role_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_roles
    ADD CONSTRAINT account_roles_role_fkey FOREIGN KEY (role) REFERENCES auth.roles(role) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: accounts accounts_default_role_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_default_role_fkey FOREIGN KEY (default_role) REFERENCES auth.roles(role) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_account_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_account_id_fkey FOREIGN KEY (account_id) REFERENCES auth.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_invocation_logs event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.event_log(id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

