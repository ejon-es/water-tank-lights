const HOUR_TURN_ON = 8;
const HOUR_TURN_OFF = 22;

const sendJSONToLights = (payload: string) => {
    return fetch("http://192.168.86.36/json/state", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: payload
    })
}

const updateWaterTankLights = async () => {
    const currentWaterLevel = await fetch("https://npbshnwpzucklggglbnw.supabase.co/functions/v1/get-water-level", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(networkResponse => {
        return networkResponse.json().then(jsonResponse => {
            return jsonResponse.percent_full as number
        })
    })
    const numberLedsLit = Math.floor((260 / 100) * currentWaterLevel) + 12 // extra to account for LEDs no going to the very top of tank
    console.log(`Water Level is ${currentWaterLevel}, leds lit:${numberLedsLit}`)
    const payload = `{"seg":{"i":[0,${numberLedsLit},"0000FF",${numberLedsLit},${numberLedsLit},"FF0000",${numberLedsLit + 1},260,"00FF00"]}}`
    console.log(payload)
    if (currentWaterLevel > 0 && currentWaterLevel <= 100) {
        const wledUpdateResponse = await sendJSONToLights(payload)
        wledUpdateResponse.json().then(res => {
            console.log(JSON.stringify(res))
        })

    }
}

const isTankLightOn = (): boolean => {
    const currentHour = new Date().getHours()
    const isLightOn = currentHour >= HOUR_TURN_ON && currentHour < HOUR_TURN_OFF
    console.log(`Current hour is ${currentHour}, light should be ${isLightOn ? "on" : "off"}`)
    return isLightOn
}

const setTankLightStatus = async (isOn: boolean) => {
    const payload = {
        on: isOn,
        bri: 150
    }
    const response = await sendJSONToLights(JSON.stringify(payload))
    response.json().then(json => {
        console.log(`Set light status response ${JSON.stringify(json)}`)
    })
}

setTankLightStatus(isTankLightOn()).then(() => updateWaterTankLights())