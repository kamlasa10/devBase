@@include('./libs.js');


// * GET PROMISE FUNC FOR AJAX REQUEST START
async function getPromise(data, url, parse) {
	let promise = new Promise(function (resolve, reject) {
		$.ajax({
			url: url,
			data: data,
			type: 'POST',
			global: false,
			async: true,
			success: function (res) {
				let data = (!parse) ? JSON.parse(res) : res
				resolve(data);
			},
			error: function (jqXHR, status, errorThrown) {
				reject(jqXHR);
			},
			beforeSend: function () {},
		});
	});

	return await promise;
}

(function ($) {
	class Tabs {
		constructor(tabsSelector, ContentSelector, activeClass) {
			this.tabs = document.querySelectorAll(tabsSelector)
			this.content = document.querySelector(ContentSelector)
			this.active = activeClass
			this.init()
		}

		showTabs(i) {
			this.tabs[i].classList.add(this.active)
		}

		hideTabs() {
			this.tabs.forEach(tab => tab.classList.remove(this.active))
		}

		init() {
			this.tabs.forEach((tab, i) => {
				tab.addEventListener('click', (e) => {
					e.preventDefault()
					this.hideTabs()
					this.showTabs(i)
				})
			})

			this.showTabs(0)
		}
	}
	$('.overlay').hide()

	new Tabs('.js-tabs__tab', '.tabs__content', 'tabs__tab--active')
	new Tabs('.js-tabs__tab-immovables', '.immovables__content', 'tabs__tab--active')

	$('.services').on('click', (e) => {
		if(e.target.classList.contains('js-services__list-item') || e.target.closest('.js-services__list-item')) {
			const parent = $(e.target.closest('.js-services__list-item'))
			const title = parent.find('.services__list-text').text()

			$('.overlay').find('.popup__title').text(title)
			$('.overlay').fadeIn()
			$('.overlay').css('z-index', 100)
		}
	})

	document.addEventListener('click', (e) => {
		if(e.target === $('.overlay')[0]) {
			$('.overlay').fadeOut()
		}
	})

	$('.js-popup__close').on('click', (e) => {
		e.stopImmediatePropagation()
		e.preventDefault()
		$('.overlay').fadeOut()
	})

	$(".js-services__info-range").ionRangeSlider({
		type: "double",
		min: 0,
        max: 1000,
        from: 0,
        to: 1000,
	});

	function isEmpty($node) {
		if($node.val()) {
			$node.addClass('date__content-input--valid')
			return true
		} else {
			$node.removeClass('date__content-input--valid')
			return false
		}
	}

	function templateHtml() {
		return `
			<div class="date__content-bottom-item">
				<div class="date__content-block">
				<input class="date__content-input" type="text" data-input="input" placeholder="Имя Вашего ребенка" name="childName">
				</div>
				<div class="date__content-block">
				<input class="date__content-input" type="text" data-input="input" placeholder="Возраст Вашего ребенка" name="childAge">
				</div>
			</div>
		`
	}

	function isInteractive(name, value) {
		if(value === 'yes') {
			$(`[data-content="${name}"]`).find('input').removeClass('date__content-input--disabled').attr('disabled', false)
			$(`[data-content="${name}"]`).find('.js-date__btn').removeClass('date__content-input--disabled').attr('disabled', false)
			return true
		} else {
			$(`[data-content="${name}"]`).find('input').addClass('date__content-input--disabled').attr('disabled', true)
			$(`[data-content="${name}"]`).find('.js-date__btn').addClass('date__content-input--disabled').attr('disabled', false)
			return false
		}
	}

	$('[data-input="input"]').each(function() {
		isEmpty($(this))
	})

	$('[data-content]').find('input').each(function() {
		$(this).addClass('date__content-input--disabled')
		$(this).attr('disabled', true)
	})

	$('[data-content]').find('.js-date__btn').attr('disabled', true)

	$('[data-input="input"]').each(function() {
		$(this).on('input', function(e) {
			isEmpty($(this))
		})
	})

	function createPreview(info, i) {
		return `
			<div data-preview-content="${i}" class="date__content-block-item">
				<button data-preview="${i}" class="date__content-delete" type="button">
				<svg class="icon--close" role="presentation">
					<use xlink:href="#icon-close"></use>
				</svg>
				</button>
				<img src="${window.URL.createObjectURL(info)}" title="foto" alt="foto"/>
			</div>
		`
	}

	function renderPreviewImg(files = {}) {
		const container = $('.date__content-block-wrap')
		let fragment = ''

		container.html('')

		if(Object.keys(files).length) {
			Object.keys(files).forEach((file, i) => {
				const item = createPreview(files[file], i)
				fragment += item
			})
		} else {
			fragment = `<p class="data__content-status">Немає завантажених сканів</p>`
		}
		
		container.append(fragment)
			
		try {
			$(`[data-preview]`).each(function() {
				$(this).on('click', function() {
					this.closest(`[data-preview-content]`).remove()
				})
			})
		} catch(e) {}
	}

	renderPreviewImg()

	$('.js-date').on('change', (e) => {
		const $target = $(e.target)

		if($target.attr('data-radio')  && $target.val()) {
			const name = $target.attr('data-radio')
			const value = $target.val()

			isInteractive(name, value)
		} else if($target.attr('data-file')) {
			renderPreviewImg(e.target.files)
		}
	})

	$('.js-date__btn').on('click', function() {
		console.log('click');
		$(this).before(templateHtml())
	})

})(jQuery);



// let svgDash = document.querySelector('.dashoffset');
// console.log(svgDash.querySelector('circle').getTotalLength());
// /*
// *stroke-dashoffset: 90;
//     stroke-dasharray: 90 90;

// */


function simulatePathDrawing(path,fillPercentage=100) {
    if (path.done) return;
    // var path = document.querySelector('.squiggle-animated path');
	var length = path.getTotalLength();
	path.style.fill = "none";
	path.style.transformBox = `fill-box`;
	path.style.transformOrigin = `center`;
	path.style.transform = `rotate(-90deg)`;
    // Clear any previous transition
    // path.style.transition = path.style.WebkitTransition =
        'none';
    // Set up the starting positions
    path.style.strokeDasharray = length*(fillPercentage/100) + ' ' + length;
    path.style.strokeDashoffset = 0;
    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    path.getBoundingClientRect();
    // Define our transition
    // path.style.transition = path.style.WebkitTransition =
    //     'stroke-dashoffset 1.5s ease-in-out';
    // Go!
    // path.style.strokeDashoffset = '0';
    path.style.strokeWidth = '3';
    path.style.stroke = '#F7F7F7';
    path.done = true;
}

simulatePathDrawing(document.querySelector('.progress-icon circle'),85)