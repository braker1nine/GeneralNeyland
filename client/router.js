BlazeLayout.setRoot('body');
/*FlowRouter.configure({
	layoutTemplate:'body',
	onBeforeAction: function(pause) {
		if (this.ready() && !Meteor.user() && this.route.options.requiresAuth !== false) {
			this.render('login');
			pause();
		}
	},
	waitOn: function() {
		return Meteor.subscribe('users');
	}
})*/

FlowRouter.route('/', {
	name: 'Home',
  action: function(params, queryParams) {
    BlazeLayout.render('layout', {main: 'home'});
  }
});

FlowRouter.route('/draft', {
	name: 'Draft',
	action: function(params, queryParams) {
		BlazeLayout.render('layout', { main: 'draft' });
	}
})

FlowRouter.route('/history', {
	name: 'History',
	action: function(params, queryParams) {
		BlazeLayout.render('layout', { main: 'history' });
	}
});

FlowRouter.route('/account', {
	name: 'Account',
	action: function(params, queryParams) {
		BlazeLayout.render('layout', { main: 'account' });
	}
});

FlowRouter.route('/dues', {
	name: 'Dues', 
	action: function(params, queryParams) {
		BlazeLayout.render('layout', { main: 'dues' });
	}
})

FlowRouter.route('/post/:postId/', {
	name: 'Post', 
	action: function(params, queryParams) {
		BlazeLayout.render('layout', { main: 'post' });
	}
})

/*
this.route('post', {
	path:'post/:post_id/',
	data: function() {
		if (this.ready()) {
			return Posts.findOne(this.params.post_id);
		}
	},
	waitOn: function() {
		return [Meteor.subscribe('current_post', this.params.post_id), Meteor.subscribe('comments', this.params.post_id)];
	}
});



FlowRouter.map(function() {
	this.route('home', {
		path:'/',
		onBeforeAction: function() {
			
		},
		waitOn: function() {
			return [Meteor.subscribe('recent_posts', Session.get('post_count')), Meteor.subscribe('users')]
		},

	});

	this.route('draft', {
		path:'/draft',
		waitOn: function() {
			return [Meteor.subscribe('drafts'), Meteor.subscribe('users')];
		},
		data: function() {
		}
	});

	this.route('history', {
		path:'/history'
	});

	this.route('account', {
		path:'/account',
	});

	this.route('dues', {
		path:'/dues'
	});

	this.route('post', {
		path:'post/:post_id/',
		data: function() {
			if (this.ready()) {
				return Posts.findOne(this.params.post_id);
			}
		},
		waitOn: function() {
			return [Meteor.subscribe('current_post', this.params.post_id), Meteor.subscribe('comments', this.params.post_id)];
		}
	});

	this.route('signup')
})*/