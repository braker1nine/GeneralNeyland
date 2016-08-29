Template.footer.events({
	'click li.logout':function(e) {
		Meteor.logout(function(error){
			 FlowRouter.navigate(window.location.pathname, {trigger:true});
			 Session.set('page', 'login');
		})
	}
})