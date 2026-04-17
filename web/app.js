function updateStatus(){
    fetch('https://tanagotchi.mimobox.sh/status')
        .then(res => res.json())
        .then(ana => {
            // update bars
            document.getElementById('hunger-fill').style.width = ana.hunger + '%'
            document.getElementById('happiness-fill').style.width = ana.happiness + '%'
            document.getElementById('energy-fill').style.width = ana.energy + '%'
            document.getElementById('evilness-fill').style.width = ana.evilness + '%'

            //update text
            document.getElementById('hunger-val').textContent = ana.hunger
            document.getElementById('happiness-val').textContent = ana.happiness
            document.getElementById('energy-val').textContent = ana.energy
            document.getElementById('evilness-val').textContent = ana.evilness

            // image swap
            const img = document.getElementById('tanagotchi-image')
    
            const isHappy = ana.hunger >= 75 && ana.happiness >= 75 && ana.energy >= 75 && ana.evilness >=75
            if (ana.hunger <=45 || ana.happiness <= 45 || ana.energy <= 45 || ana.evilness <= 45 ){
                img.src = 'ana_sad.png'
            } else if (isHappy && ana.evilness >= 90) {
                img.src = 'ana_evil.png'
            } else if (isHappy) {
                img.src = 'ana_happy.png'
            } else {
                img.src = 'ana_neutral.png'
            }
        })
        .catch(() => {
            console.log("server unreachable");
        });
}

updateStatus();
setInterval(updateStatus, 3000);
