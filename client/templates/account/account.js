Template.account.events({
	'click .change_password_button':function(e, tmpl) {
		var old = tmpl.find('.old_password').value,
			new1 = tmpl.find('.password1').value,
			new2 = tmpl.find('.password2').value;

		if (new1 == new2) {
			Accounts.changePassword(old, new1, function(err) {
				if (!err) {
					FlowRouter.navigate('/', true);
					Alert({text:'Password succesfully changed'});
				}
			})
		} else {
			Alert({text:'Passwords don\'t match'});
		}
	},
	'change .no_email_checkbox':function(e, tmpl) {
		var checked = e.target.checked;

		Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.disableEmails":checked}}, function(err) {
			if (!err) {
				Alert({text:'Email settings updated.'});
			}
		});
	},
	'click input.change_email': function(e, tmpl) {
		var newAddress = tmpl.find('.new_email').value;
		if (newAddress.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i)) {
			Meteor.call('update_email', newAddress, function(err, res) {
				if (err) {
					Alert({text:'Error'})
				} else {
					tmpl.find('input.new_email').value = '';
					Alert({text:'Email changed to ' + res});
				}
			});
		} else {
			Alert({text:'Invalid Email address'})
		}
	}
});

Template.account.helpers({

	gravatar: function() {
		var user = Meteor.user();
		return Gravatar.imageUrl(user.emails[0].address);
	},

	isChecked: function() {
		var user = Meteor.user();
		if (user && user.profile && user.profile.disableEmails == true) {
			return ' checked';
		} else {
			return '';
		}
	},
	current_email: function() {
		var user = Meteor.user();
		var email = '';
		if (user) {
			email = user.emails[0].address;
		}

		return email;
	}
});