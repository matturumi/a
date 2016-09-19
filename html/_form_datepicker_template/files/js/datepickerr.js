// UTF-8

$(function(){

		//datepicker
		var dataPicker = $('#jquery-ui-datepicker');
		if(dataPicker.length){
			$.datepicker.setDefaults($.extend($.datepicker.regional['ja'])); /* 日本語に設定 */
			dataPicker.datepicker({
				showOn: "button",
				buttonImage: "http://alphasis.info/library/images/javascript/jquery/ui/datepicker/jquery-ui-datepicker-buttonimage-24x22.png",
				buttonImageOnly: true,
				dateFormat: 'yy/mm/dd', 
				changeMonth: true, 
				changeYear: true, 
				yearRange: '2014:2015', 
				showMonthAfterYear: true
			});
		}

});