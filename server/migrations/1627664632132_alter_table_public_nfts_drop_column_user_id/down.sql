ALTER TABLE "public"."nfts" ADD COLUMN "user_id" uuid;
ALTER TABLE "public"."nfts" ALTER COLUMN "user_id" DROP NOT NULL;
ALTER TABLE "public"."nfts" ADD CONSTRAINT nfts_user_id_fkey FOREIGN KEY (user_id) REFERENCES "public"."users" (id) ON DELETE restrict ON UPDATE restrict;
