-- DropIndex
DROP INDEX "Student_father_phone_key";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "grade" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;
