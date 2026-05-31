const axios = require('axios')

case 'curp': {

if (!text) {
return reply('⚠️ Uso correcto:\n.curp TUCURP')
}

const curp = text.trim().toUpperCase()

reply('🔍 Consultando CURP...')

try {

const token = '0fa5280e-9b9a-43c3-92dc-2fadde99870f'

const url = `https://api.valida-curp.com.mx/curp/obtener_datos/?token=${token}&curp=${curp}`

const { data } = await axios.get(url)

console.log(data)

const r = data.response.Solicitante

reply(`
╭━━〔 📄 CURP ENCONTRADA 〕━━⬣

👤 Nombre:
${r.Nombres} ${r.ApellidoPaterno} ${r.ApellidoMaterno}

🆔 CURP:
${r.CURP}

🚹 Sexo:
${r.Sexo}

🎂 Nacimiento:
${r.FechaNacimiento}

📍 Estado:
${r.EntidadNacimiento}

✅ Estatus:
${r.StatusCurp}

╰━━━━━━━━━━━━━━━━⬣
`)

} catch (e) {

console.log(e)

reply('❌ No se pudo consultar la CURP')

}

}
break
