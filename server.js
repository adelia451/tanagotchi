const fs = require('fs')
const express = require('express')
const app = express()
app.use(express.static('web'))

// read ana.json
function loadAna() {
    return JSON.parse(fs.readFileSync('ana.json', 'utf8'))
}

// decay
function applyDecay(ana){
    const hungerHours = (Date.now() - ana.lastHunger) / 3600000
    const happinessHours = (Date.now() - ana.lastHappiness) / 3600000
    const energyHours = (Date.now() - ana.lastEnergy) / 3600000
    const evilnessHours = (Date.now() - ana.lastEvilness) / 3600000

    ana.hunger = Math.max(0, Math.min(100, ana.hunger - (hungerHours * 2 )))
    ana.happiness = Math.max(0, Math.min(100, ana.happiness - (happinessHours * 2 )))
    ana.energy = Math.max(0, Math.min(100, ana.energy - (energyHours * 2 )))
    ana.evilness = Math.max(0, Math.min(100, ana.evilness - (evilnessHours * 2 )))

    return ana
}

// save ana.json back
function saveAna(ana) {
    fs.writeFileSync('ana.json', JSON.stringify(ana, null, 2))
}

// status for webpage
app.get('/status', (req, res) => {
    const ana = loadAna()
    applyDecay(ana)
    saveAna(ana)
    res.json(ana)
})

// tanagotchi
app.get('/tanagotchi', (req, res) => {
    res.end()
})

// HUNGER ----------
app.post('/feed', (req, res) => {
    const ana = loadAna()
    applyDecay(ana)

    ana.hunger = Math.min(100, ana.hunger + 4)
    ana.lastHunger = Date.now()

    saveAna(ana)
    res.end()
})

// HAPPINESS ----------
app.post('/compliment', '/hug', '/play', (req, res) => {
    const ana = loadAna()
    applyDecay(ana)

    ana.happiness = Math.min(100, ana.happiness + 2)
    ana.lastHappiness = Date.now()

    saveAna(ana)
    res.end()
})

//ENERGY ----------
app.post('/nap', '/kiss', (req, res) => {
    const ana = loadAna()
    applyDecay(ana)

    ana.energy = Math.min(100, ana.energy + 2)
    ana.lastEnergy = Date.now()
    
    saveAna(ana)
    res.end()
})

// EVILNESS ----------
app.post('/burp', '/meow', '/raspberry', (req, res) => {
    const ana = loadAna()
    applyDecay(ana)

    ana.evilness = Math.min(100, ana.evilness + 2)
    ana.lastEvilness = Date.now()

    saveAna(ana)
    res.end()
})

//app.use matches everything that didnt match above it
app.use((req, res) => {
  res.set('Content-Type', 'text/plain')
  res.send('unknown command (ó﹏ò｡) type "tanagotchi" for commands!')
})

app.listen(80, () => console.log('running on port 80'))
