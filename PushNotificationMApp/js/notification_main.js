/*
 * Author: Sergei Papulin
 * 
 * Push Notification API
 * https://developer.tizen.org/development/tutorials/native-application/messaging/push-server
 * https://developer.tizen.org/development/api-tutorials/native-application/messaging/push
 * https://developer.tizen.org/ko/development/guides/web-application/messaging/push-notification?langredirect=1
 * 
 * Request the permission for a new application
 * https://developer.tizen.org/webform/request-push-permission-new-application
 * 
 * Extend the expiration date or change the quota
 * https://developer.tizen.org/webform/request-extend-expiration-date-or-change-quota
 *
 * Web-service
 * Django - Python
 * https://docs.djangoproject.com/en/1.10/intro/
 * 
 * AWS
 * http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-django.html
 * 
 * 
 */

(function() {
	
	var notiMain = {},
		regId,
		recipients = [];
	
	notiMain.init = function() {
		
		$("document").ready(initNotiMain);
		
		// Page 1: notification-main
		$("#notification-main").on("pagebeforeshow", displayNotiMain);
		
		$("#btn-settings").click(showNotiSettings);
		$("#btn-send-msg").click(sendMessage);
		//$("#btn-refresh").click(refreshMeassages);
		$("#btn-show-add-contacts").click(showAddContacts);
		
		// Page 2: notification-settings
		$("#notification-settings").on("pagebeforeshow", displayNotiSettings);
		
		$("#btn-back-main-settings").click(backToMainFromSettings);
		$("#btn-register-user").click(registerUser);
		$("#btn-get-reg-id").click(getRegId);
		
		// Page 3: notification-add-contacts
		$("#notification-add-contacts").on("pagebeforeshow", displayNotiAddContacts);
		
		$("#btn-back-main-contacts").click(backToMainFromContacts);
		$("#btn-save-contacts").click(saveRecipientList);

	};
	
	function initNotiMain() {
		
		console.log("initMain");
		
		regId = tizen.push.getRegistrationId();
		
		if (regId != null) {
			
			console.log("RegId already exists: " + regId);
			
			recipients = localStorage.getItem("my_recipients").split(",");
			
			tizen.push.connectService(notificationCallback);
			
			function notificationCallback(message) {
				console.log(message);
			}
			
			tizen.push.getUnreadNotifications();
		}
		else {
			console.log("RegId is : " + regId);
			getRegId();
		}
		
		$("#txt-reg-id").val(regId);
		$("#txt-nickname").val(localStorage.getItem("my_nickname"));
		$("#txt-email").val(localStorage.getItem("my_email"));

	}
	
	// Page 1: notification-main
	function displayNotiMain() {

		$("#notification-main").css("display", "block");
		$("#notification-settings").css("display", "none");
		$("#notification-add-contacts").css("display", "none");
	}
	function showNotiSettings() {
		
		localStorage.setItem("test", "hello");
		
		tau.changePage("notification-settings", {transition: "flip", reverse: false});
	}
	function showAddContacts() {
		
		console.log("showAddContacts");
		
		tau.changePage("notification-add-contacts", {transition: "flip", reverse: false});
	}
	function sendMessage() {
		
		if (regId != null) {
			
			if (recipients.length === 0) {
				
				alert("Set Recipients in Add-Contacts Tab");
				
			} 
			else {
			
				var msgText = $("#txt-message").val();
				
				var msg = {
						"message": msgText,
						"sender": regId,
						"recipients": recipients.join(",")
					};
				
				$.ajax({
			    	type: "POST",
			    	url: "http://sample-env.yk2rymwmgy.eu-west-1.elasticbeanstalk.com/userapp/send_message/",
			    	data: msg,
			    	success: function(response) {
			    		
			    		showMessage(localStorage.getItem("my_nickname"), msgText, true);
	
			    		console.log(response);
			    	},
			    	error: function(e) {
			    		console.log(e);
			    	}
			    });
			}
			
		}
		else {
			alert("Get Your Registration ID in Settings Tab")
		}
	}
	function showMessage(sender, message, isMyMassage) {
		
		var className = "ui-message-block-left";
		if (isMyMassage === true)
			className = "ui-message-block-right";
		
		var htmlCode = '<div class="'+className+'">' +
							'<p class="ui-chat-nickname">'+sender+'</p>' +
							'<div class="ui-message-text-block">' +
							'	<p class="iu-message-text">'+message+'</p>' +
							'</div>' +
						'</div>';
		
		$("#chat-window").prepend(htmlCode);
		
	}
	
	function refreshMeassages() {
		
		function notificationCallback(message)
		{
		   console.log(message);
		}

		tizen.push.connectService(notificationCallback);	
	}
	
	// Page 2: notification-settings
	function displayNotiSettings() {
		$("#notification-main").css("display", "none");
		$("#notification-settings").css("display", "block");
		$("#notification-add-contacts").css("display", "none");
	}
	function backToMainFromSettings() {
		//tau.changePage("notification-main", {transition: "pop", reverse: false});
		tau.back();
	}
	function registerUser() {
		
		var nickname = $("#txt-nickname").val(),
			email = $("#txt-email").val(),
			regid = regId;
		
		localStorage.setItem("my_email", email);
		localStorage.setItem("my_nickname", nickname);
		
		var user = {
				"nickname": nickname,
				"email": email,
				"regid": regid
			};
		
		$.ajax({
	    	type: "POST",
	    	url: "http://sample-env.yk2rymwmgy.eu-west-1.elasticbeanstalk.com/userapp/register_user/",
	    	data: user,
	    	success: function(response) {
	    		console.log(response);
	    		
	    		backToMainFromSettings();
	    		
	    	},
	    	error: function(e) {
	    		console.log(e);
	    	}
	    });
		
	}
	function getRegId() {
		
		if (regId != null) {
			console.log("RegId already exists");
		} 
		else {
			
			var service = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/push_test");
			
			tizen.push.registerService(service, registerSuccessCallback, errorCallback);
			
			function registerSuccessCallback(id)
			{			
				regId = id;
				console.log("Registration succeeded with id: " + id);
				$("#txt-reg-id").val(id);
				
				initServiceCallback();
			}
			
			function errorCallback(e)
			{
			   console.log(e);
			}
		}
		
	}
	
	function initServiceCallback(){
		
		tizen.push.connectService(notificationCallback, errorCallback);
		
		function notificationCallback(message) {
			
			//alert(message.alertMessage);
			//console.log(message);
			//console.log(JSON.parse(message.appData));
			
			var respUser = JSON.parse(message.appData);

			showMessage(respUser.sender_nickname, message.alertMessage, false);
			
		}
		function errorCallback(e) {
			console.log(e)
		}
		
	}
	
	// Page 3: notification-add-contacts
	function displayNotiAddContacts() {
		$("#notification-main").css("display", "none");
		$("#notification-settings").css("display", "none");
		$("#notification-add-contacts").css("display", "block");
		
		displayAvailableUsers();

	}
	function displayAvailableUsers() {
		
		$.ajax({
	    	type: "POST",
	    	url: "http://sample-env.yk2rymwmgy.eu-west-1.elasticbeanstalk.com/userapp/get_users",
	    	success: function(response) {
	    		console.log(response);
	    		showUsers(response);
	    		
	    	},
	    	error: function(e) {
	    		console.log(e);
	    	}
	    });
		
	}
	function showUsers(response) {
		
		var i = 0,
			lenList = response.nicknames.length,
			htmlCode = "",
			cheked = false;
		
		for (i; i < lenList; i++) {
			
			htmlCode += '<div class="ui-user-block">' +
							'<label>' + 
								'<input id="'+ response.emails[i] +'"class="ui-checkbox ui-content-checkbox"  type="checkbox" value="'+ 
											response.emails[i] +'"  style="vertical-align:middle;"/>' +
									'<span style="margin-left:10px;">'+ response.nicknames[i] +'</span><br>' +
									'<span style="margin-left:10px; font-size:16px">'+ response.emails[i] +'</span>' +
							'</label>' +
						'</div>';
		}
		$("#users-window").html(htmlCode);
		
		i = 0;
		lenList = recipients.length;
		
		for (i; i < lenList; i++) {
			document.getElementById(recipients[i]).checked = true;
		}
		
	}

	function saveRecipientList() {
		
		var checkedList = [];
		
		$(".ui-content-checkbox:checkbox:checked").each(function(){
			
			console.log(this.id);
			checkedList.push(this.id);
			
		});
		
		recipients = checkedList;
		
		localStorage.setItem("my_recipients", checkedList.join(","));
		
		tau.back();
	}
	
	function backToMainFromContacts() {
		tau.back();
	}
	
	
	return notiMain;
	
})().init();
