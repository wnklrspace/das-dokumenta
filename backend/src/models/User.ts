import mongoose, { Schema } from 'mongoose';

const User = new Schema({
	name: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	role: {
		type: String,
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'CommentObject',
		},
	],
	documents: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Document',
		},
	],
});

export default mongoose.model('User', User);
