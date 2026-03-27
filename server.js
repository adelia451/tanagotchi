const fs = require('fs')
const express = require('express')
const app = express()
app.use(express.static('web'))

// read pet.json
function loadPet() {
    return JSON.parse(fs.readFileSync('pet.json', 'utf8'))
}

// decay
function applyDecay(pet){
    const hungerHours = (Date.now() - pet.lastHunger) / 3600000
    const happinessHours = (Date.now() - pet.lastHappiness) / 3600000
    const energyHours = (Date.now() - pet.lastEnergy) / 3600000
    const evilnessHours = (Date.now() - pet.lastEvilness) / 3600000

    pet.hunger = Math.max(0, Math.min(100, pet.hunger - (hungerHours * 2 )))
    pet.happiness = Math.max(0, Math.min(100, pet.happiness - (happinessHours * 2 )))
    pet.energy = Math.max(0, Math.min(100, pet.energy - (energyHours * 2 )))
    pet.evilness = Math.max(0, Math.min(100, pet.evilness - (evilnessHours * 2 )))

    return pet
}

// save pet.json back
function savePet(pet) {
    fs.writeFileSync('pet.json', JSON.stringify(pet, null, 2))
}

// status for webpage
app.get('/status', (req, res) => {
    const pet = loadPet()
    applyDecay(pet)
    savePet(pet)
    res.json(pet)
})

// tanagotchi
app.get('/tanagotchi', (req, res) => {
    res.end()
})

// HUNGER ----------
app.post('/feed', (req, res) => {
    const pet = loadPet()
    applyDecay(pet)

    pet.hunger = Math.min(100, pet.hunger + 4)
    pet.lastHunger = Date.now()

    savePet(pet)
    res.end()
})

// HAPPINESS ----------
app.post('/compliment', '/hug', '/play', (req, res) => {
    const pet = loadPet()
    applyDecay(pet)

    pet.happiness = Math.min(100, pet.happiness + 2)
    pet.lastHappiness = Date.now()

    savePet(pet)
    res.end()
})

//ENERGY ----------
app.post('/nap', '/kiss', (req, res) => {
    const pet = loadPet()
    applyDecay(pet)

    pet.energy = Math.min(100, pet.energy + 2)
    pet.lastEnergy = Date.now()
    
    savePet(pet)
    res.end()
})

// EVILNESS ----------
app.post('/burp', '/meow', '/raspberry', (req, res) => {
    const pet = loadPet()
    applyDecay(pet)

    pet.evilness = Math.min(100, pet.evilness + 2)
    pet.lastEvilness = Date.now()

    savePet(pet)
    res.end()
})

//app.use matches everything that didnt match above it
app.use((req, res) => {
  res.set('Content-Type', 'text/plain')
  res.send('unknown command (ó﹏ò｡) type "tanagotchi" for commands!')
})

app.listen(80, () => console.log('running on port 80'))
