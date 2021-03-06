<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="description" content="Hedgehogappp.com helps people with cerebral palsy and other vision and motor skills problems to read, write and communicate. It contains text-reader with speech synthesis and easy scalable text, text editor, simplified file system and messenger. Buttons are large here, text is playable." >
  <meta name="keywords" content="reader, editor, speech synthesis, cerebral palsy, file manager, messenger, account, read, write, large buttons, disability, narrate">
  <title>Reader-editor-messenger for serabral palsy</title>
  
  <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="shortcut icon" href="{{ URL::to('favicon.ico')}}">
  
  <link rel="stylesheet"  href="{{ URL::to('css/googleapis_Open+Sans.css')}}" />
  <link rel="stylesheet"  href="{{ URL::to('css/3.3.4.bootstrap.min.css')}}" />
  <link rel="stylesheet"  href="{{ URL::to('css/common.css')}}" />

  <meta name="csrf-token" content="{{ csrf_token() }}">
  
</head>

<body>
		
	<div id='base_elements'>
		<div id='content_box' class='content_box ' align='top'> 
			<div hidden> File icons will be here, or contacts/people icons, or text from the opened file, or messages</div> 
		</div>
		<div hidden id="zoom_box" class="text_zoom_box border">  
			<div id="zoom_text" class="text_zoom"> <div hidden>Zoom of file name, or selected text in reader</div> </div> 
		</div>
	    <div hidden id='buttons_area' class='buttons_area'> Large accessible buttons             </div>
	</div>
	<div id='created_elements'>        <div hidden> Filemanager or reader: menu panels with buttons </div></div>
	<div id='editor_base_elements'>    <div hidden> Editor: background and start panel with buttons </div></div>
	<div id='editor_created_elements'> <div hidden> Editor: panels with symbol buttons              </div></div>
	
	<div hidden id='tmp' > After editor text will be updated here then merged and saved to server   </div>
	<div hidden id='hidden_text' > Text from file, before parsing </div>
	
	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/lang/en.js') }}"></script> 
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/lang/ru.js') }}"></script> 
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/common_variables.js') }}"></script> 
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/common.js') }}"></script> 
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/files.js')  }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/reader.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/common_display.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/files_display.js')  }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/reader_display.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/reader_parse.js')   }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/editor.js') }}"        ></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/editor_display.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/plugins/jquery.foggy.min.js') }}"></script>
    
    <script>
		user.name = "{{ $username }}";   
		user.id = "{{ Auth::user()->id }}";  
		files.unread = "{{ $unread }}"; 
		files_start(); 
	</script>
	

	<form hidden action="{{ route('unisharp.lfm.upload') }}" role='form' id='uploadForm' name='uploadForm' method='post' enctype='multipart/form-data' class="dropzone">
		<div class="form-group" id="attachment">
		  
		  <div class="controls text-center">
			<div class="input-group" style="width: 100%">
			  <a class="btn btn-primary" id="upload-button">{{ trans('laravel-filemanager::lfm.message-choose') }}</a>
			</div>
		  </div>
		</div>
		<input type='hidden' name='working_dir' id='working_dir'>
		<input type='hidden' name='type' value='{{ request("type") }}'>
		<input type='hidden' name='_token' value='{{csrf_token()}}'>
	</form>


	<script>
		var route_prefix = "{{ url('/') }}";
		var lfm_route = "{{ url(config('lfm.url_prefix', config('lfm.prefix'))) }}";
		var lang = {!! json_encode(trans('laravel-filemanager::lfm')) !!};
	</script>
	<script>{!! \File::get(base_path('vendor/unisharp/laravel-filemanager/public/js/dropzone.min.js')) !!}</script> 
  	
	<script>
	    Dropzone.options.uploadForm = {
	      paramName: "upload[]", // The name that will be used to transfer the file
	      uploadMultiple: false,
	      parallelUploads: 5,
	      clickable: '#upload-button',
	      dictDefaultMessage: 'Or drop files here to upload',
	      init: function() {
			fff = "{{ lcfirst(str_singular(request('type'))) == 'image' ? implode(',', config('lfm.valid_image_mimetypes')) : implode(',', config('lfm.valid_file_mimetypes')) }}";
	        maxfff = ({{ lcfirst(str_singular(request('type'))) == 'image' ? config('lfm.max_image_size') : config('lfm.max_file_size') }} / 1000);
	        var _this = this; // For the closure
	        this.on("addedfile", function(file) { files_ajax_items(); });
	        this.on('success', function(file, response) {                console.log('RESP: ',response, fff, maxfff);
	          files_ajax_items();
	          if(response != 'OK'){   console.log('RESP: ',response);
	            this.defaultOptions.error(file, response.join('\n'));
	          }  
	      });
	      },
	      acceptedFiles: "{{ lcfirst(str_singular(request('type'))) == 'image' ? implode(',', config('lfm.valid_image_mimetypes')) : implode(',', config('lfm.valid_file_mimetypes')) }}",
	      maxFilesize: ({{ lcfirst(str_singular(request('type'))) == 'image' ? config('lfm.max_image_size') : config('lfm.max_file_size') }} / 1000)
	    }
	</script>

</body>
</html>
