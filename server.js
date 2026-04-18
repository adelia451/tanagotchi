const fs = require('fs')
const express = require('express')
const app = express()
const path = require('path')
const ANA_FILE = path.join(__dirname, 'ana.json')

app.use(express.static(path.join(__dirname, 'web')))

// read ana.json
function loadAna() {
    const ana = JSON.parse(fs.readFileSync(ANA_FILE, 'utf8'))
    const now = Date.now()

    if (!ana.lastHunger) ana.lastHunger = now
    if (!ana.lastHappiness) ana.lastHappiness = now
    if (!ana.lastEnergy) ana.lastEnergy = now
    if (!ana.lastEvilness) ana.lastEvilness = now

    return ana
}
// save ana.sjon
function saveAna(ana) {
    fs.writeFileSync(ANA_FILE, JSON.stringify(ana, null, 2))
}

// decay
// decay
function applyDecay(ana){
    const now = Date.now()
    const hungerHours = (now - ana.lastHunger) / 3600000
    const happinessHours = (now - ana.lastHappiness) / 3600000
    const energyHours = (now - ana.lastEnergy) / 3600000
    const evilnessHours = (now - ana.lastEvilness) / 3600000

    ana.hunger = Math.max(0, Math.min(100,
        ana.hunger - Math.floor(hungerHours * 2)
    ))
    ana.happiness = Math.max(0, Math.min(100,
        ana.happiness - Math.floor(happinessHours * 2)
    ))
    ana.energy = Math.max(0, Math.min(100,
        ana.energy - Math.floor(energyHours * 2)
    ))
    ana.evilness = Math.max(0, Math.min(100,
        ana.evilness - Math.floor(evilnessHours * 2)
    ))

    ana.lastHunger = now
    ana.lastHappiness = now
    ana.lastEnergy = now
    ana.lastEvilness = now
    return ana
}

// status for webpage
app.get('/status', (req, res) => {
    const ana = loadAna()
    applyDecay(ana)
    saveAna(ana)
    res.json(ana)
})

// // tanagotchi
// app.get('/tanagotchi', (req, res) => {
//     res.end()
// })

// HUNGER ----------
app.post('/feed', (req, res) => {
    const ana = loadAna()
    applyDecay(ana)

    ana.hunger = Math.min(100, ana.hunger + 8)
    ana.lastHunger = Date.now()

    saveAna(ana)
    res.end()
})

// HAPPINESS ----------
app.post(['/compliment', '/hug', '/play'], (req, res) => {
    const ana = loadAna()
    applyDecay(ana)

    ana.happiness = Math.min(100, ana.happiness + 4)
    ana.lastHappiness = Date.now()

    saveAna(ana)
    res.end()
})

//ENERGY ----------
app.post(['/nap', '/kiss'], (req, res) => {
    const ana = loadAna()
    applyDecay(ana)

    ana.energy = Math.min(100, ana.energy + 4)
    ana.lastEnergy = Date.now()
    
    saveAna(ana)
    res.end()
})

// EVILNESS ----------
app.post(['/burp', '/meow', '/raspberry'], (req, res) => {
    const ana = loadAna()
    applyDecay(ana)

    ana.evilness = Math.min(100, ana.evilness + 4)
    ana.lastEvilness = Date.now()

    saveAna(ana)
    res.end()
})

app.listen(3002, () => console.log('running on port 3002'))