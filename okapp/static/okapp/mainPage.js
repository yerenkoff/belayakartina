let productsAmount = 10;

function loadMore() {
	let checkboxes = [];
	$("#loadMore").submit(function (event) {
		event.preventDefault();
		productsAmount += 10;
		console.log(checkboxes)
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
        	'productsAmount': productsAmount,
        	'checkboxes': JSON.stringify(checkboxes),
        },
        success: function (json) {
        	console.log("loaded", JSON.parse(json.lastItem));
        	getProducts(json);
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

function getProducts(json) {
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
		document.getElementsByClassName("product_container")[0].append(product_form);
	});
}

window.onload = function() {
	[].forEach.call(document.getElementsByClassName("productCategory"), function(p) {
		p.innerHTML = JSON.parse(p.innerHTML).join(", ");
	});
	basketCounter();
};