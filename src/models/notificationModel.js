import mongoose from 'mongoose';

//define schema for user 

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if sub-account
    subAccountId: { type: String },
    update: String,
    title: String,
    description: String,
    read: { type: Boolean, default: false },  // ✅ Add this
    createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', NotificationSchema);

// Export the user model
export default Notification;