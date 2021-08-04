create or replace view tickets as select user_id, ticket, email, active from auth.accounts;
