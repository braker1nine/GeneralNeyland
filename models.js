
// User Additions?
Posts = new Meteor.Collection('posts');
/* Post Model
{
	authorId: the userId of the author of the post
	targetUserId: the team who the writer is writing too. to use a facebook paradigm, whose wall its on. Defaults to the author
	content: Text
	created_at: Date it was created
	like: array of user Ids of likers (for UI since we have only 12 users, might always show photos)
	meh: same as above but for dislikes
	hate: 'hate hate hate'
	comments: array of commentIds
}

*/


Comments = new Meteor.Collection('comments');
/* Comment Model
{
	authorId: the userId of the author of the post
	content: Text
	created_at: Date it was created
	*cheers: array of user Ids of likers (for UI since we have only 12 users, might always show photos)
	*jeers: same as above but for dislikes
}

*/