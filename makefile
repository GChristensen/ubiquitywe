test:
	start web-ext run -p "%APPDATA%/Mozilla/Firefox/Profiles/debug" --keep-profile-changes --browser-console

sign:
	web-ext sign -i ubiquity-settings.json creds web-ext-artifacts marketing screen.png logo.jpg *.md *.iml updates.json `cat $(HOME)/.amo/creds`

chrome:
	rm -f UbiquityWE.zip
	7za a UbiquityWE.zip lib/* res/* commands/* parser/* *.css *.html *.js manifest.json
