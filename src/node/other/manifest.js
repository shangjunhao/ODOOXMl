const fs = require('fs')
const path = require('path')

const manifestPath =
  '/Users/shangjunhao/WorkProject/ERP_odoo/odooDev/oscg/ss_web_page/__manifest__.py'

const viewsPath =
  '/Users/shangjunhao/WorkProject/ERP_odoo/odooDev/oscg/ss_web_page/views'

function writeManifest() {
  // 获取 manifest 对象
  const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
  const manifest = eval('(' + manifestContent + ')')

  // 获取 views 目录集合 并修改 manifest
  const viewsAllFile = fs.readdirSync(viewsPath, 'utf-8')
  manifest.data = viewsAllFile.map((item) => `views/${item}`)

  // 重写
  let writeContent = JSON.stringify(manifest, '', '\t')
  writeContent = writeContent.replace(/\"/g, "'")
  fs.writeFileSync(manifestPath, writeContent)

  console.log(manifest, viewsAllFile)
}

module.exports = {
  writeManifest,
}
