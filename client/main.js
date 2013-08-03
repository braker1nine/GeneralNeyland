Template.footer.events({
	'click li.logout':function(e) {
		Meteor.logout(function(error){
			 Router.navigate(window.location.pathname, {trigger:true});
			 Session.set('page', 'login');
		})
	}
})