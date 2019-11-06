// let addCategory_array = JSON.parse(document.getElementById("addCategory_array").textContent);

// document.getElementById("head").textContent = window.innerWidth;

[].forEach.call(document.querySelectorAll("[data-product-nav='drop']"), function(el) {
	if (el.children.length == 0) el.parentElement.removeChild(el);
});

if (window.matchMedia("(max-width: 768.5px)").matches) {
	document.getElementsByClassName("navigationBar")[0].style.height = window.innerHeight + "px";
}

[].forEach.call(document.getElementsByClassName("main__product__img"), function(el) {
	el.style.height = parseInt(window.getComputedStyle(el).getPropertyValue('width'), 10) * 3 / 4 + "px";
});

function toggleDrop(that) {
	[].forEach.call(document.querySelectorAll("[data-drop='drop']"), function(el) {
		el.dataset.drop = 0;
		if (el != that.nextElementSibling) {
			el.classList.remove("showDropdown");
		}
	});
	// we need here specify firstElementChild to avoid incorrect showSpan toggling for given .item span:     also we check .showSpan elements existence
	if (document.getElementsByClassName("showSpan")[0] && document.getElementsByClassName("showSpan")[0] != that.firstElementChild) {
		document.getElementsByClassName("showSpan")[0].classList.remove("showSpan");
		document.getElementsByClassName("highlightItem")[0].classList.remove("highlightItem");
	}
	that.nextElementSibling.classList.toggle("showDropdown");
	that.querySelector("span").classList.toggle("showSpan");
	that.classList.toggle("highlightItem");
	[].forEach.call(that.parentElement.getElementsByTagName("*"), function(el) {
		el.dataset.drop = "drop";
	});
}

function toggleNav(that) {
	document.getElementsByClassName("navigationBar")[0].classList.toggle("showNavigation");
	that.firstElementChild.classList.toggle("rotateMenu");
}

window.onclick = function(event) {
	document.getElementsByClassName("tools_answers")[0].style.maxHeight = "0px";
	if (event.target.dataset.drop != "drop" || event.target.className.includes("sortingParameter")) {
		[].forEach.call(document.querySelectorAll("[data-drop='drop']"), function(el) {
			el.dataset.drop = 0;
			el.classList.remove("showDropdown");
		});
		if (document.getElementsByClassName("showSpan")[0]) {
			document.getElementsByClassName("showSpan")[0].classList.remove("showSpan");
			document.getElementsByClassName("highlightItem")[0].classList.remove("highlightItem");			
		}
	}


	// we need to check if we click a .searchIcon or not
	if (event.target.parentElement.className.includes("searchIcon")) {
		// always toggle
		console.log("si");
		toggleIcon(document.getElementsByClassName("searchIcon")[0]);
	} else if (event.target.className.includes("modalSearch")) {
		// important
	} else {
		// check if .searchIcon has "close" or "search" textContent inside
		if (document.getElementsByClassName("searchIcon")[0].getElementsByTagName("img")[0].style.opacity == "0") {
			toggleIcon(document.getElementsByClassName("searchIcon")[0]);
		}
	}
}

function toggleIcon(that) {
	if (that.getElementsByTagName("img")[1].style.opacity == "0") {
		console.log(that.getElementsByTagName("img")[0]);
		that.getElementsByTagName("img")[0].style.opacity = "0";
		that.getElementsByTagName("img")[1].style.opacity = "1";
		document.getElementsByClassName("modalSearch")[1].focus();
	} else {
		that.getElementsByTagName("img")[1].style.opacity = "0";
		that.getElementsByTagName("img")[0].style.opacity = "1";
	}
}

// function toggleIcon(that) {
// 	if (that.textContent == "search") {
// 		let searchString = that.innerHTML.split(/(?=<)/g);
// 		searchString[0] = "close";
// 		that.style.opacity = 0;
// 		setTimeout(function() {
// 			that.innerHTML = searchString.join("");
// 			that.style.opacity = 1;
// 		}, 300);
// 		document.getElementsByClassName("modalSearch")[1].focus();
// 	} else {
// 		let searchString = that.innerHTML.split(/(?=<)/g);
// 		searchString[0] = "search";
// 		that.style.opacity = 0;
// 		setTimeout(function() {
// 			that.innerHTML = searchString.join("");
// 			that.style.opacity = 1;
// 		}, 300);
// 		document.getElementsByClassName("tools_answers")[0].style.maxHeight = "0px";
// 		// document.getElementsByClassName("tools_answers")[0].style.opacity = "0";
// 		console.log(document.getElementsByClassName("tools_answers")[0]);
// 	}
// }

// now we are making our header to be sticky on window scroll. If the scroll height over than 120px we make the header sticky
let scrollY = 0;
let scrollUp = 0;
let scrollDown = 0;
// window scroll distance in pixels when header should shrink
let scrollDelta = 200;
// window.onscroll = function () {
// 	console.log(111);
// }
window.onscroll = function() {
	// console.log(this.scrollY, scrollY);
	
	// console.log(this.scrollY % 100);
	scrollUp = (this.scrollY < scrollY) ? 0:scrollUp+(this.scrollY - scrollY);
	scrollDown = (this.scrollY < scrollY) ? scrollDown+(scrollY - this.scrollY):0;
	// console.log(this.scrollY, scrollY, scrollUp, scrollDown);
	if (this.scrollY > scrollDelta && scrollDown > 200) {
		// console.log(this.scrollY, scrollDelta);
		// console.log(window.getComputedStyle(document.querySelector("header")).getPropertyValue("opacity"));
		// document.querySelector("header").style.position = "fixed";
		if (window.matchMedia("(max-width: 768.5px)").matches) {
			document.querySelector("header").style.transform = "translateY(0px)";
		} else {
			document.querySelector("header").style.transform = "translateY(-70px)";
		}
		// document.querySelector("header").style.transform = "translateY(30px)";
		// document.querySelector("header").style.position = "fixed";
		// document.querySelector("header").classList.add("goSticky");
		// console.log("ee", window.clientY);
		// setTimeout(function() {
		// 	document.querySelector("header").style.opacity = 1;
		// 	console.log(99);
		// }, 5000);
	} else if (this.scrollY > scrollDelta && scrollUp > 200) {
		// document.querySelector("header").style.position = "absolute";
		// document.querySelector("header").style.top = 0;
		// document.querySelector("header").style.transform = "translateY(-70px)";
		if (window.matchMedia("(max-width: 768.5px)").matches) {
			document.querySelector("header").style.transform = "translateY(-60px)";
		} else {
			document.querySelector("header").style.transform = "translateY(-110px)";
		}
		// document.querySelector("header").style.transform = "translateY(-110px)";
		// console.log(191);
		[].forEach.call(document.querySelectorAll("[data-drop='drop']"), function(el) {
			el.dataset.drop = 0;
			// console.log(99);
			el.classList.remove("showDropdown");
		});
		if (document.getElementsByClassName("showSpan")[0]) {
			document.getElementsByClassName("showSpan")[0].classList.remove("showSpan");
			document.getElementsByClassName("highlightItem")[0].classList.remove("highlightItem");
			if (document.getElementsByClassName("searchIcon")[0].getElementsByTagName("img")[0].style.opacity == "0") {
			toggleIcon(document.getElementsByClassName("searchIcon")[0]);
			}
		}
		// document.querySelector("header").classList.remove("goSticky");		
	} else if (this.scrollY < scrollDelta) {
		// document.querySelector("header").style.transform = "none";
		// setTimeout(function(){
			// document.querySelector("header").style.position = "absolute";
			document.querySelector("header").style.transform = "translateY(0px)";
		// }, 300);
	}
	scrollY = this.scrollY;
};

[].forEach.call(document.getElementsByClassName("bag"), function(bagItem) {
	bagItem.onmouseenter = function() {
		document.body.style.overflow = "hidden";
	}
	bagItem.onmouseleave = function() {
		document.body.style.overflow = "visible";
	}
	bagItem.ontouchstart = function() {
		document.body.style.overflow = "hidden";
	}
	bagItem.ontouchend = function() {
		document.body.style.overflow = "visible";
	}
});

let sliderCounter = 0;
let sliderClick = 0;
let sliderDelay = 300;
let imageTransformations;

if (window.matchMedia("(max-width: 768.5px)").matches) {
	imageTransformations = [{transform: "translateX(-200%)", opacity: 0}, {transform: "translateX(calc(-100% + 10px))", opacity: 1}, {transform: "translateX(calc(0% + 20px))", opacity: 1}, {transform: "translateX(calc(100% + 30px))", opacity: 1}, {transform: "translateX(200%)", opacity: 0}];
} else {
	imageTransformations = [{transform: "translateX(-100%)", opacity: 0}, {transform: "translateX(0%)", opacity: 1}, {transform: "translateX(calc(100% + 10px))", opacity: 1}, {transform: "translateX(calc(200% + 20px))", opacity: 1}, {transform: "translateX(300%)", opacity: 0}];
}

function sliderMove(buttonVal) {
	if (sliderClick >= (Date.now() - sliderDelay)) return;
	sliderClick = Date.now();
	sliderCounter += parseInt(buttonVal);
	let sliderInner = sliderCounter;
	[].forEach.call(document.getElementsByClassName("sliderForm"), function(sliderImage) {
		// sliderImage.style.transform = imageTransformations[((sliderInner%5)+5)%5];
		Object.assign(sliderImage.style, imageTransformations[((sliderInner%5)+5)%5]);
		sliderInner += 1;
	});
}
sliderMove(0);

function searchPanel() {
	$(".searchForm_input").keyup(function(){
		event.preventDefault();
		console.log($(this).val());
		$.ajax({
			beforeSend: function(xhr, settings) {
				if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", token);
            }
        },
        url: "/search/",
        type: "POST",
        data: {
        	'searchParameter': this.value.length > 0 ? this.value : "𖠊",
        },
        success: function (json) {
        	document.getElementsByClassName("tools_answers")[0].innerHTML = '';
        	console.log(json.products_array);
        	json.products_array.forEach(function(search_item) {
        		$(".tools_answers").css({'max-height':'210px'});
        		let newSpan = document.createElement("span");
        		newSpan.innerHTML = " - " + search_item[1];
        		let newItem = document.createElement("button");
        		// newItem.type = "submit";
        		newItem.classList.add("answers_input");
        		newItem.dataset.productid = search_item[2];
        		newItem.innerHTML = '"' + search_item[0] + '"';
        		newItem.append(newSpan);
        		newItem.onclick = function(e) {
        			e.preventDefault();
        			e.stopImmediatePropagation();
        			location.href = "/product/" + newItem.dataset.productid + "?";
        		}
        		document.getElementsByClassName("tools_answers")[0].append(newItem);
        	});
	        }
	    });
		return false;
	});
}
searchPanel();

let timeoutCounter = true;
function toBag() {
	$(".toBag").click(function (e) {
		// e.preventDefault();
		// console.log(this.checked);
		e.stopImmediatePropagation();
		$.ajax({
			beforeSend: function(xhr, settings) {
				if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
					xhr.setRequestHeader("X-CSRFToken", token);
				}
			},
			url: "/toBag/",
			type: "POST",
			data: {
				'productid': this.dataset.tobag,
			},
			success: function (json) {
				addToBag(json.bagProducts);
				basketCounter();
				if (timeoutCounter == true) {
					document.getElementById("notification").style.display = "block";
					let t = setTimeout(function(){ document.getElementById("notification").style.opacity = 1; }, 100);
					setTimeout(function(){ document.getElementById("notification").style.opacity = 0; }, 2000);
					setTimeout(function(){ document.getElementById("notification").style.display = "none"; }, 3000);
				}
				timeoutCounter = false;
				// clearTimeout(t);
			},
		});
		// return false;
	});
}
toBag();

function addToBag(bagProducts) {
	// console.log(json);
	[].forEach.call(document.getElementsByClassName("bag__items"), function(bag) {
		bag.innerHTML = '';
		let total_price = 0;
		bagProducts.forEach(function(item) {
			// console.log(item);
			let bag__h5 = document.createElement("h5");
			bag__h5.innerHTML = '"' + item[1] + '"';
			let bag__amount = document.createElement("h5");
			bag__amount.classList.add("bag__amount");
			bag__amount.innerHTML = item[3] + " шт.";
			let bag__price = document.createElement("div");
			bag__price.innerHTML = item[2] + " руб.";
			bag__price.classList.add("bag__price");
			let bag__item = document.createElement("a");
			bag__item.classList.add("bag__item");
			bag__item.href = "/product/" + item[0] + "?";
			bag__item.appendChild(bag__h5);
			bag__item.appendChild(bag__price);
			bag__item.appendChild(bag__amount);
			bag.appendChild(bag__item);
			total_price += item[2];
		});

		// console.log(bag.parentElement);
		bag.parentElement.getElementsByClassName("total_price")[0].innerHTML = total_price + " руб.";
	});
}

document.getElementById("doSearch").onclick = function(event) {
	console.log(99);
	event.preventDefault();
	let searchQuery = document.getElementsByClassName("searchForm_input")[0].value.length > 0 ? document.getElementsByClassName("searchForm_input")[0].value : "𖠊";
	// location.href = "{% url 'searchResult' '" + searchQuery + "' %}";
	location.href = "/searchResult/" + searchQuery;
}

function basketCounter() {
	[].forEach.call(document.getElementsByClassName('basketCounter'), function(c) {
		c.innerHTML = document.getElementsByClassName('bag__items')[1].children.length;
	});
}

// console.log(addCategory_array);

// addCategory_array.forEach(function(item) {
// 	console.log(item[0]);
// 	if (item[1] == "Панель") {
// 		let newItem = document.createElement("div");
// 		newItem.classList.add("item");
// 		newItem.onclick = function () {toggleDrop(this)};
// 		newItem.innerHTML = item[0] + "<span></span>";
// 		let newSection = document.createElement("section");
// 		newSection.appendChild(newItem);
// 		document.getElementsByClassName("navigationBar")[0].appendChild(newSection);
// 	}
// });

// function makePanel(a) {
// 	console.log();
// }
// makePanel(addCategory_array);

