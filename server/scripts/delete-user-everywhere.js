import "dotenv/config";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const targetName = process.env.DELETE_USER_FULL_NAME?.trim();
const confirmation = process.env.DELETE_USER_CONFIRM?.trim();

if (!targetName) {
  throw new Error("Set DELETE_USER_FULL_NAME to the exact full name to remove.");
}

if (confirmation !== `DELETE ${targetName}`) {
  throw new Error(`Set DELETE_USER_CONFIRM="DELETE ${targetName}" to confirm.`);
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const publicIdFromCloudinaryUrl = (url) => {
  if (!url) return null;

  try {
    const { pathname } = new URL(url);
    const uploadMarker = "/upload/";
    const uploadIndex = pathname.indexOf(uploadMarker);
    if (uploadIndex === -1) return null;

    let assetPath = pathname.slice(uploadIndex + uploadMarker.length);
    assetPath = assetPath.replace(/^v\d+\//, "");
    return assetPath.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

const deleteCloudinaryAsset = async (url) => {
  const publicId = publicIdFromCloudinaryUrl(url);
  if (!publicId) return;

  const result = await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });

  if (!["ok", "not found"].includes(result.result)) {
    throw new Error(`Cloudinary failed to delete ${publicId}: ${result.result}`);
  }
};

try {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);

  const users = await User.find({
    fullName: { $regex: `^${escapeRegExp(targetName)}$`, $options: "i" },
  });

  if (users.length === 0) {
    throw new Error(`No user named "${targetName}" was found.`);
  }

  if (users.length > 1) {
    throw new Error(
      `Found ${users.length} users named "${targetName}". Refusing an ambiguous deletion.`,
    );
  }

  const user = users[0];
  const messages = await Message.find({
    $or: [{ senderId: user._id }, { receiverId: user._id }],
  });

  const cloudinaryUrls = [
    user.profilePic,
    ...messages.map((message) => message.image),
  ].filter(Boolean);

  for (const url of [...new Set(cloudinaryUrls)]) {
    await deleteCloudinaryAsset(url);
  }

  const messageResult = await Message.deleteMany({
    $or: [{ senderId: user._id }, { receiverId: user._id }],
  });
  await User.deleteOne({ _id: user._id });

  console.log(
    `Deleted "${user.fullName}" (${user.email}), ${messageResult.deletedCount} messages, and ${cloudinaryUrls.length} Cloudinary image reference(s).`,
  );
} finally {
  await mongoose.disconnect();
}
