#!/usr/bin/env python3
"""Inline build/sim_data.json into sim_template.html -> Tallgrass_MDM_Demo_Simulator.html"""
import json, os
root = os.path.dirname(os.path.abspath(__file__))
data = open(os.path.join(root, "build", "sim_data.json")).read()
html = open(os.path.join(root, "sim_template.html")).read().replace("/*__DATA__*/null", data)
open(os.path.join(root, "Tallgrass_MDM_Demo_Simulator.html"), "w").write(html)
print("built", len(html), "bytes")
