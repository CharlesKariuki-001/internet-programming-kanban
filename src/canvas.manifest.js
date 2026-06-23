export const manifest = {
  screens: {
    scr_4gcbj4: { name: "Dashboard", route: "/", state: { "view": "dashboard" }, position: { "x": 160, "y": 220 } },
    scr_of7dxb: { name: "My Boards", route: "/", state: { "view": "boards" }, position: { "x": 1560, "y": 220 } },
    scr_4oqk3e: { name: "Analytics", route: "/", state: { "view": "analytics" }, position: { "x": 2960, "y": 220 } },
    scr_ex6ydv: { name: "Settings", route: "/", state: { "view": "settings" }, position: { "x": 4360, "y": 220 } }
  },
  sections: {
    sec_e74fdu: { name: "Main Navigation", x: 0, y: 0, width: 5720, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_e74fdu", children: [
    { kind: "screen", id: "scr_4gcbj4" },
    { kind: "screen", id: "scr_of7dxb" },
    { kind: "screen", id: "scr_4oqk3e" },
    { kind: "screen", id: "scr_ex6ydv" }]
  }]

};