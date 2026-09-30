# Tallgrass MDM demo package (fictitious)

| Step | File |
|---|---|
| A1 Strategy | A1_Demo_Strategy.md |
| A2 Script | Tallgrass_Demo_Script.docx |
| A3 Data | data/ (run `python3 gen_data.py`) |
| A4 Build plan | Tallgrass_Build_Plan.docx |
| A5 to A7 Simulator | Tallgrass_MDM_Demo_Simulator.html (single file, works offline; Play, change tracking, green theme, logo slot) |

Rebuild: `python3 gen_data.py && python3 build.py` then `cd build && npm install docx && node make_script.js && node make_plan.js`.
