CREATE TABLE IF NOT EXISTS "categoria" (
	"id" serial PRIMARY KEY NOT NULL,
	"descripcion" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gasto" (
	"id" serial PRIMARY KEY NOT NULL,
	"fecha" date,
	"tipoGasto" integer NOT NULL,
	"tipoCambio" double precision NOT NULL,
	"totalAR" double precision DEFAULT 0,
	"total" double precision DEFAULT 0,
	"descripcion" varchar DEFAULT '',
	"categoria" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ingreso" (
	"id" serial PRIMARY KEY NOT NULL,
	"fecha" date,
	"responsable" integer NOT NULL,
	"moneda" integer NOT NULL,
	"importe" double precision DEFAULT 0 NOT NULL,
	"tipoCambio" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moneda" (
	"id" serial PRIMARY KEY NOT NULL,
	"descripcion" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "responsable" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tipoGasto" (
	"id" serial PRIMARY KEY NOT NULL,
	"descripcion" varchar DEFAULT ''
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gasto" ADD CONSTRAINT "gasto_tipoGasto_tipoGasto_id_fk" FOREIGN KEY ("tipoGasto") REFERENCES "public"."tipoGasto"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gasto" ADD CONSTRAINT "gasto_categoria_categoria_id_fk" FOREIGN KEY ("categoria") REFERENCES "public"."categoria"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ingreso" ADD CONSTRAINT "ingreso_responsable_responsable_id_fk" FOREIGN KEY ("responsable") REFERENCES "public"."responsable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ingreso" ADD CONSTRAINT "ingreso_moneda_moneda_id_fk" FOREIGN KEY ("moneda") REFERENCES "public"."moneda"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
