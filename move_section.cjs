const fs = require('fs');
const content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
const lines = content.split('\n');

// Find start and end of "TRAJECTOIRE & LANCEMENT"
const startIdx = lines.findIndex(l => l.includes('{/* TRAJECTOIRE & LANCEMENT */}'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('</AnimatePresence>'));

if (startIdx !== -1 && endIdx !== -1) {
    const section = lines.splice(startIdx, endIdx - startIdx + 1);
    const textAfterDelete = lines.join('\n');
    
    // Find the place to insert: 
    // Look for:
    //             </button>
    //           </div>
    // 
    //           <div className="flex bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-1 backdrop-blur-sm">
    //             <button
    //               onClick={() => setSelectionMode('target')}
    
    // We will insert right after the Mode switch closing div.
    const modeSwitchRegex = /(<button[^>]*onClick={\(\) => setSimulationMode\('ballistic'\)}[^>]*>[\s\S]*?<\/button>\s*<\/div>)/;
    
    let newContent = textAfterDelete.replace(modeSwitchRegex, `$1\n\n${section.join('\n')}\n`);
    
    fs.writeFileSync('src/components/Sidebar.tsx', newContent, 'utf-8');
    console.log("Section moved successfully.");
} else {
    console.log("Could not find section.");
}
