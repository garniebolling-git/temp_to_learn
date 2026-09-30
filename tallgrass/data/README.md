# Tallgrass demo data

All data is fictitious. Regenerate with `python3 gen_data.py` (fixed seed 20260930, output is identical on every run).
Every source row carries `sourceSystem` and `sourcePrimaryKey`. IBAN (mod 97), ABA routing and GTIN-13 check digits are valid except where an issue is seeded on purpose.

## Load order
1. ref_country.csv, ref_uom.csv, ref_payment_terms.csv, ref_block_model.csv
2. fin_profit_centers.csv, fin_cost_centers.csv, fin_chart_of_accounts.csv
3. party_sap.csv, party_d365.csv, party_crm.csv, party_ecom.csv, party_portal.csv
4. product_materials.csv
5. spend_transactions.csv (used by analytics only, not loaded into MDM)

## Not for loading
- requirements.csv: invented requirement sheet (40 IDs)
- answer_key/seeded_issues.csv: every planted defect with requirement ID and expected action
- answer_key/expected_matches.csv: clusters the match rules must find
- answer_key/expected_crosswalk.csv and expected_golden_parties.csv: expected golden IDs
- answer_key/customer_sheet_inconsistencies.csv: five planted conflicts in the requirement sheet

## Hero records
G00001 Prairie Returnables (SAP vendor, D365 customer, CRM account), G00002 Rhone Verre Conteneurs (glass, both ERPs, NT60 vs NT30), G00003 Great Lakes PET Preforms, G00004 Baltic Freight (sanctions), G00005 Nordvik Kartonage (portal, bad IBAN), FG90001 (new SKU).
