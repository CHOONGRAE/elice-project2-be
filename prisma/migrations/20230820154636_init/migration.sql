-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "user_id" INTEGER NOT NULL,
    "user_name" TEXT,
    "nick_name" TEXT,
    "introduction" TEXT,
    "profile_image_url" TEXT,
    "birth_date" TEXT,
    "phone_number" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Follows" (
    "user_id" INTEGER NOT NULL,
    "follow_id" INTEGER NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("user_id","follow_id")
);

-- CreateTable
CREATE TABLE "Fandoms" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "fandom_name" TEXT NOT NULL,
    "thumbnail_image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fandoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FandomRanks" (
    "fandom_id" INTEGER NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FandomRanks_pkey" PRIMARY KEY ("fandom_id")
);

-- CreateTable
CREATE TABLE "FandomAnnouncements" (
    "id" SERIAL NOT NULL,
    "fandom_id" INTEGER,
    "user_id" INTEGER,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FandomAnnouncements_pkey" PRIMARY KEY ("id")
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
    "user_id" INTEGER,
    "fandom_id" INTEGER,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT ('1970-01-01T00:00:00.000Z'),

    CONSTRAINT "Feeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HashTags" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "HashTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedHashTags" (
    "feed_id" INTEGER NOT NULL,
    "hashTag_id" INTEGER NOT NULL,

    CONSTRAINT "FeedHashTags_pkey" PRIMARY KEY ("feed_id","hashTag_id")
);

-- CreateTable
CREATE TABLE "FeedImages" (
    "id" SERIAL NOT NULL,
    "feed_id" INTEGER,
    "url" TEXT NOT NULL,

    CONSTRAINT "FeedImages_pkey" PRIMARY KEY ("id")
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
    "feed_id" INTEGER,
    "parentId" INTEGER,
    "user_id" INTEGER,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT ('1970-01-01T00:00:00.000Z'),

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SonminsuRequests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SonminsuRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SonminsuRequestImages" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER,
    "url" TEXT NOT NULL,

    CONSTRAINT "SonminsuRequestImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SonminsuAnswers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "request_id" INTEGER,
    "content" TEXT NOT NULL,
    "choosed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SonminsuAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SonminsuItems" (
    "id" SERIAL NOT NULL,
    "feed_id" INTEGER,
    "answer_id" INTEGER,
    "origin_url" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "registration" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SonminsuItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buckets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
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
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "fandom_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT ('1970-01-01T00:00:00.000Z'),

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageFiles" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadedMessages" (
    "user_id" INTEGER NOT NULL,
    "fandom_id" INTEGER NOT NULL,
    "message_id" INTEGER NOT NULL,

    CONSTRAINT "ReadedMessages_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HashTags_tag_key" ON "HashTags"("tag");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_follow_id_fkey" FOREIGN KEY ("follow_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fandoms" ADD CONSTRAINT "Fandoms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FandomRanks" ADD CONSTRAINT "FandomRanks_fandom_id_fkey" FOREIGN KEY ("fandom_id") REFERENCES "Fandoms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FandomAnnouncements" ADD CONSTRAINT "FandomAnnouncements_fandom_id_fkey" FOREIGN KEY ("fandom_id") REFERENCES "Fandoms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FandomAnnouncements" ADD CONSTRAINT "FandomAnnouncements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribes" ADD CONSTRAINT "Subscribes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribes" ADD CONSTRAINT "Subscribes_fandom_id_fkey" FOREIGN KEY ("fandom_id") REFERENCES "Fandoms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeds" ADD CONSTRAINT "Feeds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeds" ADD CONSTRAINT "Feeds_fandom_id_fkey" FOREIGN KEY ("fandom_id") REFERENCES "Fandoms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedHashTags" ADD CONSTRAINT "FeedHashTags_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedHashTags" ADD CONSTRAINT "FeedHashTags_hashTag_id_fkey" FOREIGN KEY ("hashTag_id") REFERENCES "HashTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedImages" ADD CONSTRAINT "FeedImages_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuRequests" ADD CONSTRAINT "SonminsuRequests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuRequestImages" ADD CONSTRAINT "SonminsuRequestImages_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "SonminsuRequests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuAnswers" ADD CONSTRAINT "SonminsuAnswers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuAnswers" ADD CONSTRAINT "SonminsuAnswers_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "SonminsuRequests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuItems" ADD CONSTRAINT "SonminsuItems_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonminsuItems" ADD CONSTRAINT "SonminsuItems_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "SonminsuAnswers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buckets" ADD CONSTRAINT "Buckets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketItems" ADD CONSTRAINT "BucketItems_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "Buckets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketItems" ADD CONSTRAINT "BucketItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "SonminsuItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageFiles" ADD CONSTRAINT "MessageFiles_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadedMessages" ADD CONSTRAINT "ReadedMessages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
