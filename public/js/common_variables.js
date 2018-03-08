
if (localStorage.getItem("isset")!="true"){
	localStorage.setItem("isset", "true");
	localStorage.setItem("copy_path", "");
	localStorage.setItem("copy_working_dir", "");
	localStorage.setItem("copy_shortpath", "");
	localStorage.setItem("show_welcome", "yes");
	localStorage.setItem("working_dir", "");
	localStorage.setItem("delete_fname", "");
	localStorage.setItem("folder_path", "");
	localStorage.setItem("url", "");
	
	localStorage.setItem("in_reader", "no");
	localStorage.setItem("reader_fname", "");
	localStorage.setItem("reader_url", "");
	localStorage.setItem("reader_savepath", "");
}else{
	localStorage.setItem("show_welcome", "no");
}
//localStorage.setItem("in_reader", "no");

var user = {
	id: 0,
	name: '',
	contact_name: '',
	contact_id: '',
};

var common = {
	langbase: "en",
	lang: "auto",
	editor_nlines_lvl0: 3,
	editor_nlines_lvl1: 2,
	b_fontsize_scale: 1,
	f_fontsize_scale: 1,
	r_fontsize_scale: 1,
	time_delay: 10,
	welcome: 'do',
	bkg_image: true,
	editor_text: '',
	ineditor: false,
	ischanged_text: false,
	
	cookie_number: 14,
	browser: "",
	cookie_suffix: "_",
	name: "common",
	play_counter: 1,
	utter_text: '',            // to utter long sentences
	utter_onend: 0,
	utter_playall: 0,
	repeat_text: '',           // used in common_show_notification() only
	in_messages: false,	
	time_click: 0,
	
	symbol_ltag: '<abbr>',
	symbol_rtag: '</abbr>',
	
	cookie_save: function(){                                             consolelog_func('brown');
	    var keys = Object.keys(this);                                    
	    var i;
	    for (i=0; i<this.cookie_number; i+=1){                             
	        cookie_set(keys[i]+this.cookie_suffix, this[keys[i]].toString() );  //console.log('save_cookie: '+i+' | '+this.cookie_suffix+' | '+this[keys[i]].toString());                    
		}
	},
	cookie_load: function(){                                             consolelog_func('brown');
	    var keys = Object.keys(this);                                    
	    var i; var v;
	    for (i=0; i<this.cookie_number; i+=1){                           
			v = cookie_get(keys[i]+this.cookie_suffix);                  //console.log('load_cookie: '+i+' | '+this.cookie_suffix+' | '+v);       
			if (v == 'true') { v=true; }
			else if (v == 'false') { v=false; }
			else if ( v.match(/\d+/g)!=null && v.match(/[a-z]/i)===null ) { 
				if (v.indexOf('.')==-1) { v=parseInt(v); }
				else { v=parseFloat(v); }   
			}         
			this[keys[i]] = v;                                           //console.log(keys[i]+' | '+v);
		}
	},
	style: {}	
}

common.style = {
	base_class: "buttons ",
	last_class: " buttons_image",
	class_arr: ["", "disabled", "symbol", "symbol disabled", "editor", "editor disabled"],
    yn:4, btop:3.5, bbot:96.5, 
    xn:2, bright:98, xspace:4, dx_side:1,
    dy: 16.5, xy_ratio: 1.1,
    textheight_zoom: 77,
    textheight: 97,
    b_shape: 1.1,
    b_width: 12, 
    b_height: 17,
    b_fontsize_base: 5,
    f_fontsize_base: 3.4,
    r_fontsize_base: 3.4,
    b_fontsize: 0,
    f_fontsize: 0,
    r_fontsize: 0,
    f_fontalpha: 1,
    r_fontalpha: 1,
    fontalpha_def: 0.58,
    fontalpha_def_b: 0.58,
    f_lineheight_base: 1.05,
    b_lineheight_base: 1.05,
    r_lineheight_base: 1.45,
    f_lineheight: 0,
    b_lineheight: 0,
    r_lineheight: 0,
    vmin: 10,
    cursorshift:0.25,
    
    init_font: function(scale, hscale){
		this.b_fontsize = scale*this.b_fontsize_base;
		this.f_fontsize = scale*this.f_fontsize_base;
		this.r_fontsize = scale*this.r_fontsize_base;
		this.b_lineheight = hscale*this.b_lineheight_base;
		this.f_lineheight = hscale*this.f_lineheight_base;
		this.r_lineheight = hscale*this.r_lineheight_base;
	},
    get_content_width: function(){                                       consolelog_func('brown');
		var wratio = window.innerWidth/window.innerHeight;
		var bright = wratio*this.bright;
		var dx = this.xy_ratio*this.dy;
		var content_width = (bright - 2*dx -this.xspace-1*wratio);
		return(content_width);
	},
    buttonpos: function(i, class_n){                                     //consolelog_func('brown');
		var wratio = window.innerWidth/window.innerHeight;
		if (class_n===undefined) {class_n=0;}
		var class_name = this.base_class+this.class_arr[class_n]+ this.last_class; //console.log(class_name);
	    var bright = wratio*this.bright;           
	    var n_x = (i-i%this.yn)/this.yn;
	    
	    var dx = this.dy*this.b_shape;
	    var yspace = (this.bbot-this.btop-(this.yn)*this.dy ) / (this.yn-1); 
	    var y = this.btop + (i%this.yn)*(yspace+this.dy*1);
	    var x = bright - (this.xn-n_x)*dx - (this.xn-n_x-1)*this.xspace; 
	    if ((i-i%this.yn)/this.yn==this.xn-1){ dx = dx*this.dx_side; }    
	    var fontsize = this.b_fontsize*common.b_fontsize_scale*this.vmin;  //console.log('fontsize: '+this.b_fontsize+' | '+common.b_fontsize_scale+' | '+this.vmin+' | '+fontsize);
	    var style = 'left:'+x/wratio+'vw;top:'+y+'vh;width:'+dx/wratio+'vw;height:'+this.dy+'vh; border-bottom-width:'+this.dy*0.13+'vmin; font-size:'+fontsize+'px; line-height:'+fontsize*this.b_lineheight+'px;';
	    return('class="'+class_name+'" style="'+style+'"'); 
	},
	
	buttonpos_menu: function(i, class_n, y_dim, x_dim){  //consolelog_func('brown'); 
		if (y_dim==undefined){ y_dim = 2; x_dim = 4; }
		if (class_n===undefined) {class_n=0;}
		var class_arr = ["buttons", "buttons_text", "text_zoom_box", "buttons disabled"];
		var class_name = class_arr[class_n];
				
		var b_height = 17;
		var b_left = 10;  var b_right = 90; 
		var b_top = 10; var b_bot = 90;
		var wratio = window.innerWidth/window.innerHeight; 
		if (x_dim*y_dim==8){              
			if (wratio<1.3 && wratio>0.8){ x_dim=3; y_dim=3; }
			if (wratio>1.3 ){ x_dim=4; y_dim=2; }
			if (wratio<0.8 ){ x_dim=2; y_dim=4; }                           
		}else if (x_dim*y_dim==12){
			if (wratio<2.3 && wratio>1){ x_dim=4; y_dim=3; }
			if (wratio<1 && wratio>0.67){ x_dim=3; y_dim=4; }
			if (wratio>2.3 ){ x_dim=6; y_dim=2; }
			if (wratio<0.67 ){ x_dim=2; y_dim=6; } 
		}                                                                //console.log('wratio: '+wratio+' '+x_dim+' '+y_dim);
		var nx = i%(x_dim); var ny = (i-i%(x_dim))/x_dim;
		var dx = this.dy*this.b_shape/wratio;
		var ratio = 1.2;
		var x = b_left +(b_right-b_left)*(ratio-1)/2. + (b_right-b_left)/(x_dim*ratio) *(nx+0.5) - dx/2.;
		var y = b_top + (b_bot-b_top)*(ratio-1)/2. +    (b_bot-b_top)/(y_dim*ratio) *(ny+0.5) - this.dy/2.;       //console.log(dx,this.dy,x,y);
		
		var fontsize = this.b_fontsize*common.b_fontsize_scale*this.vmin;   
		var lineheight = fontsize*this.b_lineheight;
		if (class_n===2) { 
			lineheight = b_height*this.vmin+lineheight/2.0; 
			dx = dx + (b_right-b_left)/(x_dim*ratio);
		}
		var style = 'left:'+x+'vw; top:'+y+'vh;'+'width:'+dx*wratio+'vmin; height:'+this.dy+'vmin; font-size:'+fontsize+'px; line-height:'+lineheight+'px;';  
		if (class_n===0){ style+= 'background-color: rgba(110, 152, 27, 0.7);'; }
		if (class_n===0){ style+= 'background-color: rgba(110, 152, 27, 0.7);'; }
		return('class="'+class_name+'" style="'+style+'"');
	},
	
	resize: function(){                                                  consolelog_func('brown');
		this.vmin = Math.min(window.innerWidth, window.innerHeight)/100;
	    common.style.init_font(0.9,1.1);
		var wratio = window.innerWidth/window.innerHeight;
		
		var content_width = this.get_content_width();
		var elem = document.getElementById('content_box');
	    if (elem){ elem.style.width= (content_width-3.4*wratio)/wratio+'vw'; }
	    var elem = document.getElementById('zoom_box');
	    if (elem){ elem.style.width= (content_width-3.4*wratio)/wratio+'vw'; }  
	    var elem = document.getElementById('buttons_area');
	    if (elem){ elem.style.left= (content_width-0.5*wratio)/wratio+'vw'; } 
	    elem = document.getElementById('show_menu');
	    
	}	
}

//-----------------------------------------------------------------------------
