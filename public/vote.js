$('document').ready(function()
{ 
     /* validation */
	 $("#vote_form").validate({
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
            poster_id:{
                      required: "Choose the Best Poster :)"
                     },
            employee_id: "Enter your valid id number (ex. 12345)",
       },
	   submitHandler: submitForm	
       });  
	   /* validation */
	   
	   /* vote submit */
	   function submitForm()
	   {		
			var data = $("#vote_form").serialize();
			
			$.ajax({
				
			type : 'POST',
			url  : '/vote/validate', // api url
			data : data,
			beforeSend: function()
			{	
				$("#error").fadeOut();
				$("#btn-vote").html('sending ...');
			},
			success :  function(response)
			   {						
					if(response=="ok"){

						$("#btn-vote").html('<img src="btn-ajax-loader.gif" />');
						setTimeout(' window.location.href = "/rankings"; ',3000);
					}
					else{
									
						$("#error").fadeIn(1000, function(){						
				            $("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+response+' !</div>');
						    $("#btn-vote").html('Submit');
                        });
                        
                        $("#employee_id").click(function() {
                            $(this).closest('form').find("input[type=text], textarea").val("");
                        });
					}
			  }
			});
				return false;
		}
	   /* vote submit */	  
	   
});