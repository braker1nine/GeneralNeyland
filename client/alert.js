Alert = function(params) {
	var alertEl = document.createElement('DIV');
	alertEl.className = 'alert pre';
	alertEl.innerHTML = params.text;
	document.body.appendChild(alertEl);

	setTimeout(function() {

		alertEl.addEventListener('transitionend', function onShow() {
			alertEl.removeEventListener('transitionend', onShow);
			setTimeout(function() {
				alertEl.addEventListener('transitionend', function onHide(){
					alertEl.removeEventListener('transitionend', onHide);
					document.body.removeChild(alertEl);
				});
				alertEl.classList.add('post')
			}, 4000);
		});
		alertEl.classList.remove('pre');
	}, 2);
} 