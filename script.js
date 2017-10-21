var dir_emu = "%emu%/";
var dir_roms = "%roms%/";
var exe_retroarch = dir_emu + "RetroArch/retroarch.exe";
var exe_gb = exe_retroarch;
var exe_gba = exe_retroarch;
var exe_gcn = dir_emu + "Dolphin-x64/Dolphin.exe";
var exe_n64 = exe_retroarch;
var exe_nds = dir_emu + "DeSmuME X432R/DeSmuME_X432R_x64.exe";
var exe_nes = exe_retroarch;
var exe_ps2 = "C:/Program Files (x86)/PCSX2 1.4.0/pcsx2.exe";
var exe_psp = dir_emu + "ppsspp/PPSSPPWindows64.exe";
var exe_psx = dir_emu + "ePSXe200/ePSXe.exe";
var exe_snes = exe_retroarch;
var exe_wii = dir_emu + "Dolphin-x64/Dolphin.exe";
var switch_gb = "-f -L " + dir_emu + "RetroArch/cores/gambatte_libretro.dll";
var switch_gba = "-f -L " + dir_emu + "RetroArch/cores/mgba_libretro.dll";
var switch_gcn = "/b /e";
var switch_n64 = "-f -L " + dir_emu + "RetroArch/cores/mupen64plus_libretro.dll";
var switch_nds = "";
var switch_nes = "-f -L " + dir_emu + "RetroArch/cores/nestopia_libretro.dll";
var switch_ps2 = "--fullscreen --nogui --noguiprompt";
var switch_psp = "";
var switch_psx = "-nogui -loadbin";
var switch_snes = "-f -L " + dir_emu + "RetroArch/cores/bsnes_accuracy_libretro.dll";
var switch_wii = "/b /e";
var romlist_gb = [];
var romlist_gba = [];
var romlist_gcn = [];
var romlist_n64 = [];
var romlist_nds = [];
var romlist_nes = [];
var romlist_ps2 = [];
var romlist_psp = [];
var romlist_psx = [];
var romlist_snes = [];
var romlist_wii = [];
var romlist_recent = [];


function exec_cmd(command){
	var ws = new ActiveXObject("WScript.Shell");
	console.log("Executing command: " + command);
	ws.Exec(command);
}

function run_game(emu, switches, rom) {
	console.log("Someone said this to me (I am run_game):");
	console.log("run_game(" + emu + ", " + switches + ", " + rom + ");");
	var command = "\"" + emu + "\"" + " " + switches + " " + "\"" + dir_roms + rom + "\"";
	exec_cmd(command);
}

function exitar(){
	window.open('close.html', '_self');
}

function parse_rom_index(indexfile, romlist){
	console.log("Loading rom index \"" + indexfile + "\"...");
	var client = new ActiveXObject("MSXML2.XMLHTTP");
	var file_text = "";
	client.open('GET', 'rom_index/' + indexfile);
	client.onreadystatechange = function() {
		file_text = client.responseText;
	}
	client.send();
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

function create_rom_html(exe, swtch, path, title){
	var list_item = document.createElement("li");
	var subtitle = title;
	if (title.length > 40){
		subtitle = title.substring(0, 38) + "...";
	}

	var rompath = '"' + path + "/" +title + "'";
	var link = document.createElement("a");
	link.href = "#";
	link.onclick = function(){
		run_game(exe, swtch, path + "/" + title);
		return false;
	};
	link.innerHTML = subtitle;
	list_item.appendChild(link);


	return list_item;
}

function add_rom_links(console_id){
	var exe = "emu_not_found";
	var swtch = "";
	var path = console_id;
	var romlist = [];
	if (console_id == "gb"){
		exe = exe_gb;
		swtch = switch_gb;
		romlist = romlist_gb;
	}
	if (console_id == "gba"){
		exe = exe_gba;
		swtch = switch_gba;
		romlist = romlist_gba;
	}
	if (console_id == "gcn"){
		exe = exe_gcn;
		swtch = switch_gcn;
		romlist = romlist_gcn;
	}
	if (console_id == "n64"){
		exe = exe_n64;
		swtch = switch_n64;
		romlist = romlist_n64;
	}
	if (console_id == "nds"){
		exe = exe_nds;
		swtch = switch_nds;
		romlist = romlist_nds;
	}
	if (console_id == "nes"){
		exe = exe_nes;
		swtch = switch_nes;
		romlist = romlist_nes;
	}
	if (console_id == "ps2"){
		exe = exe_ps2;
		swtch = switch_ps2;
		romlist = romlist_ps2;
	}
	if (console_id == "psp"){
		exe = exe_psp;
		swtch = switch_psp;
		romlist = romlist_psp;
	}
	if (console_id == "psx"){
		exe = exe_psx;
		swtch = switch_psx;
		romlist = romlist_psx;
	}
	if (console_id == "snes"){
		exe = exe_snes;
		swtch = switch_snes;
		romlist = romlist_snes;
	}
	if (console_id == "wii"){
		exe = exe_wii;
		swtch = switch_wii;
		romlist = romlist_wii;
	}

	console.log("Creating links for " + console_id + " roms...")
	var i = 0;
	for (i = 0; i < romlist.length; i++){
		document.getElementById(console_id + "_roms").appendChild(create_rom_html(exe, swtch, path, romlist[i]));
	}
	console.log("...done. " + i + " " + console_id + " roms added.");

}

/**
*This don't werk
*/
/*
//Rebuilds rom index by reading contents of each rom directory
console.log("Rebuilding rom index...");
exec_cmd(dir_roms + ".launcher\\rebuild_index.cmd");
console.log("...done.");
*/

//Loads rom index for each system into JS variables
console.log("Loading rom index into javascript...");
romlist_gb = parse_rom_index("gbdir", romlist_gb);
romlist_gba = parse_rom_index("gbadir", romlist_gba);
romlist_gcn = parse_rom_index("gcndir", romlist_gcn);
romlist_n64 = parse_rom_index("n64dir", romlist_n64);
romlist_nds = parse_rom_index("ndsdir", romlist_nds);
romlist_nes = parse_rom_index("nesdir", romlist_nes);
romlist_ps2 = parse_rom_index("ps2dir", romlist_ps2);
romlist_psp = parse_rom_index("pspdir", romlist_psp);
romlist_psx = parse_rom_index("psxdir", romlist_psx);
romlist_snes = parse_rom_index("snesdir", romlist_snes);
romlist_wii = parse_rom_index("wiidir", romlist_wii);
console.log("...done");

//Populates the html with anchor links to launch games listed in rom directory
console.log("Adding available roms to html...");
add_rom_links("gb");
add_rom_links("gba");
add_rom_links("gcn");
add_rom_links("n64");
add_rom_links("nds");
add_rom_links("nes");
add_rom_links("ps2");
add_rom_links("psp");
add_rom_links("psx");
add_rom_links("snes");
add_rom_links("wii");
console.log("...done");