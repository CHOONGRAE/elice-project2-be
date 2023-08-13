-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMeta" (
    "user_id" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "selected_answer_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMeta_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Follows" (
    "following_user_id" INTEGER NOT NULL,
    "followed_user_id" INTEGER NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("following_user_id","followed_user_id")
);

-- CreateTable
CREATE TABLE "Fandoms" (
    "id" SERIAL NOT NULL,
    "admin" INTEGER NOT NULL,
    "fandom_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fandoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscribes" (
    "user_id" INTEGER NOT NULL,
    "fandom_id" INTEGER NOT NULL,

    CONSTRAINT "Subscribes_pkey" PRIMARY KEY ("user_id","fandom_id")
);

-- CreateTable
CREATE TABLE "Feeds" (
    "id" SERIAL NOT NULL,
    "author" INTEGER NOT NULL,
    "fandom_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "user_id" INTEGER NOT NULL,
    "feed_id" INTEGER NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("user_id","feed_id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "feed_id" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL DEFAULT 0,
    "author" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SonminsuRequests" (
    "id" SERIAL NOT NULL,
    "author" INTEGER NOT NULL,
    "feed_id" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SonminsuRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SonminsuAnswers" (
    "id" SERIAL NOT NULL,
    "author" INTEGER NOT NULL,
    "request_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SonminsuAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SonminsuItems" (
    "id" SERIAL NOT NULL,
    "feed_id" INTEGER NOT NULL,
    "answer_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "registration" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SonminsuItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buckets" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "bucket_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Buckets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BucketItems" (
    "bucket_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,

    CONSTRAINT "BucketItems_pkey" PRIMARY KEY ("bucket_id","item_id")
);

-- CreateTable
CREATE TABLE "Files" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL DEFAULT 0,
    "fandom_id" INTEGER NOT NULL DEFAULT 0,
    "feed_id" INTEGER NOT NULL DEFAULT 0,
    "sonminsu_request_id" INTEGER NOT NULL DEFAULT 0,
    "sonminsu_item_id" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Files_user_id_key" ON "Files"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Files_fandom_id_key" ON "Files"("fandom_id");

-- CreateIndex
CREATE UNIQUE INDEX "Files_sonminsu_request_id_key" ON "Files"("sonminsu_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "Files_sonminsu_item_id_key" ON "Files"("sonminsu_item_id");

-- AddForeignKey
ALTER TABLE "UserMeta" ADD CONSTRAINT "UserMeta_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_following_user_id_fkey" FOREIGN KEY ("following_user_id") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followed_user_id_fkey" FOREIGN KEY ("followed_user_id") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fandoms" ADD CONSTRAINT "Fandoms_admin_fkey" FOREIGN KEY ("admin") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribes" ADD CONSTRAINT "Subscribes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribes" ADD CONSTRAINT "Subscribes_fandom_id_fkey" FOREIGN KEY ("fandom_id") REFERENCES "Fandoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeds" ADD CONSTRAINT "Feeds_author_fkey" FOREIGN KEY ("author") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeds" ADD CONSTRAINT "Feeds_fandom_id_fkey" FOREIGN KEY ("fandom_id") REFERENCES "Fandoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_author_fkey" FOREIGN KEY ("author") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuRequests" ADD CONSTRAINT "SonminsuRequests_author_fkey" FOREIGN KEY ("author") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuRequests" ADD CONSTRAINT "SonminsuRequests_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuAnswers" ADD CONSTRAINT "SonminsuAnswers_author_fkey" FOREIGN KEY ("author") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuAnswers" ADD CONSTRAINT "SonminsuAnswers_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "SonminsuRequests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuItems" ADD CONSTRAINT "SonminsuItems_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuItems" ADD CONSTRAINT "SonminsuItems_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "SonminsuAnswers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buckets" ADD CONSTRAINT "Buckets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketItems" ADD CONSTRAINT "BucketItems_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "Buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketItems" ADD CONSTRAINT "BucketItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "SonminsuItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserMeta"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_fandom_id_fkey" FOREIGN KEY ("fandom_id") REFERENCES "Fandoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_sonminsu_request_id_fkey" FOREIGN KEY ("sonminsu_request_id") REFERENCES "SonminsuRequests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_sonminsu_item_id_fkey" FOREIGN KEY ("sonminsu_item_id") REFERENCES "SonminsuItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
