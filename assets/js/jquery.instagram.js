(function($) {
	$.fn.instagram = function(options) {
		var that = this,
			apiEndpoint = "https://api.instagram.com/v1",
			settings = $.extend({
				hash: null,
				clientId: null,
				show: null,
				onLoad: null,
				onComplete: null,
				maxId: null,
				minId: null,
				nextUrl: null,
				imageSize: null,
				photoLink: true
			}, options);

		function createPhotoElement(photo)
		{
			var url = photo.images.thumbnail.url,
				html = '';

			if(settings.imageSize == 'low_resolution') {
				url = photo.images.low_resolution.url;
			} else if(settings.imageSize == 'thumbnail') {
				url = photo.images.thumbnail.url;
			} else if(settings.imageSize == 'standard_resolution') {
				url = photo.images.standard_resolution.url;
			}

			html += '<a href="'+photo.link+'" target="_blank">';
			html += '<img src="'+url+'">';
			html += '<div class="tags">';
			html += '<span class="label label-info">';
			html += photo.comments.count+' comments';
			html += '</span>';
			html += '<span class="label label-success">';
			html += photo.likes.count+' likes';
			html += '</span>';
			html += '</div>';
			html += '<br>';
			html += '</a>';

			return $('<li>')
					.attr('id', photo.id)
					.append(html);
		}

		function composeRequestURL()
		{
			var url = apiEndpoint,
				params = {};

			if(settings.nextUrl!==null) {
				return settings.nextUrl;
			}

			if(settings.hash!==null) {
				url += '/tags/'+settings.hash+'/media/recent'
			} else {
				url += '/media/popular';
			}

			params.client_id = settings.clientId;
			params.min_id = settings.minId;
			params.max_id = settings.maxId;
			params.count = settings.show;

			url += '?' + $.param(params);

			return url;
		}

		if(settings.onLoad!==null && typeof settings.onLoad=='function') {
			settings.onLoad();
		}

		this.html('<ul></ul>')

		$.ajax({
			type: 'GET',
			dataType: 'jsonp',
			cache: false,
			url: composeRequestURL(),
			success: function(res) {
				var length = typeof res.data !== 'undefined' ? res.data.length : 0,
					limit = settings.show!==null && settings.show<length ? settings.show : length;

				if(limit>0) {
					for(var i=0;i<limit;i++) {
						that.find('ul').append(createPhotoElement(res.data[i]));
					}
				}

				if(settings.onComplete!==null && typeof settings.onComplete=='function') {
					settings.onComplete(res.data, res);
				}
			}
		});

		return this;
	};
})(jQuery);