

function files_resize(){                                                 consolelog_func("darkblue"); 
	style_resize();                                                      
	common_set_fontsize(common.f_fontsize_scale, 0);
	files_show_buttons();
	files_show_files(); 
	files_set_zoom('no');
	files_scroll(files.iter, 'no');
}

//-- files scroll functions ----------------------------------------------
function files_scroll(order, i_utter){                                   consolelog_func('darkblue'); 
	                                                                     //console.log('Length:',files.entries.length);
	if (files.entries.length<1){return true;}
	   
    var iter = files.iter;                                               
    var iter_prev = files.iter_prev;                                     
    if (order==-1){ if (iter<files.entries.length-1) {iter+=1;} }
    else if (order==-2){ if (iter>0) {iter-=1;} }
    else { iter = order };                                               
    iter_prev = files.iter;   
    files.iter_prev = files.iter;
    files.iter = iter;
    
    if (files.iter>files.entries.length-1  || files.iter<0){
		files.iter = 0; 
		files.iter_prev = 0;
	}
	if (typeof files.iter != 'number'){ files.iter=0; files.iter_prev=0; } 
	                                                                     
                                                                         console.log('Scroll-iter: '+files.iter+' | '+files.iter_prev);
    var hover = '_hover';
    var elem = document.getElementById(files.get_fid()+'_pic');
    var cname = elem.className;
    if (cname.indexOf(hover)==-1){ elem.className = cname+hover; }
   
    if (files.iter_prev != files.iter) {
		elem = document.getElementById(files.get_fid(files.iter_prev)+'_pic');
		cname = elem.className;
	    if (cname.indexOf(hover)>-1){ elem.className = cname.replace(hover,''); }
	}
    
    files_fill_zoom();
    scroll_to(files.get_fid(), 'content_box', title=0);
     
    var fname = files.get_fname().replace(/_/g,' ');                          
    if (i_utter===undefined){ utter(fname, 1); } 
    
    var name = files.get_subdir()+files.get_fname();                     
    var ifdisable = !(files.items_protected.indexOf(name)==-1 && (files.iter!=0 || common.in_contacts));
    common_disable_button("show_opt", ifdisable, function(){ files_show_options();} );   
         
}  
function files_fill_zoom(){                                              consolelog_func();
    var fname = files.get_fname();
    if (fname==undefined){fname='';}
    if (common.in_contacts){
		var dir = 'Contacts: ';
	}else{
	    var dir = user.name+' '+files.get_subdir()+'/';
	}
    var elem = document.getElementById('zoom_text');
    if (elem){
		document.getElementById('zoom_text').innerHTML = '<em style="font-style:normal;color:black;opacity:0.3;">'+dir+' </em>'+fname;
	} 
}        


//-- show buttons --------------------------------------------------------

function files_show_buttons(){                                           consolelog_func();  
    var elem = document.getElementById('buttons_area');                      
    var buttons_arr = [ 
		 ['show_menu', 'files_show_menu();',   [0,1,symbol_menu]],   
		 ['show_login', 'files_show_login();',  [4,1,symbol_person]], 
		 ['ajax_enter', 'files_ajax_enter();',  [2,0, symbol_enter]],   
		 ['js_fprev',   'files_scroll(-2);',    [3,0, symbol_prev]],
		 ['js_fnext',   'files_scroll(-1);',    [7,0, symbol_next]],
		 ['show_opt',    'files_show_options();', [1,1,symbol_gear2]] 
		 ];
    if (common.in_contacts){
		buttons_arr.push( ['show_addcontact', 'files_show_addcontact();', [6,1,symbol_plus]], 
						  ['ajax_mailexit',   'files_ajax_enter(-1)',     [5,0,symbol_home]] );
	}else{
		buttons_arr.push( ['show_create', 'files_show_create();',         [6,1,symbol_plus]],
		                  ['ajax_contacts', 'files_ajax_contacts();',     [5,0,symbol_people]]  );
		                             
        if (user.name=='admin'){
			buttons_arr.push( ['show_sync',   'files_show_sync();',       [6,0,'sync']] );
		}
	}
    elem.innerHTML = button_html(0, buttons_arr, 4,2);  
    elem.style.display='block';      
    if (common.in_contacts==false && files.unread>0){
		elem = document.getElementById('ajax_contacts');
		if (elem){ elem.innerHTML = elem.innerHTML+'<div class="mark_box2">'+symbol_alert+'</div>'; }
	}
}

function files_show_menu(){                                              consolelog_func();
	var inner_e = button_html(1, 
		[['show_lang',       'common_show_lang(1);',   [3,0]], 
		 ['js_zoom',         'files_set_zoom();',      [6,0]],
		 ['show_clickdelay', 'common_show_clickdelay();', [4,0]], 
		 ['show_fontsize',   'files_show_fontsize();', [5,0]],
		 ['show_sound',      '',                       [2,3]], 
		 ['show_bugfix',     'files_show_bugfix();',   [0,0]],  
		 ['ajax_refresh',    'location.reload();',     [1,0]], 
		] );
        
    common_create_menu('files_menu', 0, inner_e);
    document.getElementById('js_zoom').innerHTML = dict.place_fileszoom[files.zoom]; 
}

function files_show_bugfix(){                                            consolelog_func();
	var inner_e = button_html(1, 
		[['js_cleancookie', 'files_cleancookie();',     [0,0]], 
		 ['ajax_reinit',    'files_ajax_createinit();', [2,0]]
		]);
    common_create_menu('files_bugfix', 1, inner_e);
}

function files_show_create(){                                            consolelog_func();
	var inner_e = button_html(1, 
		[['edit_create', 'files_edittext(this.id);', [0,2]], 
		 ['ajax_newtxt', 'files_ajax_create(1);',    [5,0]],
		 ['ajax_newdir', 'files_ajax_create(0);',    [4,0]], 
		 ['ajax_upload', 'files_ajax_upload();',     [3,0]],
		 ['ajax_paste',   'files_ajax_paste();',       [7,0]], 
		]);
    common_create_menu('files_create', 0, inner_e);
    
    var copy_path = localStorage.getItem("copy_shortpath");
    if (["", undefined, null].indexOf(copy_path)!=-1 ){
		common_disable_button("ajax_paste", true, function(){ files_ajax_paste();});
	}
}
function files_show_options(){                                           consolelog_func();
	if (common.in_contacts){
		common.confirm_action = 'files_ajax_rmcontact();';
		var buttons_arr = [ ['edit_filename', '', [0,4]], 
		                    ['ajax_totrash', 'common_show_notification(dict.confirm_rmcontact,true);', [4,0]] ];
	}else{
		var buttons_arr =  
			[['edit_filename', 'files_edittext(this.id);', [0,2]], 
			 ['ajax_totrash',  'files_ajax_totrash();',    [4,0]],
			 ['ajax_rename',   'files_ajax_rename();',     [7,0]], 
			 ['js_copy',       'files_copy();',            [6,0]],
			 ['ajax_download', 'files_ajax_download();',   [3,0]],
			];
	}
	var inner_e = button_html(1, buttons_arr);  
    common_create_menu('files_options', 0, inner_e);
    
    var fname = files.get_fname();
    if (fname.lastIndexOf('.')!=-1) { var text = fname.substring(0, fname.indexOf('.')); }
    else{ var text = fname; }
    document.getElementById('edit_filename').innerHTML = text;
}
function files_show_login(){                                             consolelog_func();
	var pos = [4,8,0, 11,7,10, 6,2,3];
	var wratio = window.innerWidth/window.innerHeight;
	if (wratio<1 && wratio>0.67){ pos=[0,3,6,11,9,10,8,2,5]; }
	common.confirm_action = 'files_ajax_rmuser();';
	
	var buttons_arr =  
		[['edit_username', 'files_edittext(this.id);',  [pos[0],2]], 
		 ['edit_userpass', 'files_edittext(this.id);',  [pos[1],2]],
		 ['edit_usermail', 'files_edittext(this.id);',  [pos[2],2]], 
		 ['ajax_signin',   'files_signin();',           [pos[3],0]],
		 ['ajax_signup',   'files_signup();',           [pos[4],0]], 
		 ['ajax_logout',   'files_logout();',           [pos[5],0]],
		 ['js_rememberme', 'files_login_remember();',   [pos[6],0]], 
		 ['js_help',   'common_show_notification(dict.info_login);', [pos[8],5, symbol_help]]
		];
	if (user.name!='guest'){
		buttons_arr.push( ['ajax_deleteuser', 'common_show_notification(dict.confirm_rmuser,true);',    [pos[7],0]] );
		}
    common_create_menu('files_login', 0, button_html(1, buttons_arr, 3,4) );
    
    var name="name", pass="password";                                    // !!Error if change placeholders
	if (files.userremember) {name = files.username; pass = files.userpass; }
	document.getElementById('edit_username').innerHTML = name;
	document.getElementById('edit_userpass').innerHTML = pass;
}
function files_show_fontsize(){
	var onclick = 'common_set_fontsize(this.id,0);';
	var inner_e = button_html(1, 
		[['js_ffontsize', onclick,  [7,0], 0], 
		 ['js_ffontsize', onclick,  [6,0], 1],
		 ['js_ffontsize', onclick,  [5,0], 2], 
		 ['js_ffontsize', onclick,  [4,0], 3],
		 ['place_fontsize', '',     [0,4]   ],
		]);
    common_create_menu('common_fontsize',1, inner_e);
    
    var alpha=common.style.f_fontalpha, font_def = common.style.f_fontsize, scale = common.f_fontsize_scale; 
    common_set_fontsize(common.f_fontsize_scale,0);
}  

function files_show_addcontact(){                                        consolelog_func(); console.log('Show_add_contact');
	if (user.name==""){
		common_show_notification(dict.alert_guest);
	}else{
		var inner_e = button_html(1, 
			[['edit_contactname', 'files_edittext(this.id);', [0,2]], 
			 ['ajax_addcontact',  'files_ajax_addcontact();', [4,0]] ]);
		common_create_menu('files_addcontact', 0, inner_e);
	}
}

function files_show_sync(){                                              consolelog_func();
	var inner_e = button_html(1, 
		[['ajax_sync_paste', 'files_ajax_paste(1);',   [4,0, 'past']], 
		 ['ajax_sync_rm',   'files_ajax_delete(1);', [6,0, 'rm']] ]);    // !!Error here
	
	common_create_menu('files_sync', 0, inner_e);
	var copy_path = localStorage.getItem("copy_shortpath");              
    if (["", undefined, null].indexOf(copy_path)!=-1 ){
		common_disable_button("ajax_sync_past", true, function(){ files_ajax_paste(1);});
	}
}

//-- menu functions ------------------------------------------------------

function files_set_zoom(order){                                          consolelog_func();
	if (order===undefined){ files.zoom = (files.zoom+1)%2; }             
    var elem = document.getElementById("zoom_box");     
    
    var pars = style_content_pars();
    var height = pars[0]-2*pars[5];
    if (files.zoom===1){ 
        elem.style.display='none';
    }else{
        elem.style.display='flex';
        height -= pars[2];                                                    
    }                                                                    
    
    document.getElementById('content_box').style.height = height*common.style.ry+'vh';
    var name = dict.place_fileszoom[files.zoom];                               
    
    var elem = document.getElementById('js_zoom'); 
    if (elem) { elem.innerHTML = dict.place_fileszoom[files.zoom]; }
}

//-- show items ----------------------------------------------------------

function files_show_files(){                                             consolelog_func();  
	var files_arr = files.entries;                                       //console.log(files.entries);
	
	var wratio = window.innerWidth/window.innerHeight;                   //console.log('wratio: '+wratio+' '+window.innerWidth+' '+window.innerHeight);              
	
	var left_pc = -1; 
	var top_pc=-1.4; 
    var ywidth_pc=22; var yspace_pc=3.7;
    
    var r = 1;
    if (wratio<1){ r=1*wratio; }
	var content_width = 0.95*style_content_pars()[1]/100* window.innerWidth;                 
	
	
    var ywidth = r*ywidth_pc*window.innerHeight/100; 
    var yspace = r*yspace_pc*window.innerHeight/100;
    var top  = r*top_pc*window.innerHeight/100;
    var left = left_pc*window.innerWidth/100;
    
    var xwidth = ywidth*1; var xspace = yspace*0.5;
                                                          
    var xn = Math.floor((content_width-xspace*1)/(xspace+xwidth));       //console.log('xn: '+xn);	          
    if (xn<1){xn=1};
    var ratio = ( content_width - xwidth*xn )/(xspace*(xn));
    var pic_width = 0.6*xwidth;                                          //console.log('xwidth: '+xwidth+' ratio: '+ratio, top,left);
    xspace = xspace*ratio;
    
    var i=0; var type=''; 
    var inner_e = "";
	for (i=0; i<files_arr.length; i+=1){                                 
		var n_y = (i-i%xn)/xn;
	    var x = left+ xspace*0.5 + (xspace+xwidth)* (i%xn);
	    var y = top + (ywidth+yspace)*n_y;                               //console.log(i, x,y, xwidth, ywidth);
	    
	    var alert = '';
	    if (files.unreads[i]>0 && common.in_contacts){ alert='<div class="mark_box1">'+symbol_alert+'</div>'; }
	    if (files.entrytype[i]=="folder") { symbol = symbol_folder2; } 
		else { symbol = symbol_file3; }
		var style = 'position:absolute;top:'+y+'px; left:'+x+'px; height:'+ywidth+'px; width:'+xwidth+'px;';
		inner_e+= '<div id="fileid_'+i+'" onclick="files_scroll('+i+');"  class="files" style="'+style+'">';
		inner_e+= '<div id="fileid_'+i+'_name"  class="files_name" >'+files.entries[i]+'</div> ' ;     
		inner_e+= '<div id="fileid_'+i+'_pic"  class="files_symbol '+files.get_ftype(i)+'" >'+symbol+alert+'</div>';
		inner_e+= '</div>';
	}
	document.getElementById('files_array').style.visibility = 'visible';
	document.getElementById('files_array').innerHTML = inner_e;          
	common_set_fontsize(common.f_fontsize_scale, 0);
	
}
