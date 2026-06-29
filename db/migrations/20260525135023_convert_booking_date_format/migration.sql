ALTER TABLE "Booking" ADD COLUMN "date_new" DATE;

UPDATE "Booking" SET "date_new" = TO_DATE("date", 'DD.MM.YYYY');

ALTER TABLE "Booking" DROP COLUMN "date";

ALTER TABLE "Booking" RENAME COLUMN "date_new" TO "date";