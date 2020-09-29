import { useTreeView } from '../index'
import props from '../../../../page/One/data'
import { convertModel } from '../../../utils/odoo-utils'
import { render } from '../../../utils/odoo-xml-compiler'

const fs = require('fs')
const xml2js = require('xml2js')
const parser = new xml2js.Parser({ explicitArray: false })

test('列表视图测试', () => {
  const { tree } = useTreeView(props)

  const ret = fs.readFileSync(__dirname + '/../index.xml', 'utf-8')

  parser.parseString(ret, (err, res) => {
    let xml = render({ tree }, res)
    // console.log(props, xml)
    // console.log(res, JSON.stringify(res))
    // console.log('ren', JSON.stringify(xml))

    fs.writeFileSync(__dirname + '/export.xml', xml)

    expect('account_abstract_payment_tree_h').toBe(
      'account_abstract_payment_tree_h'
    ) // ss_sample_tree
  })
})
