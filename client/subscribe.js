
// User Additions?
Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');


Comments = new Meteor.Collection('comments');
CommentsHandle = Meteor.subscribe('comments');
