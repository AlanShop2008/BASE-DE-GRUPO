let menuText = `
╭━━━〔 🧬 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 〕━━━╮
┃ 👤 𝐔𝐬𝐮𝐚𝐫𝐢𝐨: *${name}*
┃ 📆 𝐅𝐞𝐜𝐡𝐚: *${fecha}*
┃ ⚡ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬: *${totalCommands}*
┃ 👑 𝐂𝐫𝐞𝐚𝐝𝐨𝐫: *ALAN SHOP*
╰━━━━━━━━━━━━━━━━━━╯

╭─〔 🌐 𝐂𝐄𝐍𝐓𝐑𝐎 𝐃𝐄 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 〕─╮
│ 𝖤𝗅𝗂𝗀𝖾 𝗎𝗇𝖺 𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂́𝖺 𝗒 𝖾𝗃𝖾𝖼𝗎𝗍𝖺 𝗌𝗎𝗌 𝖼𝗈𝗆𝖺𝗇𝖽𝗈𝗌.
╰────────────────────╯
`

for (let tag in tags) {
  let comandos = help
    .filter(menu => menu.tags.includes(tag))
    .flatMap(menu =>
      menu.help
        .filter(cmd => cmd && cmd.trim())
        .map(cmd => ({
          cmd: cmd.trim(),
          limit: menu.limit,
          premium: menu.premium
        }))
    )

  if (!comandos.length) continue

  menuText += `

╭━━〔 ${tags[tag]} 〕━━╮
${comandos.map((menu, i) =>
  `│ ${String(i + 1).padStart(2, '0')} ⟡ ${_p}${menu.cmd}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')}
╰━━━━━━━━━━━━━━━━╯`
}

menuText += `

╭─〔 💎 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 〕─╮
│ Sistema premium para grupos y ventas.
╰────────────────╯
`
