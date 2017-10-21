@echo off
Z:
cd %roms%\.launcher\rom_index
copy *.* backup
dir /b /a-d %roms%\GB>gbdir
dir /b /a-d %roms%\GBA>gbadir
dir /b /a-d %roms%\GCN>gcndir
dir /b /a-d %roms%\N64>n64dir
dir /b /a-d %roms%\NDS>ndsdir
dir /b /a-d %roms%\NES>nesdir
dir /b /a-d %roms%\PS2>ps2dir
dir /b /a-d %roms%\PSP>pspdir
dir /b /a-d %roms%\PSX>psxdir
dir /b /a-d %roms%\SNES>snesdir
dir /b /a-d %roms%\Wii>wiidir
rem start %roms%\.launcher\Launcher.exe.lnk
rem "C:\Program Files\Internet Explorer\iexplore.exe" -k "%roms%\.launcher\index.html"