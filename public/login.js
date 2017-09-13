$('document').ready(function()
{ 
     /* validation */
	 $("#login_form").validate({
      rules:
	  {
			text: {
            required: true
            },
            
            number: {
                required: true,
                number: true
                },
	   },
       messages:
	   {
            lastname:{
                      required: "(ex. Mocorro / Mocorro Jr)"
                     },
            employee_id: "Enter your valid Id number (ex. 12345)",
       },
	   submitHandler: submitForm	
       });  
	   /* validation */
	   
	   /* login submit */
	   function submitForm()
	   {		
			var data = $("#login_form").serialize();
			
			$.ajax({
				
			type : 'POST',
			url  : '/login/validate', // api url
			data : data,
			beforeSend: function()
			{	
				$("#error").fadeOut();
				$("#btn-login").html('sending ...');
			},
			success :  function(response)
			   {						
					if(response=="ok"){

						$("#btn-login").html('<img src="btn-ajax-loader.gif" />');
						setTimeout(' window.location.href = "/home"; ',3000);
					}
					else{
									
						$("#error").fadeIn(1000, function(){						
				            $("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+response+' !</div>');
						    $("#btn-login").html('Log In');
                        });
                        
                        $("#employee_id").click(function() {
                            $(this).closest('form').find("input[type=text], textarea").val("");
                        });
					}
			  }
			});
				return false;
		}
	   /* login submit */	  
	   
});