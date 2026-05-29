let menuText = `
🌸⃟ 𓆩 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 𓆪 ⃟🌸

꒰ঌ 𝖧𝗈𝗅𝖺, *${name}* ໒꒱
╭───────────────╮
│ ୨୧ 𝖬𝖾𝗇𝗎́ 𝗉𝗋𝗂𝗇𝖼𝗂𝗉𝖺𝗅
│ ୨୧ 𝖥𝖾𝖼𝗁𝖺: *${fecha}*
│ ୨୧ 𝖢𝗈𝗆𝖺𝗇𝖽𝗈𝗌: *${totalCommands}*
│ ୨୧ 𝖢𝗋𝖾𝖺𝖽𝗈𝗋: *ALAN SHOP*
╰───────────────╯

♡ 𝖲𝖾𝗅𝖾𝖼𝖼𝗂𝗈𝗇𝖺 𝗎𝗇𝖺 𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂́𝖺 ♡
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

┌ ୨୧ ${tags[tag]}
│
${comandos.map((menu) =>
  `│ 𖹭 ${_p}${menu.cmd}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')}
│
└─────────────── ୨୧`
}

menuText += `

𖹭 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 𖹭
𝖡𝗈𝗍 𝗉𝗋𝖾𝗆𝗂𝗎𝗆 𝗉𝖺𝗋𝖺 𝗀𝗋𝗎𝗉𝗈𝗌, 𝗏𝖾𝗇𝗍𝖺𝗌 𝗒 𝗌𝖾𝗋𝗏𝗂𝖼𝗂𝗈𝗌.
`
