DO $$ BEGIN
 CREATE TYPE "public"."PackagePayloadType" AS ENUM('add-package', 'update-package');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "track_number_metas" (
	"id" serial PRIMARY KEY NOT NULL,
	"track_number" varchar(10) NOT NULL,
	"encrypted_private_key" text NOT NULL,
	"company_id" integer NOT NULL,
	CONSTRAINT "track_number_metas_track_number_unique" UNIQUE("track_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"tx_id" varchar(66) NOT NULL,
	"package_payload_type" "PackagePayloadType" NOT NULL,
	"encrypted_information" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"wallet_id" integer NOT NULL,
	"track_number_meta_id" integer NOT NULL,
	CONSTRAINT "transactions_tx_id_unique" UNIQUE("tx_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar(42) NOT NULL,
	"encrypted_private_key" text NOT NULL,
	"company_id" integer NOT NULL,
	CONSTRAINT "wallets_address_unique" UNIQUE("address"),
	CONSTRAINT "wallets_company_id_unique" UNIQUE("company_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_track_number_meta_id_track_number_metas_id_fk" FOREIGN KEY ("track_number_meta_id") REFERENCES "public"."track_number_metas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
