// Command By WillZek
// Wa.me/50557865603

let willzek = async (m, { conn }) => {
  await m.reply('🌙 Reiniciando manualmente...')
  process.exit(1)
}

willzek.help = ['restart']
willzek.tags = ['owner']
willzek.command = ['restart', 'reiniciar']
willzek.rowner = true

export default willzek

const interval = 1000 * 60 * 60 
setInterval(() => {
  console.log('🌙 Reinicio automático cada 1 hora...')
  process.exit(1)
}, interval)
