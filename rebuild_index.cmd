@echo off
mkdir rom_index
cd rom_index
mkdir backup
copy *.* backup
dir /b /a-d %roms%\32X>32xdir
dir /b /a-d %roms%\3DO | findstr /i /r "\.cue$" >3dodir
dir /b /a-d %roms%\CDI | findstr /i /r "\.cue$" >cdidir
dir /b /ad %roms%\DC>dcdir
dir /b /ad %roms%\DOS>dosdir
dir /b /a-d %roms%\GB>gbdir
dir /b /a-d %roms%\GBA>gbadir
dir /b /a-d %roms%\GCN>gcndir
dir /b /a-d %roms%\GEN>gendir
dir /b /a-d %roms%\JAG>jagdir
dir /b /a-d %roms%\N64>n64dir
dir /b /a-d %roms%\NDS>ndsdir
dir /b /a-d %roms%\NES>nesdir
dir /b /a-d %roms%\PCE>pcedir
dir /b /a-d %roms%\PCECD | findstr /i /r "\.cue$" >pcecddir
dir /b /a-d %roms%\PCFX | findstr /i /r "\.cue$" >pcfxdir
dir /b /a-d %roms%\PS2>ps2dir
dir /b /a-d %roms%\PSP>pspdir
rem dir /b /a-d %roms%\PSX>psxdir
dir /b /a-d %roms%\PSX | findstr /i /r "\.cue$ \.mds$ \.ccd$" >psxdir
dir /b /a-d %roms%\SCD | findstr /i /r "\.cue$" >scddir
dir /b /a-d %roms%\SMS>smsdir
dir /b /a-d %roms%\SNES>snesdir
dir /b /a-d %roms%\SS | findstr /i /r "\.cue$" >ssdir
dir /b /a-d %roms%\Wii>wiidir