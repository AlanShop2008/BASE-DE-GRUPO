import { execSync } from 'child_process'

let handler = async (m, { conn, text }) => {
  try {
    await m.react('🕓')

    global.isUpdating = true

    const command = 'git pull' + (m.fromMe && text ? ' ' + text : '')
    const stdout = execSync(command, {
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 20,
    }).trim()

    // Si no hubo cambios reales
    if (/Already up to date\.|Ya está actualizado\./i.test(stdout)) {
      global.isUpdating = false
      await conn.reply(m.chat, `💫 YA ESTÁ ACTUALIZADO.\n\n\`\`\`${stdout}\`\`\``, m)
      return await m.react('✅')
    }

    let changed = ''
    try {
      changed = execSync('git diff --name-only HEAD@{1} HEAD', { encoding: 'utf-8' }).trim()
    } catch {
      changed = ''
    }

    let pluginsCount = Object.keys(global.plugins || {}).length
    if (global.filesInit) {
      await global.filesInit('commands')
      pluginsCount = Object.keys(global.plugins || {}).length
    }

    const coreTouched =
      changed &&
      changed
        .split('\n')
        .some((f) =>
          /^(index\.js|handler\.js|config\.js|lib\/|package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock)/i.test(f.trim())
        )

    global.isUpdating = false

    let replyText =
      `《★》 *Actualizado con éxito ✔*\n\n` +
      `🪐 Resultado de Git:\n\`\`\`${stdout}\`\`\`\n` +
      `🌙 Plugins cargados: ${pluginsCount}`

    if (changed) {
      const list = changed.split('\n').filter(Boolean)
      replyText += `\n\n🍭 Archivos actualizados (${list.length}):\n` + list.slice(0, 35).map(x => `• ${x}`).join('\n')
      if (list.length > 35) replyText += `\n• ...`
    }

    if (coreTouched) {
      replyText += `\n\n⚠️ *Se detectaron cambios en archivos principales.*` +
        `\nPara que todo aplique al 100%, es recomendable reiniciar el proceso.`
    }

    await conn.reply(m.chat, replyText, m)
    await m.react('✅')
  } catch (e) {
    global.isUpdating = false
    const msg = `🌙 Error al actualizar:\n\`\`\`${String(e?.message || e)}\`\`\``
    await conn.reply(m.chat, msg, m)
    await m.react(error)
  }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'actualizar', 'fix', 'fixed']
handler.rowner = true

export default handler