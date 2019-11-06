function orderNumber(input) {
	console.log(input.tagName, input.tagName == "BUTTON", input.value);
	input.value = (parseInt(input.value) > parseInt(input.max)) ? input.max : (Number.isNaN(parseInt(input.value)) || input.value == 0) ? 1 : input.value;

	let toDelete = (input.tagName == "BUTTON") ? true : false;
	let productid;
	let orderNumber;
	if (toDelete) {
		console.log("todelete");
		productid = input.value;
		orderNumber = 0;
		input.parentElement.remove();		
	}
	else {
		productid = input.dataset.productid;
		orderNumber = input.value;		
	}
	$.ajax({
		beforeSend: function(xhr, settings) {
			if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
				xhr.setRequestHeader("X-CSRFToken", token);
			}
		},
		url: "/numberChange/",
		type: "POST",
		data: {
			'toDelete': toDelete,
			'productid': productid,
			'orderNumber': orderNumber,
		},
		success: function (json) {
			orderData = json.bagProducts;
			addToBag(json.bagProducts);
			countCost();
			basketCounter();
		},
	});
}
let sum;
let shippingPrice = 0;
let costLabel;
if (window.matchMedia("(max-width: 768.5px)").matches) {
	costLabel = "Стоимость: ";
} else {
	costLabel = "";
	[].forEach.call(document.getElementsByClassName("priceLabel"), function(l) {
		l.style.display = "none";
	});
}
function countCost() {
	sum = 0;
	[].forEach.call(document.getElementsByClassName("cost"), function(el) {
		let cost = parseInt(el.previousElementSibling.children[1].textContent) * parseInt(el.parentElement.getElementsByClassName('orderNumber')[0].value);
		el.innerHTML = "<span>" + costLabel + "</span>" + "<span>" + cost + "</span>" + " руб.";
		sum += cost;
	});
	shippingPrice = (document.getElementById("shippingInput").value != "" && sum < 1500) ? 250 : 0;
	document.getElementById("orderSum").innerHTML = (sum > 0) ? sum  + shippingPrice + " руб." : "0 руб.";
	shipping();
}

function shipping() {
	document.getElementById("shipping").innerHTML = (sum >= 1500) ? "Вам доступна бесплатная доставка 😊" : "Доставить товар?";
	console.log(sum);
}

let orderCounter = true;
function makeOrder() {
	console.log(orderData);
	let costs = [];
	[].forEach.call(document.getElementsByClassName("cost"), function(cost) {
		console.log(parseInt(cost.innerHTML));
		costs.push(parseInt(cost.children[1].innerHTML));
	});
	console.log(costs);
	$.ajax({
		beforeSend: function(xhr, settings) {
			if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
				xhr.setRequestHeader("X-CSRFToken", token);
			}
		},
		url: "/makeOrder/",
		type: "POST",
		data: {
			costs: JSON.stringify(costs),
			orderData: JSON.stringify(orderData),
			phone: document.getElementById("phone").value,
			email: document.getElementById("email").value,
			shippingAdress: document.getElementById("shippingInput").value,
			shippingPrice: shippingPrice,
			sum: sum,
		},
		success: function (json) {
			if (orderCounter == true) {
				document.getElementById("notification").style.display = "block";
				let t = setTimeout(function(){ document.getElementById("notification").style.opacity = 1; }, 100);
				setTimeout(function(){ document.getElementById("notification").style.opacity = 0; }, 2000);
				setTimeout(function(){ document.getElementById("notification").style.display = "none"; }, 3000);
			}
			orderCounter = false;
		},
	});
}

window.onload = function() {
	countCost();
	basketCounter();
	shipping();
}