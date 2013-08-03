Template.account.events({
	'click .change_password_button':function(e, tmpl) {
		var old = tmpl.find('.old_password').value,
			new1 = tmpl.find('.password1').value,
			new2 = tmpl.find('.password2').value;

		if (new1 == new2) {
			Accounts.changePassword(old, new1, function(err) {
				if (!err) {
					Router.navigate('/', true);
					Alert({text:'Password succesfully changed'});
				}
			})
		} else {
			alert('Passwords don\'t match');
		}
	},
	'change .no_email_checkbox':function(e, tmpl) {
		var checked = e.target.checked;

		Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.disableEmails":checked}}, function(err) {
			if (!err) {
				Alert({text:'Email settings updated.'});
			}
		});
	}
});

Template.account.isChecked = function() {
	var user = Meteor.user();
	if (user && user.profile && user.profile.disableEmails == true) {
		return ' checked';
	} else {
		return '';
	}
}