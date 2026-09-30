# A1. Demo strategy: Tallgrass multidomain MDM

## Approach
Run one continuous story across 8 acts instead of four domain tabs. Each act uses a shared capability, so the panel sees one platform.

## Use cases grouped by shared capability
| Capability | Use cases | Act |
|---|---|---|
| Match, merge, roles, crosswalk | VEN-02, VEN-08, CUS-02, CUS-04, XD-04 | 1 |
| Validation at entry | VEN-03, VEN-05, VEN-07, MAT-05, MAT-07, FIN-01, CUS-03 | 1, 2, 3 |
| One workflow engine | VEN-01, VEN-04, MAT-02, MAT-08, FIN-05 | 1, 2, 3 |
| Publish and cross-reference | VEN-12, MAT-03, FIN-04, XD-04 | 1, 2 |
| Rules from reference data | MAT-04, XD-05, VEN-09 | 2, 3, 5 |
| Exceptions and audit | XD-02, VEN-13 | 4 |
| Stewardship | XD-07, VEN-11, MAT-06, FIN-03 | 6 |
| Headless and analytics | XD-08, XD-06, VEN-10 | 1, 4, 7 |

## Storyline
Onboard a supplier who is already a customer, launch a SKU, enforce a finance rule, fix a sync failure, react to a sanctions event, then answer a CFO question across both ERPs.

## Inconsistencies in the sheet
1. FIN-01 says GL accounts are 6 digits. FIN-04 says D365 requires 8.
2. VEN-05 asks for IBAN only. US vendors use ABA routing.
3. XD-05 allows 24 hours for block mapping. The sanctions scene needs minutes.
4. MAT-03 wants SKUs visible in SAP before completion. MAT-08 defines no such state.
5. XD-03 and XD-08 overlap.

## Gaps
No scene covers CUS-01, CUS-05, CUS-06 or FIN-02. Add backup scenes or answer in writing.
