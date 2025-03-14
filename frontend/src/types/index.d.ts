interface User {
  _id: ObjectId;
  email: string;
  fullName: string;
  profilePic?: string;
  createdAt: string;
}

interface Message {
  _id?: ObjectId;
  senderId?: ObjectId;
  recieverId?: ObjectId;
  text: string;
  image?: string | null;
  createdAt?: string;
}
