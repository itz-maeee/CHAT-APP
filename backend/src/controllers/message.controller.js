import User from '../models/user.model.js';
import Message from '../models/message.model.js';

import cloudinary from '../lib/cloudinary.js';
import { io } from '../lib/socket.js';
import { getReceiverSocketId } from '../lib/socket.js';

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Assuming req.user is populated by protectRoute middleware
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params; // Get the user ID from the request parameters
        const myId = req.user._id; // Get the sender ID from the authenticated user

        const messages = await Message.find({
            $or: [
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages: controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const { id: receiverId } = req.params; // Get the user ID from the request parameters
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            //Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        //todo: realtime functionality goes here => socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("receiveMessage", newMessage);
        }


        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage: controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}