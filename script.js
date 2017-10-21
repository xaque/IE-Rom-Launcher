var dir_emu = "%emu%/";
var dir_roms = "%roms%/";
var recent_roms = [];
var max_recent = 12;
var fav_roms = [];


function load_file(path){
	var client = new ActiveXObject("MSXML2.XMLHTTP");
	var file_text = "";
	client.open('GET', path);
	client.onreadystatechange = function() {
		file_text = client.responseText;
	}
	client.send();
	return file_text;
}

function exec_cmd(command){
	var ws = new ActiveXObject("WScript.Shell");
	console.log("Executing command: " + command);
	ws.Exec(command);
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function run_game(system, rom) {
	var command = "\"" + system.emu + "\"" + " " + system.cmd + " " + "\"" + dir_roms + system.id + "/" + rom + "\"";
	if (system.id == "dos"){
		command = "\"" + system.emu + "\"" + " " + "\"" + dir_roms + system.id + "/" + rom + "\"" + " " + system.cmd;
	}

	// Command line launch for demul emulator
	//
	// if (system.id == "dc"){
	// 	command = "\"" + system.emu + "\"" + " " + system.cmd + "\"" + dir_roms + system.id + "/" + rom + "\"";
	// }

	//This creates a command for roms that are inside a directory with .gdi images
	if (system.id == "dc" && !rom.endsWith(".cdi") && !rom.endsWith(".gdi") && !rom.endsWith(".zip")){
		command = "\"" + system.emu + "\"" + " " + system.cmd + " " + "\"" + dir_roms + system.id + "/" + rom + "/" + rom + ".gdi" + "\"";
	}
	
	exec_cmd(command);
	console.log(rom + " started.");
	console.log("Adding " + rom + " to recently played list.");
	var recentrom_ul = document.getElementById("recent_roms");
	var duplicate = recent_roms.filter(function(obj) {return obj.rom == rom;})[0];
	if (duplicate != null){
		var index = recent_roms.indexOf(duplicate);
		var rindex = recent_roms.reverse().indexOf(duplicate);
		recent_roms.reverse();
		var dup_li = recentrom_ul.childNodes[rindex];
		recent_roms.splice(index, 1);
		recent_roms.push(duplicate);
		recentrom_ul.removeChild(dup_li);
		recentrom_ul.insertBefore(dup_li, recentrom_ul.childNodes[0]);
		return;
	}
	if (recent_roms.length >= max_recent){
		recent_roms.pop();
		recentrom_ul.removeChild(recentrom_ul.childNodes[recentrom_ul.childNodes.length-1]);
	}
	if (recent_roms.length == 0){
		recentrom_ul.appendChild(create_rom_html(system, rom));
	}
	else{
		recentrom_ul.insertBefore(create_rom_html(system, rom), recentrom_ul.childNodes[0]);
	}
	recent_roms.push({system: system, rom: rom});
}

function sort_favs(){
	fav_roms.sort(function(a, b){
		if (a.rom < b.rom){
			return -1;
		}
		if (a.rom > b.rom){
			return 1;
		}
		return 0;
	});
}

function exitar(){
	sort_favs();
	var recent_roms_str = JSON.stringify(recent_roms);
	var fav_roms_str = JSON.stringify(fav_roms);
	localStorage.clear();
	localStorage.setItem("recent_roms", recent_roms_str);
	localStorage.setItem("fav_roms", fav_roms_str);
	window.open('close.html', '_self');
}

function parse_rom_index(indexfile, romlist){
	console.log("Loading rom index \"" + indexfile + "\"...");
	var file_text = load_file("rom_index/" + indexfile);
	console.log("...done.");
	console.log("Adding JS variables for \"" + indexfile + "\"...");
	var lines = file_text.split('\n');
	for(var line = 1; line < lines.length; line++){
		var filename = lines[line-1];
		filename = filename.replace(/\r?\n|\r/g, "");
		romlist.push(filename);
		console.log("\"" + filename + "\" added.");
	}
	console.log("...done.");
	return romlist;
}

function create_rom_html(system, title){
	var subtitle = title;
	//Cut off file extension from title
	if (subtitle.indexOf(".") != -1){
		subtitle = subtitle.substring(subtitle, subtitle.lastIndexOf("."));
	}
/*
	//Remove tags from subtitle
	if (subtitle.indexOf("(") != -1){
		subtitle = subtitle.substring(subtitle, subtitle.indexOf("("));
	}
	if (subtitle.indexOf("[") != -1){
		subtitle = subtitle.substring(subtitle, subtitle.indexOf("["));
	}
*/
	//Cut length of title
	if (subtitle.length > 48){
		subtitle = subtitle.substring(0, 46) + "...";
	}

	var list_item = document.createElement("li");
	var link = document.createElement("a");
	link.href = "#";
	link.onclick = function(){
		run_game(system, title);
		return false;
	};
	link.innerHTML = subtitle;	
	list_item.appendChild(link);
	var fav = document.createElement("a");
	fav.href = "#";
	fav.className = "addToFav";
	fav.innerHTML = "+Fav";
	fav.onclick = function(){
		var duplicate = fav_roms.filter(function(obj) {return obj.rom == title;})[0];
		if (duplicate == null){
			fav_roms.push({system: system, rom: title});
			var li_clone = list_item.cloneNode(true);
			li_clone.getElementsByTagName("a")[1].innerHTML = "-Fav";
			li_clone.getElementsByTagName("a")[1].onclick = function(){
				var childIndex = 0;
				var child = this.parentNode;
				for (childIndex; (child = child.previousSibling); childIndex++);
				fav_roms.splice(childIndex, 1);
				this.parentNode.parentNode.removeChild(this.parentNode);
			};
			document.getElementById("fav_roms").appendChild(li_clone);
			//Will break favorite list deletions before application restart
			//sortUL("fav_roms");
			//sort_favs();
		}
		else{
			console.log("Tried to add " + title + " to favorites list, but it was already found in the list.");
		}

	};
	list_item.appendChild(fav);
	return list_item;
}

function add_rom_links(system){

	console.log("Creating links for " + system.name + " roms...")
	var i = 0;
	for (i = 0; i < system.roms.length; i++){
		var sysromlist = document.getElementById(system.id + "_roms");
		var to_add = create_rom_html(system, system.roms[i]);/*
		//////K, so this is for adding Disc numbers to the title in the html. It's messy, yes.
		//It adds the Disc number to the title, but basically clears the already set onclick function i guess?
		var prev = sysromlist.lastChild;
		if (prev != null){
			var prev_tmp = prev.innerHTML.substring(prev.innerHTML, prev.innerHTML.indexOf("</a>"));
			var to_add_tmp = to_add_tmp = to_add.innerHTML.substring(to_add.innerHTML, to_add.innerHTML.indexOf("</a>"));
			if (prev.innerHTML.indexOf("(") != -1){
				prev_tmp = prev.innerHTML.substring(prev.innerHTML, prev.innerHTML.indexOf("("));
			}
			if (to_add.innerHTML.indexOf("(") != -1){
				to_add_tmp = to_add.innerHTML.substring(to_add.innerHTML, to_add.innerHTML.indexOf("("));
			}
			if (prev_tmp == to_add_tmp){
				if (prev.innerHTML.lastIndexOf("(") == -1){
					/*prev.innerHTML = prev.innerHTML + " (Disc 1)";
					to_add.innerHTML = to_add.innerHTML + " (Disc 2)"*//*
					prev.innerHTML = prev_tmp + "(Disc 1)</a>";
					to_add.innerHTML = to_add_tmp + "(Disc 2)</a>"

				}
				else{
					var prev_discnum = parseInt(prev.innerHTML.substring(prev.innerHTML.indexOf("(Disc ") + 6, prev.innerHTML.indexOf("(Disc ") + 7));
					to_add.innerHTML = to_add_tmp + "(Disc " + (prev_discnum + 1) + ")</a>";
				}
			}
		}
		//////*/
		sysromlist.appendChild(to_add);
	}
	console.log("...done. " + i + " " + system.nick + " roms added.");

}


function add_html_section(system){
	var list_a = document.createElement('a');
	list_a.href = '#' + system.id;
	list_a.innerHTML = system.name;
	var list_li = document.createElement('li');
	list_li.appendChild(list_a);
	document.getElementById("system-list").appendChild(list_li);

	var section = document.createElement('section');
	var section_h1 = document.createElement('h1');
	var section_button = document.createElement('button');
	var section_ul = document.createElement('ul');
	section.id = system.id;
	section_h1.innerHTML = system.name;
	section_button.onclick = function(){
		hide_list(system.id + "_roms");
		if (innerHTML == "Hide"){
			innerHTML = "Show";
		}
		else{
			innerHTML = "Hide";
		}
		return false;
	};
	section_button.innerHTML = "Hide";
	section_ul.id = system.id + "_roms";
	section.appendChild(section_h1);
	section.appendChild(section_button);
	section.appendChild(section_ul);
	document.getElementById("system-sections").appendChild(section);
}


var systems = JSON.parse(load_file("systems.json"));
systems.sort(function(a,b){
	if (a.year < b.year)
		return -1;
	if (a.year > b.year)
		return 1;
	return 0;
});

for (var i = 0; i < systems.length; i++){

	add_html_section(systems[i]);

	console.log("Looking for " + systems[i].name + " roms...");
	systems[i].roms = parse_rom_index(systems[i].id + "dir", systems[i].roms);
	console.log("...done.");

	console.log("Adding " + systems[i].name + " rom links to page...");
	add_rom_links(systems[i]);
	console.log("...done.");

}

if (typeof(Storage) !== "undefined") {
	recent_roms = JSON.parse(localStorage.getItem("recent_roms"));
	fav_roms = JSON.parse(localStorage.getItem("fav_roms"));
} else {
	alert("Sorry, your browser does not support Web Storage...?");
}



if (recent_roms != null){
	for (var i = recent_roms.length - 1; i >= 0; i--){
		document.getElementById("recent_roms").appendChild(create_rom_html(recent_roms[i].system, recent_roms[i].rom));
	}
}
else{
	recent_roms = [];
}



if (fav_roms != null){
	for (var i = 0; i < fav_roms.length; i++){
		favhtml = create_rom_html(fav_roms[i].system, fav_roms[i].rom);
		favhtml.getElementsByTagName("a")[1].innerHTML = "-Fav";
		favhtml.getElementsByTagName("a")[1].onclick = function(){
			var childIndex = 0;
			var child = this.parentNode;
			for (childIndex; (child = child.previousSibling); childIndex++);
			fav_roms.splice(childIndex, 1);
			this.parentNode.parentNode.removeChild(this.parentNode);
		};
		document.getElementById("fav_roms").appendChild(favhtml);
	}
}
else{
	fav_roms = [];
}



function clear_recent(){
	localStorage.removeItem("recent_roms");
	recent_roms = [];
	document.getElementById("recent_roms").innerHTML = "";
}

function clear_fav(){
	localStorage.removeItem("fav_roms");
	fav_roms = [];
	document.getElementById("fav_roms").innerHTML = "";
}

function hide_list(list_id){
	var list = document.getElementById(list_id);
	if (list.style.display == "none"){
		list.style.display = "";
	}
	else{
		list.style.display = "none";
	}
}

function sortUL(ul, sortDescending) {
	if(typeof ul == "string")
		ul = document.getElementById(ul);

	// Idiot-proof, remove if you want
	if(!ul) {
		alert("The UL object is null!");
		return;
	}
	
	// Get the list items and setup an array for sorting
	var lis = ul.getElementsByTagName("LI");
	var vals = [];
	
	// Populate the array
	for(var i = 0, l = lis.length; i < l; i++)
		vals.push(lis[i].innerHTML);
	
	// Sort it
	vals.sort();

	// Sometimes you gotta DESC
	if(sortDescending)
		vals.reverse();

	// Change the list on the page
	for(var i = 0, l = lis.length; i < l; i++)
		lis[i].innerHTML = vals[i];
}