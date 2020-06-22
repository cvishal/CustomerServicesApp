/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["depot.ProductController"]){dojo._hasResource["depot.ProductController"]=true;dojo.provide("depot.ProductController");dojo.require("dijit.Menu");dojo.require("dijit.MenuItem");dojo.require("dijit.PopupMenuItem");dojo.require("dijit.MenuSeparator");dojo.require("dojox.data.JsonRestStore");dojo.require("dojox.grid.DataGrid");dojo.require("dijit.Tree");dojo.require("dojo.data.ItemFileWriteStore");dojo.require("dojo.dnd.common");dojo.require("dojo.dnd.Source");dojo.require("dijit.Dialog");dojo.require("dojox.dtl");dojo.require("dojox.dtl.Context");dojo.registerModulePath("product","../../product");dojo.declare("depot.ProductController",null,{defaultOrder:null,constructor:function(){this.defaultOrder={identifier:"productId",label:"product.name",items:[]};},loadCatalog:function(){var _1={url:"jaxrs/Category",handleAs:"json",load:dojo.hitch(this,this.loadCatalogSuccess),error:dojo.hitch(this,this.loadCatalogError)};dojo.xhrGet(_1);this.cartPreview();dojo.connect(dijit.byId("productGrid"),"onRowClick",this,this.dragAndDrop);dojo.subscribe("/dnd/drop",this,this.addToCart);},loadCatalogSuccess:function(_2,_3){var _4=dijit.byId("categoryMenu");dojo.forEach(_2,dojo.hitch(this,function(_5){if(_5.subCategories){var _6=new dijit.Menu({parentMenu:_4});dojo.addClass(_6,"outer");dojo.forEach(_5.subCategories,dojo.hitch(this,function(_7){var _8=new dijit.MenuItem({label:_7.name,title:_7.id});dojo.connect(_8,"onClick",this,this.selectCategory);_6.addChild(_8);}));var _9=new dijit.PopupMenuItem({label:_5.name,popup:_6});_4.addChild(_9);}}));},loadCatalogError:function(e){console.error("Error Loading Categories",e);},formatImage:function(_a){return dojo.replace("<img  src='{image}' height='100px' width='100px'></img>",{image:_a});},combineData:function(_b,_c){return _c;},formatData:function(_d){return dojo.replace("<div class='productTitle'>{name}</div><div>{price}</div>",_d);},selectCategory:function(_e){var _f=dijit.byId("productGrid");_f.setQuery({categoryId:_e.target.parentNode.title});dojo.place("<div>"+_e.target.innerHTML+"</div>","catHeader","only");},cartPreview:function(){if(accountController.account.openOrder){this.defaultOrder.items=accountController.account.openOrder.lineitems;dojo.forEach(this.defaultOrder.items,function(_10){try{previewStore.newItem(_10);}catch(e){previewStore.fetchItemByIdentity({identity:_10.productId,onItem:function(_11){previewStore.setValue(_11,"quantity",_10.quantity);}});}});previewStore.save();dojo.place("<div>Order Total: "+accountController.account.openOrder.total+"</div>","orderTotal","only");}},dragAndDrop:function(){var _12=dijit.byId("detailDialog");var _13=dijit.byId("productGrid");console.debug(arguments[0]);var _14=_13.getItem(arguments[0].rowIndex);console.debug(_14);_12.set("title",_14.name);var _15=new dojox.dtl.Template(dojo.moduleUrl("product","productDetail.html"));var _16=new dojox.dtl.Context(_14);dijit.byId("detailDialogPane").set("content",_15.render(_16));dojo.query(".progressSection").style({display:"none"});dojo.query(".cartSection").style({display:"block"});dojo.query(".productSection").style({display:"block"});_12.show();},addToCart:function(_17){var _18=dijit.byId("productGrid");console.debug(_18);var _19=_18.selection.getSelected();console.debug("Adding to Cart",_19);console.debug(_19[0].id);dojo.query(".progressSection").style({display:"block"});dojo.query(".cartSection").style({display:"none"});dojo.query(".productSection").style({display:"none"});var _1a={url:"jaxrs/Customer/OpenOrder/LineItem",headers:{"Content-Type":"application/json","If-Match":accountController.etag},postData:dojo.toJson({quantity:1,productId:_19[0].id}),handleAs:"json",load:dojo.hitch(this,this.addToCartSuccess),error:dojo.hitch(this,this.addToCartError)};dojo.xhrPost(_1a);},addToCartSuccess:function(_1b,_1c){accountController.account.openOrder=_1b;this.defaultOrder.items=[];accountController.etag=_1c.xhr.getResponseHeader("ETag");console.debug("Restting preview store");this.cartPreview();var _1d=dijit.byId("detailDialog");_1d.hide();},addToCartError:function(_1e){console.debug(_1e);},removeItem:function(e){console.info("remove item not implemented",e);},updateItem:function(e){console.info("update quantity not implemented",e);}});}