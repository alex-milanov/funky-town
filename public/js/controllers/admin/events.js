"use strict"

// crud

var EventsCtrl = (function(){

	var eventRes = new Resource("/api/events");

	var formatList = function(list){
		list.forEach(function(item, index){
			item['dateTime'] = moment(item['dateTime']).format("lll");
			list[index] = item;
		})
		return list;
	}

	var list = function(){
		return eventRes.query().then(function(result){
			var container = $("#content");
			var tplName = "views/admin/events.jade"
			var events = formatList(result.list); 
			var data = {
				events: events
			};

			return helpers.displayWithJade(container, tplName, data);	
		})
	}

	var reset = function(){
		$('#events-form').trigger("reset");
		$('#events-form').find("[name=_id]").val("");
	}

	var edit = function(id){
		eventRes.view(id).then(function(data){
			Object.keys(data).forEach(function(field){
				var formElement = $("[name="+field+"]");
				var value = data[field];
				if(field == "dateTime"){
					value = moment(value).format("YYYY-MM-DD");
				}
				formElement.val(value);
			})			
		})
	}

	var save = function(data){
		
		var id = data._id || "";
		delete(data._id);

		// if id update
		if(id !== ""){
			
			eventRes.update(id, data)
				.then(function(){
					console.log("Updated Successfuly!")
					list();
				})
		// else create
		} else {
			eventRes.create(data)
				.then(function(){
					console.log("Created Successfuly!")
					list();
				})
		}

	}

	var remove = function(id){
		eventRes.delete(id).then(function(){
			console.log("Deleted "+id+" successfuly!");
			list();
		})
	}

	var init = function(){

		$("#content").on("submit", "#events-form",function(event){
			var data = helpers.getDataFromForm($(this));
			save(data);
			event.preventDefault();
		})

		$("#content").on("click", ".action-reset",function(event){
			reset();
		})

		$("#content").on("click", ".action-delete", function(){
			var id = $(this).data("id");
			remove(id);
		})

		$("#content").on("click", ".action-edit", function(){
			var id = $(this).data("id");
			edit(id);
		})

		return list();

	}

	return {
		list: list,
		reset: reset,
		edit: edit,
		save: save,
		remove: remove,
		init: init
	};

}());