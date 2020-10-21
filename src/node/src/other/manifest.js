const fs = require('fs')
const path = require('path')

const manifestPath =
  '/Users/shangjunhao/WorkProject/ERP_odoo/odooDev/oscg/ss_web_page/__manifest__.py'

const viewsPath =
  '/Users/shangjunhao/WorkProject/ERP_odoo/odooDev/oscg/ss_web_page/views'

function manifestToJS(content) {
  let cont = content
    .replace(/True/g, 'true')
    .replace(/False/g, 'false')
    .replace(/True/g, 'true')
  cont = eval('(' + cont + ')')
  return cont
}

function manifestToString(cont) {
  let writeContent = JSON.stringify(cont, '', '\t')
  writeContent = writeContent
    .replace(/true/g, 'True')
    .replace(/false/g, 'False')
    .replace(/\"/g, "'")
  return writeContent
}

function writeManifest() {
  // 获取 manifest 对象
  const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
  const manifest = manifestToJS(manifestContent)

  // 获取 views 目录集合 并修改 manifest
  const viewsBefore = 'other/menu.xml'
  const viewsAfter = 'views/extend.xml'
  const viewsAllFile = fs.readdirSync(viewsPath, 'utf-8')
  const viewsConfig = viewsAllFile.map((item) => `views/${item}`)
  manifest.data = [viewsBefore, ...viewsConfig]

  // 重写
  let writeContent = manifestToString(manifest)
  fs.writeFileSync(manifestPath, writeContent)

  console.log('更新 manifest 成功!')
}

module.exports = {
  writeManifest,
}
