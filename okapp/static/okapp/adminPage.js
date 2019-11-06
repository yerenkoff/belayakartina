var src = document.getElementById("src");
var target = document.getElementById("target");

let addCategory_array = JSON.parse(document.getElementById("addCategory_array").textContent);
let addCategory_list = document.getElementById("addCategory_list");

let productsAmount = 10;

// -----------------------------------------------------
// SHOW IMAGE PREVIEW AFTER IT WAS CHOSEN IN FILE INPUT:
// -----------------------------------------------------
function showImage(src,target) {
	var fr=new FileReader();
	fr.onload = function() { 
		target.src = this.result; 
		target.style.display = "block";
	};
	src.addEventListener("change",function() {
		fr.readAsDataURL(src.files[0]);
	});
}
showImage(src,target);
// -----------------------------------------------------
// -----------------------------------------------------

// -----------------------------------------------------
// MAKE TREE FOR CATEGORIES CREATING PANEL:
// -----------------------------------------------------
addCategory_array.forEach(function(item){
	addCategory_makeTree(item);
});

function addCategory_makeTree(item) {
	let list = addCategory_list.getElementsByTagName("li");
	if (list.length > 0) {
		if (addCategory_list.querySelectorAll("[data-categoryUl='" + item[1] + "']")[0] === undefined) {
			let givenLi = addCategory_makeItem(item);
			let ul = document.createElement("ul");
			ul.appendChild(givenLi);
			ul.setAttribute("data-categoryUl", item[1]);
			let firstLi = document.createElement('li');
			firstLi.appendChild(ul);
			let parent = addCategory_list.querySelectorAll("[data-categoryName='" + item[1] + "']")[0];
			// parent.parentElement.appendChild(firstLi);
			parent.parentElement.insertBefore(firstLi, parent.nextSibling);
			// console.log(12);
		} else {
			let givenLi = addCategory_makeItem(item);
			let ul = addCategory_list.querySelectorAll("[data-categoryUl='" + item[1] + "']")[0];
			ul.appendChild(givenLi);
			// console.log(12);
		}
		// removeCategory_ajax();
	} else {
		let li = document.createElement("li");
		li.setAttribute("data-categoryName", item[0]);
		li.classList.add("givenLi");
		li.innerHTML = item[0] + `<form action="#/">
		<i class="material-icons">add_circle_outline</i>
		</form>`;
		addCategory_list.appendChild(li);
	}
	removeCategory_ajax();
}

function addCategory_makeItem(item) {
	let givenLi = document.createElement("li");
	givenLi.setAttribute("data-categoryName", item[0]);
	givenLi.classList.add("givenLi");
	givenLi.innerHTML = item[0] + `<form action="#/">
	<i class="material-icons">add_circle_outline</i>
	</form>
	<form method="post" action="">
	<input style="display: none;" type="text" class="removeCategory_name" value="` + item[0] + `">
	<input style="display: none;" type="text" class="removeCategory_parent" value="` + item[1] + `">
	<i class="material-icons removeCategory_submit">remove_circle_outline</i>
	</form>`;
	return givenLi;
}
// -----------------------------------------------------
// -----------------------------------------------------

// ----------------------------------
// SHOW FORM FOR NEW CATEGORY ADDING:
// ----------------------------------
function createCategoryForm(el) {
	let newInput = document.createElement("input");
	newInput.type = "text";
	newInput.required = true;
	newInput.name = "addCategory_name";
	newInput.id = "addCategory_name";
	let newButton = document.createElement("input");
	newButton.type = "submit";
	newButton.value = "Создать";
	let newElement = document.createElement("form");
	newElement.id = "addCategory_form";
	newElement.method = "post";
	// newElement.action = "/addCategory/";
	newElement.appendChild(newInput);
	newElement.appendChild(newButton);
	newElement.classList.add("catAddingForm");
	el.parentNode.insertBefore(newElement, el.nextSibling);
	newInput.focus();
	addCategory_ajax();
}

function createCategoryForm_listener() {
	[].forEach.call(document.getElementsByClassName("givenLi"), function(el) {
		el.getElementsByTagName("form")[0].onclick = function(event) {
			if (document.getElementsByClassName("catAddingForm")[0] && document.getElementsByClassName("catAddingForm")[0] == el.nextSibling) {
				document.getElementsByClassName("catAddingForm")[0].parentNode.removeChild(document.getElementsByClassName("catAddingForm")[0]);
			} else if (document.getElementsByClassName("catAddingForm")[0]) {
				document.getElementsByClassName("catAddingForm")[0].parentNode.removeChild(document.getElementsByClassName("catAddingForm")[0]);
				createCategoryForm(el);
			} else {
				createCategoryForm(el);
			}
		}
	});
}
createCategoryForm_listener();
// ----------------------------------
// ----------------------------------

function getProducts(json, toClean = true) {
	if (toClean) {
		document.getElementsByClassName("product_container")[0].innerHTML = '';
	}
	console.log(json.product_array);
	json.product_array.forEach(function(item){
		let product_img = document.createElement("img");
		product_img.src = item[2];
		let product_h3 = document.createElement("h3");
		product_h3.innerHTML = item[1];
		let product_price = document.createElement("h3");
		product_price.innerHTML = item[4] + " руб.";
		let product_h5 = document.createElement("h5");
		product_h5.innerHTML = item[3];
		let product_button = document.createElement("button");
		product_button.classList.add("product_remove");
		product_button.dataset.productdata = item[0];
		product_button.innerHTML = "Удалить";
		let product_input = document.createElement("input");
		product_input.type = "hidden";
		product_input.name = "csrfmiddlewaretoken";
		product_input.value = token;
		let product_form = document.createElement("form");
		product_form.action = "";
		product_form.enctype = "multipart/form-data";
		product_form.classList.add("product");
		product_form.append(product_input);
		product_form.append(product_img);
		product_form.append(product_h3);
		product_form.append(product_price);
		product_form.append(product_h5);
		product_form.append(product_button);
		document.getElementsByClassName("product_container")[0].append(product_form);
	});
	product_remove();
}

function remakeCategories(json) {
	document.getElementById("addCategory_list").innerHTML = '';
	json.addCategory_array.forEach(function(item){
		addCategory_makeTree(item);
	});
	createCategoryForm_listener();
	console.log(json.addCategory_array);
	let categories = document.getElementsByClassName("categories_nav");
	[].forEach.call(categories, function(element) {
		element.innerHTML = '';
		json.addCategory_array.slice(1).forEach(function(el) {
		let categoryInput = document.createElement("input");
		categoryInput.type = "checkbox";
		categoryInput.value = el[0];
		categoryInput.classList.add("categories_checkbox");
		// DATASET IS IMPORTANT:
		categoryInput.dataset.value = el[0]; 
		let categoryH5 = document.createElement("h5");
		categoryH5.classList.add("category__button");
		categoryH5.innerHTML = el[0];
		let categoryItem = document.createElement("div");
		categoryItem.classList.add("category");
		categoryItem.appendChild(categoryInput);
		categoryItem.appendChild(categoryH5);
		element.appendChild(categoryItem);
	});
	});
	makeSortable();
}

function addCategory_ajax() {
	$("#addCategory_form").submit(function (event) {
		event.preventDefault();
		$.ajax({
			beforeSend: function(xhr, settings) {
				if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", token);
            }
        },
        url: "/addCategory/",
        type: "POST",
        data: {
        	'addCategory_parent': $(this).prev().attr("data-categoryName"),
        	'addCategory_name': $('#addCategory_name').val()
        },
        success: function (json) {
        	remakeCategories(json);
        }
    });
		return false;
	});
}

function removeCategory_ajax() {
	$(".removeCategory_submit").click(function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		if (confirm('Вы точно хотите удалить категорию и субкатегории?')) {
			$.ajax({
				beforeSend: function(xhr, settings) {
					if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
						xhr.setRequestHeader("X-CSRFToken", token);
					}
				},
				url: "/removeCategory/",
				type: "POST",
				data: {
					'removeCategory_name': $(this).parent().find(".removeCategory_name").val(),
					'removeCategory_parent': $(this).parent().find(".removeCategory_parent").val()
				},
				success: function (json) {
					remakeCategories(json);
				},
			});
		}
		return false;
	});
}

function addProduct_ajax() {
	$("#addProduct_form").submit(function (event) {
		// we reset loadMore counter when add, sort or delete product. So we want to load first ten products again
		productsAmount = 10;
		event.preventDefault();
		let checkboxes = [];
		// we have two categories_nav for product adding in form and for sorting under the form
		$(".categories_nav:eq(0) .categories_checkbox").each(function(){
			if (this.checked) {
				checkboxes.push(this.value);				
			}
		});
		// form data is needed for image upload
		let formdata = new FormData();
		formdata.append("productName", $('#productName').val());
		formdata.append("src", document.getElementById("src").files[0]);
		formdata.append("category", JSON.stringify(checkboxes));
		formdata.append("price", $('#price').val());
		formdata.append("amount", $('#amount').val());
		formdata.append("description", $('#description').val());
		$.ajax({
			beforeSend: function(xhr, settings) {
				if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", token);
            }
        },
        url: "/addProduct/",
        type: "POST",
        data: formdata,
        processData: false,
        contentType: false,
        success: function (json) {
        	getProducts(json);
        }
    });
		return false;
	});
}
addProduct_ajax();

function product_remove() {
	$(".product_remove").click(function (e) {
		// we reset loadMore counter when add, sort or delete product. So we want to load first ten products again
		productsAmount = 10;
		e.preventDefault();
		e.stopImmediatePropagation();
		if (confirm('Вы точно хотите удалить продукт?')) {
			$.ajax({
				beforeSend: function(xhr, settings) {
					if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
						xhr.setRequestHeader("X-CSRFToken", token);
					}
				},
				url: "/product_remove/",
				type: "POST",
				data: {
					'removePost_id': $(this).attr('data-productdata'),
				},
				success: function (json) {
					getProducts(json);
				},
			});
		}
		return false;
	});
}
product_remove();

function sortProducts() {
	let checkboxes = [];
	$(".sortProducts_button").click(function (e) {
		// we reset loadMore counter when add, sort or delete product. So we want to load first ten products again
		productsAmount = 10;
		e.stopImmediatePropagation();
			if (this.checked) {
				// checkboxes.includes(this.value) ? console.log("includes") : checkboxes.push(this.value);
				if (!checkboxes.includes(this.value)) checkboxes.push(this.value);
			} else {
				checkboxes.splice(checkboxes.indexOf(this.value), 1);
			}
			console.log(checkboxes);
			$.ajax({
				beforeSend: function(xhr, settings) {
					if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
						xhr.setRequestHeader("X-CSRFToken", token);
					}
				},
				url: "/sortProducts/",
				type: "POST",
				data: {
					'checkboxes': JSON.stringify(checkboxes),
				},
				success: function (json) {
					getProducts(json);
					console.log(json.lastItem);
					if (JSON.parse(json.lastItem) == false) {
						console.log("YEEESSSS loadmore!");
						document.getElementById("loadMore").style.display = "block";
					}
				},
			});
		// return false;
	});
}
sortProducts();

function loadMore() {
	let checkboxes = [];
	$("#loadMore").submit(function (event) {
		event.preventDefault();
		// initially we output first ten products. Now on load more we want to get the following ten items(10 first plus ten more)
		productsAmount += 10;
		console.log("pr am", productsAmount);
		[].forEach.call(document.getElementsByClassName("sortProducts_button"), function(el) {
			if (el.checked) {
				if (!checkboxes.includes(el.value)) checkboxes.push(el.value);
			} else {
				if (checkboxes.includes(el.value)) checkboxes.splice(checkboxes.indexOf(el.value), 1);
			}
		});
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
        	getProducts(json, false);
        	if (JSON.parse(json.lastItem)) {
        		console.log("YEEESSSS loadmore none!");
        		document.getElementById("loadMore").style.display = "none";
        	}
        }
    });
		return false;
	});
}
loadMore();

// ----------------------------------
// HERE WE ARE ADDING SORTING PROPERTY TO CHECKBOXES:
// ----------------------------------

function makeSortable() {
	console.log(99);
	console.log(document.getElementsByClassName("products")[0].getElementsByClassName("categories_checkbox"));
	[].forEach.call(document.getElementsByClassName("products")[0].getElementsByClassName("categories_checkbox"), function(el) {
		el.classList.add("sortProducts_button");
		console.log(el.className);
	});
	sortProducts();
}

window.onload = function() {
	[].forEach.call(document.getElementsByClassName("productCategory"), function(p) {
		p.innerHTML = JSON.parse(p.innerHTML).join(", ");
	});
};