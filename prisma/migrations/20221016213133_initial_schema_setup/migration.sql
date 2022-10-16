-- CreateTable
CREATE TABLE "import" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_data" (
    "id" TEXT NOT NULL,
    "import_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "import_data" ADD CONSTRAINT "import_data_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
