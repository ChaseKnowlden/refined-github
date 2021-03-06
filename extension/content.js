/* globals gitHubInjection */
'use strict';
const path = location.pathname;
const isDashboard = path === '/';
const isRepo = /^\/[^/]+\/[^/]+/.test(location.pathname);
const isPR = () => /^\/[^/]+\/[^/]+\/pull\/\d+$/.test(location.pathname);
const repoName = path.split('/')[2];

function linkifyBranchRefs() {
	$('.commit-ref').each((i, el) => {
		const parts = $(el).find('.css-truncate-target');
		const username = parts.eq(0).text();
		const branch = parts.eq(1).text();
		$(el).wrap(`<a href="https://github.com/${username}/${repoName}/tree/${branch}">`);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	const username = $('meta[name="user-login"]').attr('content');

	// Hide other users starring/forking your repos
	if (isDashboard) {
		{
			const hideStarsOwnRepos = () => {
				$('#dashboard .news .watch_started, #dashboard .news .fork')
					.has(`.title a[href^="/${username}"`)
					.css('display', 'none');
			};

			hideStarsOwnRepos();

			new MutationObserver(() => hideStarsOwnRepos())
				.observe($('#dashboard .news').get(0), {childList: true});
		}

		// Expand all the news feed pages
		(function more() {
			const btn = $('.ajax-pagination-btn').get(0);

			if (!btn) {
				return;
			}

			btn.click();
			setTimeout(more, 200);
		})();
	}

	if (isRepo) {
		gitHubInjection(window, () => {
			if (isPR) {
				linkifyBranchRefs();
			}
		});
	}
});
