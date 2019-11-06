from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import *
from django.http import HttpResponse
import json
from django.contrib.sessions.models import Session
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

@login_required(login_url='/login/')
def admin(request):
	# this makes initial "Panel" object for Categories
	if (ProductCategory.objects.filter(category="Панель").exists() == False):
		initialCategory = ProductCategory(category="Панель", parent=0)
		initialCategory.save()
	# array of categories transferred to template
	addCategory_array = []
	for i in ProductCategory.objects.all():
		addCategory_array.append([i.category, i.parent])
	context = {
		# this collection is for making category tree with JS
		'addCategory_array': str(addCategory_array).replace("'", '"'),
		# this collection is for two template loops
		'categories': ProductCategory.objects.exclude(category="Панель"),
		'products': Product.objects.all().order_by('-id')[:10]
	}
	return render(request, 'okapp/admin.html', context=context)

def exit(request):
	logout(request)
	return redirect('/login/')

def addCategory(request):
	# create category only if it is not exist
	if ProductCategory.objects.filter(category=request.POST.get('addCategory_name', '')).count() == False:
		newCategory = ProductCategory(category=request.POST.get('addCategory_name', ''), parent=request.POST.get('addCategory_parent', ''))
		newCategory.save()
	# make category array to create category tree with JS
	addCategory_array = []
	for i in ProductCategory.objects.all():
		addCategory_array.append([i.category, i.parent])
	response_data = {
		'addCategory_array': addCategory_array,
	}
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def removeCategories(parent):
	children = ProductCategory.objects.filter(parent=parent)
	if children:
		for child in children:
			removeCategories(child.category)
			child.delete()

def removeCategory(request):
	category = ProductCategory.objects.get(category=request.POST.get('removeCategory_name', ''), parent=request.POST.get('removeCategory_parent', ''))
	removeCategories(category.category)
	category.delete()
	# make category array to create category tree with JS
	addCategory_array = []
	for i in ProductCategory.objects.all():
		addCategory_array.append([i.category, i.parent])
	response_data = {
		'addCategory_array': addCategory_array,
	}
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def addProduct(request):
	# create new product object
	product = Product(name=request.POST.get("productName"), photo=request.FILES.get('src', False), price=request.POST.get("price"), category=request.POST.get("category"), amount=request.POST.get("amount"), description=request.POST.get("description"))
	product.save()
	# make array for getProducts() Javascript function
	product_array = []
	for i in Product.objects.all().order_by('-id')[:10]:
		product_array.append([i.id, i.name, i.photo.url, ", ".join(json.loads(i.category)), i.price])
	response_data = {
		'product_array': product_array,
	}
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def product_remove(request):
	product = Product.objects.get(id=request.POST.get("removePost_id")).delete()
	product_array = []
	for i in Product.objects.all().order_by('-id')[:10]:
		product_array.append([i.id, i.name, i.photo.url, ", ".join(json.loads(i.category)), i.price])
	response_data = {
		'product_array': product_array,
	}
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def sortProducts(request):
	product_array = []
	lastItem = False
	for i in Product.objects.order_by('-id'):
		if set(json.loads(request.POST.get("checkboxes"))).issubset(json.loads(i.category)):
			lastProduct = [i.id, i.name, i.photo.url, ", ".join(json.loads(i.category)), i.price]
			product_array.append(lastProduct)
	product_array = product_array[:10]
	if list(reversed(product_array))[0] == lastProduct:
		lastItem = True
		print(lastItem)
	response_data = {
		'product_array': product_array,
		'lastItem': lastItem,
	}
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def index(request):
	# addCategory_array = []
	# for i in (i for i in ProductCategory.objects.all() if i.category != "Панель"):
	# 	addCategory_array.append([i.category, i.parent])
	if 'bagProducts' in request.session:
		bagProducts = request.session['bagProducts']
	else:
		bagProducts = []
	context = {
		# 'addCategory_array': str(addCategory_array).replace("'", '"'),
		'products': Product.objects.all().order_by('-id')[:10],
		'categories': ProductCategory.objects.all(),
		'items': ProductCategory.objects.filter(parent="Панель"),
		'bagProducts': bagProducts,
	}
	return render(request, 'okapp/index.html', context=context)

def loadMore(request):
	product_array = []
	lastItem = False
	print(request.POST.get("checkboxes"), "-----------------------ppppp", request.POST.get("howToSort"))
	# search page
	if request.POST.get("howToSort") == "0":
		howToSort = "-id"
		filterCategory = Product.objects.filter(name__icontains=request.POST.get("checkboxes"))
		for i in Product.objects.order_by(howToSort):
			if request.POST.get("checkboxes") in i.name:
				lastProduct = [i.id, i.name, i.photo.url, ", ".join(json.loads(i.category)), i.price]
				# [int(request.POST.get("productsAmount")) - 10:int(request.POST.get("productsAmount"))]
				product_array.append(lastProduct)
	# admin page
	elif request.POST.get("howToSort") == None:
		howToSort = "-id"
		# filterCategory = Product.objects.filter(category__contains=json.loads(request.POST.get("checkboxes")))
		filterCategory = set(json.loads(request.POST.get("checkboxes")))
		for i in Product.objects.order_by(howToSort):
			if filterCategory.issubset(json.loads(i.category)):
				lastProduct = [i.id, i.name, i.photo.url, ", ".join(json.loads(i.category)), i.price]
				# [int(request.POST.get("productsAmount")) - 10:int(request.POST.get("productsAmount"))]
				product_array.append(lastProduct)
	# feed page
	else:
		print("heheheheheheheheheheh")
		howToSort = request.POST.get("howToSort")
		# filterCategory = Product.objects.filter(category__contains=json.loads(request.POST.get("checkboxes")))
		filterCategory = set(json.loads(request.POST.get("checkboxes")))
		for i in Product.objects.order_by(howToSort):
			if filterCategory.issubset(json.loads(i.category)):
				lastProduct = [i.id, i.name, i.photo.url, ", ".join(json.loads(i.category)), i.price]
				# [int(request.POST.get("productsAmount")) - 10:int(request.POST.get("productsAmount"))]
				product_array.append(lastProduct)
	
	# print("----")
	# print(int(request.POST.get("productsAmount")))
	# print(howToSort)
	# print(filterCategory)
	# print("----")
	# for i in Product.objects.order_by(howToSort):
	# 	if filterCategory.issubset(json.loads(i.category)):
	# 		lastProduct = [i.id, i.name, i.photo.url, ", ".join(json.loads(i.category)), i.price]
	# 		# [int(request.POST.get("productsAmount")) - 10:int(request.POST.get("productsAmount"))]
	# 		product_array.append(lastProduct)
		# print(str(i) + "--------------------------------")
		# print(str(Product.objects.filter(category__contains=json.loads(request.POST.get("checkboxes"))).order_by(howToSort).reverse()[0]) + "================")
			
	product_array = product_array[int(request.POST.get("productsAmount")) - 10:int(request.POST.get("productsAmount"))]
	if list(reversed(product_array))[0] == lastProduct:
		lastItem = True
		print(lastItem)
	print(int(request.POST.get("productsAmount")) - 10, request.POST.get("productsAmount"))
	response_data = {
		'lastItem': lastItem,
		'product_array': product_array,
	}
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def feed(request, item, subitem):
	print(item+"-----------"+subitem)
	if subitem == "Все товары":
		products = Product.objects.filter(category__contains=item).order_by('-id')[:10]
		forLoad = str([item]).replace("'", '"')
	else:
		products = Product.objects.filter(category__contains=subitem).order_by('-id')[:10]
		forLoad = str([item, subitem]).replace("'", '"')
	print(products)
	if 'bagProducts' in request.session:
		bagProducts = request.session['bagProducts']
	else:
		bagProducts = []
	context = {
		'forLoad': forLoad,
		'subitem': subitem,
		'item': item,
		'products': products,
		'categories': ProductCategory.objects.all(),
		'items': ProductCategory.objects.filter(parent="Панель"),
		'bagProducts': bagProducts,
	}
	return render(request, 'okapp/feed.html', context=context)

def sort(request):
	product_array = []
	lastItem = False
	for i in Product.objects.order_by(request.POST.get("sortingparameter")):
		print(9)
		if set(json.loads(request.POST.get("checkboxes"))).issubset(json.loads(i.category)):
			lastProduct = [i.id, i.name, i.photo.url, ", ".join(json.loads(i.category)), i.price]
			product_array.append(lastProduct)
	print(product_array)
	product_array = product_array[:10]
	if list(reversed(product_array))[0] == lastProduct:
		lastItem = True
		print(lastItem)
	response_data = {
		'product_array': product_array,
		'lastItem': lastItem,
	}
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def search(request):
	print(request.POST.get("searchParameter"))
	products_array = []
	for i in Product.objects.filter(name__icontains=request.POST.get("searchParameter")).order_by('-id')[:5]:
		products_array.append([i.name, ", ".join(json.loads(i.category)), i.id])

	response_data = {
		'products_array': products_array,
	}
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def searchResult(request, item):
	if 'bagProducts' in request.session:
		bagProducts = request.session['bagProducts']
	else:
		bagProducts = []
	context = {
		'forLoad': item,
		'products': Product.objects.filter(name__icontains=item).order_by('-id')[:10],
		'categories': ProductCategory.objects.all(),
		'items': ProductCategory.objects.filter(parent="Панель"),
		'bagProducts': bagProducts,
	}
	return render(request, 'okapp/searchResults.html', context=context)

def product(request, productid):
	# print(productid + "========================ITEM")
	if len(Product.objects.filter(category__contains=Product.objects.get(id=productid).category).exclude(id=productid).order_by('-id')[:5]) < 5:
		products = Product.objects.all().order_by('?')[:5]
	else:
		products = Product.objects.filter(category__contains=Product.objects.get(id=productid).category).exclude(id=productid).order_by('?')[:5]
	if 'bagProducts' in request.session:
		bagProducts = request.session['bagProducts']
	else:
		bagProducts = []
	context = {
		'products': products,
		'product': Product.objects.get(id=productid),
		'categories': ProductCategory.objects.all(),
		'items': ProductCategory.objects.filter(parent="Панель"),
		'bagProducts': bagProducts,
	}
	return render(request, 'okapp/productPage.html', context=context)

def toBag(request):
	bagProducts = request.session.get('bagProducts', [])
	item_id = Product.objects.get(id=request.POST.get("productid")).id
	item_name = Product.objects.get(id=request.POST.get("productid")).name
	item_price = Product.objects.get(id=request.POST.get("productid")).price
	item_number = '1'
	item_amount = Product.objects.get(id=request.POST.get("productid")).amount
	item_array = [item_id, item_name, item_price, item_number, item_amount]
	if item_id not in [i[0] for i in bagProducts]:
		bagProducts.append(item_array)
	request.session['bagProducts'] = bagProducts
	# bagProducts.append(1)
	# request.session['bagProducts'] = bagProducts
	# productList = []
	# productList.append(request.POST.get("productid"))
	# request.session['bagProducts'] = Product.objects.filter(id__in=productList)
	print(bagProducts)
	response_data = {
		'bagProducts': bagProducts,
	}
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def numberChange(request):
	print(request.session['bagProducts'])
	bagProducts = request.session['bagProducts']
	print("==========================")
	print(bagProducts[0][0] == int(request.POST.get("productid")))
	print(request.POST.get("toDelete"))
	print([product for product in bagProducts if int(request.POST.get("productid")) == product[0]])
	print("==========================")
	
	if request.POST.get("toDelete") == "true":
		changedItem = [product for product in bagProducts if int(request.POST.get("productid")) == product[0]]
		bagProducts.remove(changedItem[0])
		print("DELETEEEEEEEEEEEEEEE")
	else:
		changedItem = [product for product in bagProducts if int(request.POST.get("productid")) == product[0]]
		bagProducts[bagProducts.index(changedItem[0])][3] = request.POST.get("orderNumber")
	request.session['bagProducts'] = bagProducts
	print(bagProducts)
	response_data = {
		'bagProducts': bagProducts,
	}
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def order(request):
	if 'bagProducts' in request.session:
		bagProducts = request.session['bagProducts']
	else:
		bagProducts = []
	print(bagProducts)
	context = {
		'categories': ProductCategory.objects.all(),
		'items': ProductCategory.objects.filter(parent="Панель"),
		'bagProducts': bagProducts,
	}
	return render(request, 'okapp/order.html', context=context)

@login_required(login_url='/login/')
def admin(request):
	if (ProductCategory.objects.filter(category="Панель").exists() == False):
		initialCategory = ProductCategory(category="Панель", parent=0)
		initialCategory.save()
	addCategory_array = []
	for i in ProductCategory.objects.all():
		addCategory_array.append([i.category, i.parent])
		print("--------------")
		# session = models.ForeignKey(Session)
		print("--------------")
	context = {
		'addCategory_array': str(addCategory_array).replace("'", '"'),
		'categories': ProductCategory.objects.exclude(category="Панель"),
		'products': Product.objects.all().order_by('-id')[:10]
	}
	return render(request, 'okapp/admin.html', context=context)

def makeOrder(request):
	if request.method == 'POST':
		context= {
			'orderData': zip(json.loads(request.POST.get('orderData')), json.loads(request.POST.get('costs'))),
			'phone': request.POST['phone'],
			'orderEmail': request.POST['email'],
			'shippingAdress': request.POST['shippingAdress'],
			'shippingPrice': request.POST['shippingPrice'],
			'summary': request.POST['sum'],
		}
		rendered = render_to_string('okapp/mail.html', context=context)
		email = EmailMessage('Заказ на сумму ' + context['summary'] + " руб.", rendered, to=['belayakartina@mail.ru'])
		print(email)
		email.content_subtype = "html"
		email.send()
		response_data = {
			'products_array': "hey",
		}
		return HttpResponse(json.dumps(response_data), content_type="application/json")