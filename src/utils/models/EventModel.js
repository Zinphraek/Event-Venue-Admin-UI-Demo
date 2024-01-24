export const EventLikesDislikes = {
  id: "",
  likes: "",
  dislikes: "",
  event: "",
};

export const EventMedia = {
  id: "",
  blobName: "",
  eventId: "",
  mediaType: "",
  mediaUrl: "",
  size: "",
  type: "",
};

export const EventComment = {
  id: "",
  content: "",
  userId: "",
  event: "",
  basedCommentId: "",
};

export const EventModel = {
  id: "",
  title: "",
  description: "",
  active: false,
  likesDislikes: EventLikesDislikes,
  eventMedia: [EventMedia],
  comments: [EventComment],
};

export const EventKeyName = {
  id: "ID",
  title: "Title",
  likes: "Likes",
  dislikes: "Dislikes",
  comments: "Comments",
  tools: "Tools",
};
