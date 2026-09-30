#!/usr/bin/env python3
"""Tallgrass MDM demo data generator. Fictitious data only. Reproducible: python3 gen_data.py
Writes CSVs to ./data, answer keys to ./data/answer_key, and build/sim_data.json for the simulator."""
import csv, json, os, random, datetime as dt

SEED = 20260930
R = random.Random(SEED)
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "data")
KEY = os.path.join(OUT, "answer_key")
os.makedirs(KEY, exist_ok=True)
os.makedirs(os.path.join(ROOT, "build"), exist_ok=True)
TODAY = dt.date(2026, 9, 30)

# ---------------------------------------------------------------- checksums
def iban(cc, bban_len, bban_seed):
    bban = "".join(str(R.randint(0, 9)) for _ in range(bban_len)) if bban_seed is None else bban_seed
    tmp = bban + cc + "00"
    num = "".join(str(int(c, 36)) for c in tmp)
    chk = 98 - int(num) % 97
    return f"{cc}{chk:02d}{bban}"

def iban_valid(s):
    s = s.replace(" ", "")
    t = s[4:] + s[:4]
    return int("".join(str(int(c, 36)) for c in t)) % 97 == 1

IBAN_LEN = {"DE": 18, "FR": 23, "NL": 14, "DK": 14, "PL": 24, "NO": 11, "GB": 18, "BE": 12}

def make_iban(cc):
    return iban(cc, IBAN_LEN[cc], None)

def aba():
    while True:
        d = [R.randint(0, 9) for _ in range(8)]
        c = (3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + (d[2] + d[5])) % 10
        c = (10 - c) % 10
        s = "".join(map(str, d)) + str(c)
        if s[0] in "0123":
            return s

def gtin13(body12):
    s = sum(int(c) * (3 if i % 2 else 1) for i, c in enumerate(body12))
    return body12 + str((10 - s % 10) % 10)

def gtin_valid(g):
    s = sum(int(c) * (3 if i % 2 else 1) for i, c in enumerate(g[:-1]))
    return (10 - s % 10) % 10 == int(g[-1])

def duns():
    return "".join(str(R.randint(0, 9)) for _ in range(9))

def ein():
    return f"{R.randint(10, 98)}-{R.randint(1000000, 9999999)}"

def vat(cc):
    return {"FR": f"FR{R.randint(10,99)}{R.randint(100000000,999999999)}", "DE": f"DE{R.randint(100000000,999999999)}",
            "DK": f"DK{R.randint(10000000,99999999)}", "PL": f"PL{R.randint(1000000000,9999999999)}",
            "NL": f"NL{R.randint(100000000,999999999)}B01", "NO": f"NO{R.randint(100000000,999999999)}MVA",
            "GB": f"GB{R.randint(100000000,999999999)}", "BE": f"BE0{R.randint(100000000,999999999)}"}[cc]

def wcsv(path, rows, fields=None):
    fields = fields or list(rows[0].keys())
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)

def d(days_ago):
    return (TODAY - dt.timedelta(days=days_ago)).isoformat()

# ---------------------------------------------------------------- requirements (made up, seeded with inconsistencies)
REQS = [
 ("VEN-01","Vendor","Rule-based workflow for vendor create and change","Parallel approvals by Compliance, Finance and Procurement driven by rules","Must"),
 ("VEN-02","Vendor","Add vendor role to an existing party","No duplicate party when a customer becomes a vendor","Must"),
 ("VEN-03","Vendor","Tax ID validation at entry","EIN (US) and VAT (EU) format and checksum validated before submit","Must"),
 ("VEN-04","Vendor","Segregation of duties on bank changes","Requester cannot approve own change; two distinct approvers","Must"),
 ("VEN-05","Vendor","IBAN validation at entry","IBAN checksum (mod 97) validated in portal and in MDM","Must"),
 ("VEN-06","Vendor","Supplier self-service onboarding","Portal for new suppliers and data updates","Should"),
 ("VEN-07","Vendor","Third-party enrichment","DUNS, legal name and address enrichment via platform service","Should"),
 ("VEN-08","Vendor","Duplicate detection across ERPs","Match across SAP, D365 and CRM before create","Must"),
 ("VEN-09","Vendor","Sanctions screening with global block","Sanctions event triggers global block in all ERPs","Must"),
 ("VEN-10","Vendor","Payment terms harmonisation report","Vendors with different terms in SAP and D365, ranked by spend","Should"),
 ("VEN-11","Vendor","Dormant vendor flagging","Flag vendors with no transactions in 18 months","Should"),
 ("VEN-12","Vendor","Publish to SAP and D365","One publish, native mapping, cross-references written back","Must"),
 ("VEN-13","Vendor","Full audit of changes","Every change logged with actor, channel and time","Must"),
 ("CUS-01","Customer","Customer hierarchy","Sold-to, ship-to and bill-to relationships governed","Must"),
 ("CUS-02","Customer","Customer and vendor as one party","One party with two roles, both source keys linked","Must"),
 ("CUS-03","Customer","Address verification","Postal address standardised and verified at entry","Should"),
 ("CUS-04","Customer","Match and merge CRM, D365, e-commerce","Survivorship rules per attribute","Must"),
 ("CUS-05","Customer","Credit block sync","Credit block set in MDM reaches both ERPs","Should"),
 ("CUS-06","Customer","Consent flags on person records","CCPA and GDPR consent stored and synced","Should"),
 ("MAT-01","Material","Core data from producing market","Producing market completes basic data incl. units of measure","Must"),
 ("MAT-02","Material","Market extensions derived from sales orgs","Parallel market tasks created from extensions, not chosen by hand","Must"),
 ("MAT-03","Material","Early publish as Under Creation","SKU visible in SAP before it is fully complete","Should"),
 ("MAT-04","Material","Description from naming rules","Short and long descriptions generated per category rule","Should"),
 ("MAT-05","Material","GTIN validation","GTIN-13 check digit validated and uniqueness enforced","Must"),
 ("MAT-06","Material","Packaging sustainability attributes","PPWR recycled content and ESG material class on packaging","Must"),
 ("MAT-07","Material","Governed unit of measure conversions","Case, pack and pallet conversions validated","Must"),
 ("MAT-08","Material","Status lifecycle","Under Creation, Active, Blocked","Must"),
 ("FIN-01","Finance","GL account naming and length rules","GL accounts must be 6 digits","Must"),
 ("FIN-02","Finance","Cost centre hierarchy governance","Cost centres roll up to approved hierarchy","Must"),
 ("FIN-03","Finance","Profit centre assignment","Every cost centre maps to one profit centre","Should"),
 ("FIN-04","Finance","Chart of accounts sync","CoA published to SAP and D365; D365 main account requires 8 digits","Must"),
 ("FIN-05","Finance","Controller approval","Finance controller approves CoA changes","Must"),
 ("XD-01","Cross-domain","One governed model","Party, product and reference share one model and one workflow engine","Must"),
 ("XD-02","Cross-domain","Error queue with reprocess","Failed ERP syncs visible, explained and reprocessable","Must"),
 ("XD-03","Cross-domain","Same services for every channel","Screen, ERP and agent call the same match, DQ and workflow services","Must"),
 ("XD-04","Cross-domain","Cross-reference keys","Golden ID linked to every source key","Must"),
 ("XD-05","Cross-domain","Global block model","One block model mapped to native ERP values within 24 hours","Must"),
 ("XD-06","Cross-domain","Combined analytics","Spend across both ERPs on the golden ID","Should"),
 ("XD-07","Cross-domain","Stewardship dashboard","One dashboard across all domains","Should"),
 ("XD-08","Cross-domain","Agent access with audit","Agents call the platform through governed APIs, audited like users","Should"),
]
wcsv(os.path.join(OUT, "requirements.csv"),
     [dict(id=a, domain=b, title=c, description=e, priority=f) for a, b, c, e, f in REQS])

CUSTOMER_SHEET_ISSUES = [
 ("FIN-01 vs FIN-04","GL length is 6 digits in FIN-01 but D365 main account requires 8 digits in FIN-04. Demo enforces 8 and flags the conflict."),
 ("VEN-05 vs VEN-01","VEN-05 asks for IBAN only. US vendors use ABA routing and account numbers. Demo validates both."),
 ("XD-05 vs VEN-12","XD-05 says block mapping within 24 hours. The sanctions scene expects minutes. Demo shows minutes; SLA needs a decision."),
 ("MAT-03 vs MAT-08","MAT-03 wants SKU visible in SAP as Under Creation. MAT-08 lifecycle does not define a visible pre-Active state."),
 ("XD-03 vs XD-08","Overlap. XD-08 is the agent case of XD-03. Demo treats XD-08 as a subset."),
]

# ---------------------------------------------------------------- reference data
COUNTRIES = [("US","United States"),("CA","Canada"),("MX","Mexico"),("FR","France"),("DE","Germany"),("DK","Denmark"),
             ("PL","Poland"),("NL","Netherlands"),("NO","Norway"),("GB","United Kingdom"),("BE","Belgium")]
wcsv(os.path.join(OUT, "ref_country.csv"), [dict(code=c, name=n) for c, n in COUNTRIES])

TERMS = [("NT30","Net 30",30),("NT45","Net 45",45),("NT60","Net 60",60),("NT90","Net 90",90),("IMM","Immediate",0),("2N10","2% 10 Net 30",30)]
wcsv(os.path.join(OUT, "ref_payment_terms.csv"),
     [dict(code=c, name=n, days=dd, sap_key=c, d365_key={"NT30":"Net30","NT45":"Net45","NT60":"Net60","NT90":"Net90","IMM":"COD","2N10":"2%10Net30"}[c]) for c, n, dd in TERMS])

BLOCKS = [
 ("GB-SANC","Sanctions block (global)","Posting block + Purchasing block + Payment block","Vendor on hold = All"),
 ("GB-FIN","Finance hold","Central posting block","Vendor on hold = Payment"),
 ("GB-PROC","Procurement hold","Central purchasing block","Vendor on hold = Invoice"),
 ("GB-DORM","Dormant","Central purchasing block","Vendor on hold = Invoice"),
 ("GB-CRED","Credit block","Credit block (customer)","Customer on hold = All"),
 ("GB-LEGAL","Legal hold","Posting + Purchasing block","Vendor on hold = All"),
 ("GB-DUP","Duplicate pending","Central purchasing block","Vendor on hold = Invoice"),
 ("GB-NONE","Not blocked","(blank)","No"),
]
wcsv(os.path.join(OUT, "ref_block_model.csv"),
     [dict(global_code=a, name=b, sap_native=c, d365_native=e) for a, b, c, e in BLOCKS])

wcsv(os.path.join(OUT, "ref_uom.csv"), [dict(code=c, name=n) for c, n in
     [("EA","Each"),("BT","Bottle"),("CN","Can"),("PK","Pack"),("CS","Case"),("PAL","Pallet"),("KG","Kilogram"),("L","Litre"),("HL","Hectolitre")]])

# ---------------------------------------------------------------- finance
COA = []
classes = [(10000000,"Assets"),(20000000,"Liabilities"),(40000000,"Revenue"),(50000000,"Cost of goods sold"),(60000000,"Operating expense")]
names = {"Assets":["Cash","Accounts receivable","Inventory finished goods","Inventory packaging","Prepaid expenses"],
         "Liabilities":["Accounts payable","Accrued expenses","Deposit liability returnables","Tax payable"],
         "Revenue":["Product sales domestic","Product sales export","Returnables deposits revenue","Other revenue"],
         "Cost of goods sold":["Raw materials","Packaging materials","Direct labour","Freight in","Brewing overhead"],
         "Operating expense":["Sales and marketing","Distribution","Utilities","Maintenance","IT services","Professional fees","Travel"]}
for base, cls in classes:
    for i, nm in enumerate(names[cls]):
        COA.append(dict(gl_account=str(base + (i + 1) * 100), name=nm, account_class=cls, source_system="SAP", status="Active"))
COA_ISSUES = []
# seeded: 6 digit, lowercase/free text name, duplicate name
bad = [("600100","Sponsorship misc","Operating expense","FIN-01"),("400200","product sales dom.","Revenue","FIN-01"),
       ("50000999","Raw materials","Cost of goods sold","FIN-01")]
for acc, nm, cl, rq in bad:
    COA.append(dict(gl_account=acc, name=nm, account_class=cl, source_system="D365", status="Draft"))
    COA_ISSUES.append(dict(object="GL", key=acc, issue="Length not 8 digits" if len(acc) != 8 else "Duplicate name of existing account",
                           requirement=rq, expected_action="Reject at entry" if len(acc) != 8 else "Flag as duplicate"))
wcsv(os.path.join(OUT, "fin_chart_of_accounts.csv"), COA)

PC = [("PC-1000","Tallgrass Beverages US"),("PC-2000","Tallgrass Foods US"),("PC-3000","Tallgrass Canada"),("PC-4000","Tallgrass Mexico")]
wcsv(os.path.join(OUT, "fin_profit_centers.csv"), [dict(profit_center=a, name=b) for a, b in PC])
CCS = []
cc_names = ["Brewing KC","Packaging KC","Distribution Midwest","Sales US East","Sales US West","Marketing Brands","IT Shared Services","Finance Shared Services","Sales Canada","Sales Mexico"]
for i, n in enumerate(cc_names):
    CCS.append(dict(cost_center=f"CC-{1001+i}", name=n, profit_center=PC[i % 4][0] if i != 7 else "", parent=f"CC-{1000}" , source_system="SAP"))
COA_ISSUES.append(dict(object="CostCenter", key="CC-1008", issue="No profit centre assigned", requirement="FIN-03", expected_action="Stewardship task"))
wcsv(os.path.join(OUT, "fin_cost_centers.csv"), CCS)

# ---------------------------------------------------------------- parties
ISSUES = []     # seeded issue log
MATCHES = []    # expected match clusters
SOURCE_ROWS = {"SAP": [], "D365": [], "CRM": [], "ECOM": [], "PORTAL": []}
GOLD = []

def add_issue(obj, key, issue, req, action, gid=""):
    ISSUES.append(dict(object=obj, key=key, golden_id=gid, issue=issue, requirement=req, expected_action=action))

prefixA = ["Prairie","Lakeshore","Summit","Cedar","Harbor","Ironwood","Bluestem","Redfield","Northgate","Ashford","Granite","Willow","Meridian","Copperline","Stonebridge","Clearwater","Highplains","Riverbend","Oakmont","Sterling","Blackwater","Fairview","Keystone","Silverleaf","Pinecrest","Eastvale","Westmark","Lonestar","Timberline","Sunfield"]
suffixB = ["Packaging","Logistics","Glass","Malt","Hops","Labels","Cartons","Pallets","Closures","Cans","Freight","Chemicals","Equipment","Foods","Distribution","Returnables","Plastics","Cooling","Print","Supply"]
legal_us = ["LLC","Inc","Corp","Co"]
cities_us = [("Kansas City","MO","64106"),("Omaha","NE","68102"),("Chicago","IL","60601"),("Minneapolis","MN","55401"),("Denver","CO","80202"),("St. Louis","MO","63101"),("Des Moines","IA","50309"),("Tulsa","OK","74103")]
foreign = {"FR":("Lyon","69001"),"DE":("Hamburg","20095"),"DK":("Aarhus","8000"),"PL":("Gdansk","80-001"),"NL":("Rotterdam","3011"),"NO":("Oslo","0150"),"GB":("Leeds","LS1 1AA"),"BE":("Antwerp","2000")}
legal_f = {"FR":"SAS","DE":"GmbH","DK":"ApS","PL":"Sp. z o.o.","NL":"B.V.","NO":"AS","GB":"Ltd","BE":"NV"}

gid_n = [0]
def new_gid():
    gid_n[0] += 1
    return f"G{gid_n[0]:05d}"

def mk_party(name, cc, roles, hero=None):
    gid = new_gid()
    if cc == "US":
        city, st, pc = R.choice(cities_us)
        p = dict(gid=gid, name=name, country="US", city=city, state=st, postcode=pc,
                 street=f"{R.randint(100,9999)} {R.choice(['Main St','Industrial Blvd','Commerce Dr','Rail Ave','Elm St'])}",
                 tax_id=ein(), duns=duns(), bank_type="ABA", bank_key=aba(), bank_acct="".join(str(R.randint(0,9)) for _ in range(10)))
    else:
        city, pc = foreign[cc]
        p = dict(gid=gid, name=name, country=cc, city=city, state="", postcode=pc,
                 street=f"{ {'FR':'Rue du Port','DE':'Hafenstrasse','DK':'Havnegade','PL':'Ulica Portowa','NL':'Industrieweg','NO':'Kaigata','GB':'Dock Road','BE':'Havenstraat'}[cc] } {R.randint(1,99)}",
                 tax_id=vat(cc), duns=duns(), bank_type="IBAN", bank_key=make_iban(cc), bank_acct="")
    p["roles"] = roles
    p["terms_sap"] = R.choice(["NT30","NT45","NT60","NT90"])
    p["terms_d365"] = p["terms_sap"]
    GOLD.append(p)
    return p

def src_row(sysname, p, key, role, changed_days, last_tx_days, name=None, **extra):
    row = dict(sourceSystem=sysname, sourcePrimaryKey=key, name=name or p["name"], roles=role, country=p["country"],
               street=p["street"], city=p["city"], state=p["state"], postcode=p["postcode"], tax_id=p["tax_id"], duns=p["duns"],
               status="Active", bank_type="", bank_key="", bank_acct="", payment_terms="", last_changed=d(changed_days),
               last_transaction=d(last_tx_days) if last_tx_days is not None else "", block="GB-NONE")
    row.update(extra)
    SOURCE_ROWS[sysname].append(row)
    return row

def with_bank(p):
    return dict(bank_type=p["bank_type"], bank_key=p["bank_key"], bank_acct=p["bank_acct"])

seq = {"SAP": 100000, "D365": 0, "CRM": 0, "ECOM": 0, "PORTAL": 0}
def k(sysname):
    seq[sysname] += 1
    return {"SAP": f"V{seq['SAP']}", "D365": f"CUST-{seq['D365']:06d}", "CRM": f"001TG{seq['CRM']:08d}",
            "ECOM": f"WEB-{seq['ECOM']:06d}", "PORTAL": f"SUP-{seq['PORTAL']:05d}"}[sysname]

# ---- hero parties (keys fixed so the simulator script can name them)
# G00001 Prairie Returnables: SAP vendor + D365 customer + CRM account, name variants
p1 = mk_party("Prairie Returnables LLC", "US", "Vendor+Customer")
p1["street"], p1["city"], p1["state"], p1["postcode"] = "410 Industrial Blvd", "Kansas City", "MO", "64106"
for sysname, nm, role, chg, tx in [("SAP","Prairie Returnable Inc","Vendor",80,300),("D365","Prairie Returnables LLC","Customer",250,520),("CRM","Prairie Returnables LLC ","Customer",220,60)]:
    extra = with_bank(p1) if sysname == "SAP" else {}
    if sysname == "SAP": extra["payment_terms"] = "NT60"
    if sysname == "D365": extra["payment_terms"] = "NT30"
    r = src_row(sysname, p1, k(sysname), role, chg, tx, name=nm, **extra)
    if sysname == "SAP":
        r["street"] = "4 Industrial Blvd"
    if sysname == "CRM":
        r["duns"] = p1["duns"]
    if sysname == "D365":
        r["duns"] = ""
MATCHES.append(dict(golden_id=p1["gid"], cluster="Hero dup trio", members="SAP:V100001|D365:CUST-000001|CRM:001TG00000001",
                    rule="Exact tax ID + fuzzy name + address", expected_score="0.97", requirement="VEN-08,CUS-02,CUS-04"))
add_issue("Party","V100001","Vendor and customer are separate records for same legal entity","CUS-02",
          "Merge into one party with Vendor and Customer roles", p1["gid"])

# G00002 glass supplier bought in both ERPs with different terms
p2 = mk_party("Rhone Verre Conteneurs SAS", "FR", "Vendor")
p2["terms_sap"], p2["terms_d365"] = "NT60", "NT30"
src_row("SAP", p2, k("SAP"), "Vendor", 120, 4, payment_terms="NT60", **with_bank(p2))
src_row("D365", p2, k("D365"), "Vendor", 200, 9, payment_terms="NT30", **with_bank(p2))
add_issue("Party","V100002","Payment terms differ between SAP (NT60) and D365 (NT30)","VEN-10","Include in harmonisation list", p2["gid"])
MATCHES.append(dict(golden_id=p2["gid"], cluster="Glass supplier both ERPs", members="SAP:V100002|D365:CUST-000002",
                    rule="Exact VAT", expected_score="1.00", requirement="VEN-08,XD-06"))

# G00003 PET preforms, G00004 sanctions target
p3 = mk_party("Great Lakes PET Preforms Inc", "US", "Vendor")
src_row("SAP", p3, k("SAP"), "Vendor", 90, 12, payment_terms="NT45", **with_bank(p3))
src_row("D365", p3, k("D365"), "Vendor", 140, 20, payment_terms="NT45", **with_bank(p3))
p4 = mk_party("Baltic Freight Sp. z o.o.", "PL", "Vendor")
src_row("SAP", p4, k("SAP"), "Vendor", 60, 30, payment_terms="NT30", **with_bank(p4))
src_row("D365", p4, k("D365"), "Vendor", 100, 45, payment_terms="NT30", **with_bank(p4))
add_issue("Party","V100004","Sanctions list hit (simulated event)","VEN-09","Apply GB-SANC global block in SAP and D365", p4["gid"])

# G00005 new supplier from portal with invalid IBAN at entry
p5 = mk_party("Nordvik Kartonage AS", "NO", "Vendor")
good_iban = p5["bank_key"]
bad_iban = good_iban[:-1] + str((int(good_iban[-1]) + 1) % 10)
assert iban_valid(good_iban) and not iban_valid(bad_iban)
src_row("PORTAL", p5, k("PORTAL"), "Vendor", 1, None, payment_terms="NT30", bank_type="IBAN", bank_key=bad_iban, status="Draft")
SOURCE_ROWS["PORTAL"][-1]["duns"] = ""
add_issue("Party","SUP-00001","IBAN checksum fails at portal entry","VEN-05","Reject, supplier corrects IBAN", p5["gid"])

# ---- bulk parties
vend_names = set()
def rand_name(cc):
    while True:
        n = f"{R.choice(prefixA)} {R.choice(suffixB)} " + (R.choice(legal_us) if cc == "US" else legal_f[cc])
        if n not in vend_names:
            vend_names.add(n)
            return n

bulk_roles = ["Vendor"] * 26 + ["Customer"] * 22 + ["Vendor+Customer"] * 4
dorm_keys = []
for i, role in enumerate(bulk_roles):
    cc = "US" if R.random() < 0.6 else R.choice(list(foreign))
    if role == "Customer" and cc != "US":
        cc = R.choice(["US", "CA", "MX"]) if False else "US"
    p = mk_party(rand_name(cc), cc, role)
    if "Vendor" in role:
        terms_s = p["terms_sap"]
        src_row("SAP", p, k("SAP"), "Vendor" if role == "Vendor" else "Vendor", R.randint(20, 400), R.randint(3, 200), payment_terms=terms_s, **with_bank(p))
        if R.random() < 0.35:
            t2 = R.choice([x for x in ["NT30","NT45","NT60","NT90"] if x != terms_s]) if R.random() < 0.4 else terms_s
            p["terms_d365"] = t2
            src_row("D365", p, k("D365"), "Vendor", R.randint(20, 400), R.randint(3, 200), payment_terms=t2, **with_bank(p))
            if t2 != terms_s:
                add_issue("Party", SOURCE_ROWS["D365"][-1]["sourcePrimaryKey"], f"Payment terms differ SAP {terms_s} vs D365 {t2}", "VEN-10", "Include in harmonisation list", p["gid"])
    if "Customer" in role:
        src_row("D365", p, k("D365"), "Customer", R.randint(20, 400), R.randint(3, 200), payment_terms="NT30")
        if R.random() < 0.7:
            src_row("CRM", p, k("CRM"), "Customer", R.randint(5, 300), R.randint(1, 120))
        if R.random() < 0.3:
            src_row("ECOM", p, k("ECOM"), "Customer", R.randint(5, 300), R.randint(1, 60))

# ---- seeded DQ issues on source rows
def pick(sysname, cond=lambda r: True, n=1):
    pool = [r for r in SOURCE_ROWS[sysname] if cond(r) and r["sourcePrimaryKey"] not in {"V100001","V100002","V100004"}]
    return R.sample(pool, n)

for r in pick("SAP", lambda r: r["bank_type"] == "IBAN", 3):
    r["bank_key"] = r["bank_key"][:-1] + str((int(r["bank_key"][-1]) + 3) % 10)
    add_issue("Party", r["sourcePrimaryKey"], "IBAN checksum invalid in source", "VEN-05", "Flag, steward corrects")
for r in pick("SAP", lambda r: True, 3):
    r["tax_id"] = ""
    add_issue("Party", r["sourcePrimaryKey"], "Tax ID missing", "VEN-03", "Flag, request from supplier")
for r in pick("SAP", lambda r: True, 4):
    r["last_transaction"] = d(R.randint(600, 900))
    dorm_keys.append(r["sourcePrimaryKey"])
    add_issue("Party", r["sourcePrimaryKey"], "No transactions in more than 18 months", "VEN-11", "Flag dormant, propose GB-DORM block")
for r in pick("CRM", lambda r: True, 3):
    r["street"] = r["street"].upper().replace(" ST", " Street") + " "
    r["city"] = r["city"].lower()
    add_issue("Party", r["sourcePrimaryKey"], "Address not standardised (case and spacing)", "CUS-03", "Standardise and verify")
for r in pick("D365", lambda r: r["roles"] == "Customer", 2):
    r["country"] = {"US": "USA"}.get(r["country"], r["country"] + " ")
    add_issue("Party", r["sourcePrimaryKey"], "Country code not ISO alpha-2", "CUS-03", "Fix against reference data")

# extra duplicates across CRM and ECOM for customers
cust_rows = [r for r in SOURCE_ROWS["CRM"] if r["sourcePrimaryKey"] != "001TG00000001"]
for r in R.sample(cust_rows, 4):
    g = next(x for x in GOLD if x["tax_id"] == r["tax_id"])
    nm = r["name"].replace(" LLC", "").replace(" Inc", "") + " " + R.choice(["Co", "Inc", "LLC"])
    src_row("ECOM", g, k("ECOM"), "Customer", R.randint(5, 100), R.randint(1, 30), name=nm)
    MATCHES.append(dict(golden_id=g["gid"], cluster="CRM/ECOM name variant",
                        members=f"CRM:{r['sourcePrimaryKey']}|ECOM:{SOURCE_ROWS['ECOM'][-1]['sourcePrimaryKey']}", rule="Fuzzy name + address",
                        expected_score="0.93", requirement="CUS-04"))
    add_issue("Party", SOURCE_ROWS["ECOM"][-1]["sourcePrimaryKey"], "Duplicate of CRM account with different legal suffix", "CUS-04", "Merge", g["gid"])

for sysname in SOURCE_ROWS:
    if SOURCE_ROWS[sysname]:
        wcsv(os.path.join(OUT, f"party_{sysname.lower()}.csv"), SOURCE_ROWS[sysname])

# golden + crosswalk answer keys
cw = []
for sysname, rows in SOURCE_ROWS.items():
    for r in rows:
        g = next((x for x in GOLD if x["tax_id"] == r["tax_id"] and x["country"] == r["country"]), None)
        if g is None:
            g = next((x for x in GOLD if x["name"].split()[0] == r["name"].split()[0] and x["country"][:2] == str(r["country"]).strip()[:2]), None)
        cw.append(dict(sourceSystem=sysname, sourcePrimaryKey=r["sourcePrimaryKey"], golden_id=g["gid"] if g else ""))
wcsv(os.path.join(KEY, "expected_crosswalk.csv"), cw)
wcsv(os.path.join(KEY, "expected_golden_parties.csv"), [dict(golden_id=g["gid"], name=g["name"], roles=g["roles"], country=g["country"], tax_id=g["tax_id"]) for g in GOLD])
wcsv(os.path.join(KEY, "expected_matches.csv"), MATCHES)

# ---------------------------------------------------------------- products
MATS = []
def mat(mid, kind, desc, uom, plant_mkts, gtin="", prod_mkt="US", status="Active", **ex):
    row = dict(sourceSystem="SAP", sourcePrimaryKey=mid, material_type=kind, description=desc, base_uom=uom, gtin=gtin,
               producing_market=prod_mkt, market_extensions=plant_mkts, status=status, recycled_content_pct="", esg_material_class="",
               case_qty="", pallet_cases="")
    row.update(ex)
    MATS.append(row)
    return row

brands = [("Tallgrass Amber Lager","Lager"),("Tallgrass Prairie IPA","IPA"),("Tallgrass Wheat Ale","Wheat"),("Tallgrass Hard Seltzer Lime","Seltzer"),("Tallgrass Root Beer","Soda"),("Tallgrass Cold Brew","Coffee")]
packs = [("12oz can 6pk",6,"CN"),("12oz can 12pk",12,"CN"),("16oz can 4pk",4,"CN"),("12oz bottle 6pk",6,"BT")]
n = 0
for bname, style in brands:
    for pn, q, u in packs[:R.randint(2, 4)]:
        n += 1
        g = gtin13("0" + "".join(str(R.randint(0, 9)) for _ in range(11)))
        mat(f"FG{n:05d}", "FG", f"{bname} {pn}".upper()[:40], "PK", "US|CA" if R.random() < .6 else "US", g, "US", "Active", case_qty=4, pallet_cases=R.choice([60, 72, 80]))
# hero SKU
hero = mat("FG90001", "FG", "TALLGRASS AMBER LAGER 12OZ CAN 6PK", "PK", "US", gtin13("0" + "85000" + "123456"), "US", "Under Creation", case_qty=4, pallet_cases=72)
add_issue("Material","FG90001","New SKU: producing market completes basic data; CA and MX extensions pending","MAT-01,MAT-02,MAT-03","Early publish as Under Creation; parallel market tasks")
for i in range(12):
    kind = R.choice(["PKG-CAN","PKG-BOTTLE","PKG-CARTON","PKG-LABEL"])
    rc = R.choice([0, 25, 50, 70, 85])
    cls = {"PKG-CAN":"Aluminium","PKG-BOTTLE":"Glass","PKG-CARTON":"Paperboard","PKG-LABEL":"Paper"}[kind]
    mat(f"PK{i+1:05d}", kind, f"{kind[4:]} {R.choice(['12oz','16oz','330ml','500ml'])} TG spec {i+1}", "EA", "US", "", "US", "Active", recycled_content_pct=rc, esg_material_class=cls)
for i in range(10):
    mat(f"RM{i+1:05d}", "RAW", R.choice(["Malt barley","Hops Cascade","Hops Citra","Yeast ale","Corn syrup","Cane sugar","Water treatment","CO2 food grade","Wheat malt","Lime concentrate"]) + f" lot spec {i+1}", "KG", "US", "", "US")
for i in range(8):
    mat(f"MR{i+1:05d}", "MRO", R.choice(["Conveyor belt","Filler valve kit","Gasket set","Pump seal","Sensor PT100","Forklift battery","Safety gloves","Cleaning agent CIP"]) + f" {i+1}", "EA", "US", "", "US")
# seeded issues
fg_rows = [m for m in MATS if m["material_type"] == "FG" and m["sourcePrimaryKey"] != "FG90001"]
for m in R.sample(fg_rows, 3):
    m["gtin"] = m["gtin"][:-1] + str((int(m["gtin"][-1]) + 2) % 10)
    assert not gtin_valid(m["gtin"])
    add_issue("Material", m["sourcePrimaryKey"], "GTIN check digit invalid", "MAT-05", "Reject at entry or flag")
for m in R.sample([m for m in MATS if m["material_type"].startswith("PKG")], 4):
    m["recycled_content_pct"] = ""
    m["esg_material_class"] = ""
    add_issue("Material", m["sourcePrimaryKey"], "Packaging missing PPWR recycled content and ESG class", "MAT-06", "Stewardship task")
for m in R.sample(fg_rows, 3):
    m["case_qty"] = ""
    m["pallet_cases"] = ""
    add_issue("Material", m["sourcePrimaryKey"], "UoM conversion missing (case and pallet)", "MAT-07", "Request from producing market")
for m in R.sample(fg_rows, 2):
    m["description"] = m["description"].title().replace("Tallgrass", "tallgrass") + " xx"
    add_issue("Material", m["sourcePrimaryKey"], "Description breaks naming rule", "MAT-04", "Regenerate from rule")
wcsv(os.path.join(OUT, "product_materials.csv"), MATS)

# ---------------------------------------------------------------- spend
hero_keys = {"G00001": [("SAP","V100001")], "G00002": [("SAP","V100002"),("D365","CUST-000002")], "G00003": [("SAP","V100003"),("D365","CUST-000003")]}
vend_rows = {}
for sysname in ("SAP", "D365"):
    for r in SOURCE_ROWS[sysname]:
        if "Vendor" in r["roles"]:
            vend_rows.setdefault(sysname, []).append(r)
SPEND = []
def add_spend(sysname, r, amt, days, cat):
    SPEND.append(dict(sourceSystem=sysname, sourcePrimaryKey=f"INV-{len(SPEND)+1:06d}", vendor_key=r["sourcePrimaryKey"], posting_date=d(days),
                      amount_usd=round(amt, 2), category=cat, payment_terms=r["payment_terms"]))
cats = ["Glass bottles","Aluminium cans","Cartons","Labels","Freight","Raw materials","Maintenance","IT services"]
for sysname, rows in vend_rows.items():
    for r in rows:
        for _ in range(R.randint(3, 14)):
            add_spend(sysname, r, R.uniform(1500, 90000), R.randint(1, 360), R.choice(cats))
# glass supplier bigger spend so the CFO question has a meaningful answer
g_sap = next(r for r in SOURCE_ROWS["SAP"] if r["sourcePrimaryKey"] == "V100002")
g_d365 = next(r for r in SOURCE_ROWS["D365"] if r["name"].startswith("Rhone"))
for i in range(22):
    add_spend("SAP", g_sap, R.uniform(40000, 180000), R.randint(1, 360), "Glass bottles")
for i in range(9):
    add_spend("D365", g_d365, R.uniform(20000, 90000), R.randint(1, 360), "Glass bottles")
wcsv(os.path.join(OUT, "spend_transactions.csv"), SPEND)

# ---------------------------------------------------------------- answer keys
wcsv(os.path.join(KEY, "seeded_issues.csv"), ISSUES + [dict(object=x["object"], key=x["key"], golden_id="", issue=x["issue"], requirement=x["requirement"], expected_action=x["expected_action"]) for x in COA_ISSUES])
wcsv(os.path.join(KEY, "customer_sheet_inconsistencies.csv"), [dict(ref=a, finding=b) for a, b in CUSTOMER_SHEET_ISSUES])

# ---------------------------------------------------------------- simulator payload
glass_total = {s: round(sum(x["amount_usd"] for x in SPEND if x["vendor_key"] == (g_sap if s == "SAP" else g_d365)["sourcePrimaryKey"] and x["sourceSystem"] == s), 2) for s in ("SAP", "D365")}
vend_sys = {}
for s in SPEND:
    vend_sys.setdefault(s["vendor_key"], set()).add(s["sourceSystem"])
multi = []
by_gid = {}
for cwrow in cw:
    by_gid.setdefault(cwrow["golden_id"], []).append((cwrow["sourceSystem"], cwrow["sourcePrimaryKey"]))
for gid, keys in by_gid.items():
    sk = [x for x in keys if x[0] == "SAP" and any(r["sourcePrimaryKey"] == x[1] and "Vendor" in r["roles"] for r in SOURCE_ROWS["SAP"])]
    dk = [x for x in keys if x[0] == "D365" and any(r["sourcePrimaryKey"] == x[1] and "Vendor" in r["roles"] for r in SOURCE_ROWS["D365"])]
    if sk and dk:
        sr = next(r for r in SOURCE_ROWS["SAP"] if r["sourcePrimaryKey"] == sk[0][1]); dr = next(r for r in SOURCE_ROWS["D365"] if r["sourcePrimaryKey"] == dk[0][1])
        sp = sum(x["amount_usd"] for x in SPEND if x["vendor_key"] in (sk[0][1], dk[0][1]))
        multi.append(dict(gid=gid, name=next(g["name"] for g in GOLD if g["gid"] == gid), sap=sr["payment_terms"], d365=dr["payment_terms"], spend=round(sp)))
multi.sort(key=lambda x: -x["spend"])

def first(sysname, key):
    return next(r for r in SOURCE_ROWS[sysname] if r["sourcePrimaryKey"] == key)

payload = dict(
    hero=[first("SAP","V100001"), first("D365","CUST-000001"), first("CRM","001TG00000001")],
    sample={s: SOURCE_ROWS[s][:14] for s in SOURCE_ROWS},
    portal=SOURCE_ROWS["PORTAL"][0], portal_good_iban=good_iban,
    glass=dict(gid=p2["gid"], name=p2["name"], sap_key="V100002", d365_key=g_d365["sourcePrimaryKey"], sap_spend=glass_total["SAP"], d365_spend=glass_total["D365"], sap_terms="NT60", d365_terms="NT30"),
    multi=multi[:8],
    sanc=dict(gid=p4["gid"], name=p4["name"]),
    pet=dict(gid=p3["gid"], name=p3["name"]),
    hero_mat=hero, mats=MATS[:14],
    coa=COA[:18] + COA[-3:], cc=CCS,
    blocks=[dict(g=a, n=b, sap=c, d365=e) for a, b, c, e in BLOCKS],
    terms=[dict(code=a, name=b, days=c) for a, b, c in TERMS],
    issues=ISSUES[:40],
    reqs=[dict(id=a, domain=b, title=c) for a, b, c, e, f in REQS],
    counts=dict(source_records=sum(len(v) for v in SOURCE_ROWS.values()), golden_parties=len(GOLD), materials=len(MATS), gl=len(COA), spend=len(SPEND), issues=len(ISSUES) + len(COA_ISSUES)),
    dorm=dorm_keys,
    issue_by_domain={"Party": sum(1 for i in ISSUES if i["object"] == "Party"), "Material": sum(1 for i in ISSUES if i["object"] == "Material"), "Finance": len(COA_ISSUES)},
)
with open(os.path.join(ROOT, "build", "sim_data.json"), "w") as f:
    json.dump(payload, f)
print(json.dumps(payload["counts"]), "issues by domain", payload["issue_by_domain"])
