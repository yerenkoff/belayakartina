let productsAmount = 10;
let howToSort = !!document.getElementById("sortingForm") ? "-id" : "0";

function loadMore() {
	let checkboxes = !!document.getElementById("sortingForm") ? JSON.stringify(JSON.parse(document.getElementById("loadMore").dataset.forload)) : document.getElementById("loadMore").dataset.forload;
	$("#loadMore").submit(function (event) {
		event.preventDefault();
		productsAmount += 10;
		$.ajax({
			beforeSend: function(xhr, settings) {
				if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", token);
            }
        },
        url: "/loadMore/",
        type: "POST",
        data: {
        	'howToSort': howToSort,
        	'productsAmount': productsAmount,
        	'checkboxes': checkboxes,
        },
        success: function (json) {
        	getProducts(json, false);
        	if (JSON.parse(json.lastItem)) {
        		console.log(this);
        		document.getElementById("loadMore").style.display = "none";
        	}
        }
    });
		return false;
	});
}
loadMore();

function getProducts(json, toClean = true) {
	if (toClean) {
		document.getElementsByClassName("product_container")[0].innerHTML = '';
	}
	json.product_array.forEach(function(item){
		let product_img = document.createElement("img");
		product_img.src = item[2];
		let product_h2 = document.createElement("h2");
		product_h2.innerHTML = item[1];
		let product_price = document.createElement("h2");
		product_price.innerHTML = item[4] + " руб.";
		let product_h5 = document.createElement("h5");
		product_h5.innerHTML = item[3];
		let product_form = document.createElement("form");
		product_form.action = "";
		// product_form.enctype = "multipart/form-data";
		product_form.classList.add("main__product");
		// product_form.append(product_input);
		product_form.append(product_img);
		product_form.append(product_h2);
		product_form.append(product_price);
		product_form.append(product_h5);
		product_form.action = "/product/" + item[0];
		product_form.onclick = function() {this.submit();}
		document.getElementsByClassName("product_container")[0].append(product_form);
	});
}

function sortingForm() {
	let checkboxes = !!document.getElementById("sortingForm") ? JSON.parse(document.getElementById("sortingForm").dataset.sortingdata) : [];
	$(".sortingParameter").click(function (e) {
		productsAmount = 10;
		howToSort = $(this).attr('data-sortingparameter');
		this.parentElement.classList.remove("showDropdown");
		document.getElementById("sortingButton").innerHTML = this.value + "<span></span>";
		e.preventDefault();
		e.stopImmediatePropagation();
		$.ajax({
			beforeSend: function(xhr, settings) {
				if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
					xhr.setRequestHeader("X-CSRFToken", token);
				}
			},
			url: "/sort/",
			type: "POST",
			data: {
				'sortingparameter': $(this).attr('data-sortingparameter'),
				'checkboxes': JSON.stringify(checkboxes),
			},
			success: function (json) {
				getProducts(json);
				if (JSON.parse(json.lastItem) == false) {
					console.log("YEEESSSS loadmore");
					document.getElementById("loadMore").style.display = "block";
				}
			},
		});
		return false;
	});
}
sortingForm();

window.onload = function() {
	// humanize category title
	[].forEach.call(document.getElementsByClassName("productCategory"), function(p) {
		p.innerHTML = JSON.parse(p.innerHTML).join(", ");
	});
	basketCounter();
};