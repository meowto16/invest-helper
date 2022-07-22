import * as process from 'process'

import * as puppeteer from 'puppeteer'
import prompts from 'prompts'

type Result = {
  cons: string[] | null
  pros: string[] | null
}

const main = async () => {
  const { ticker } = await prompts({
    type: 'text',
    name: 'ticker',
    message: 'Введите ticker, например (ROSN)',
    format: value => value.toUpperCase()
  })

  const PAGE_URL = `https://smart-lab.ru/q/${ticker}/f/y/`

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.on('response', (response) => {
    if (response.url() === PAGE_URL) {
      if (response.status() === 404) {
        console.error('Bad ticker, page not found')
        console.log(`URL: ${PAGE_URL}`)
        process.exit()
      }

      if (response.status() >= 500) {
        console.error('Server error')
        process.exit()
      }
    }
  });

  await page.goto(PAGE_URL)

  const $reasons = await page.$('.company_description .reasons')

  const result: Result = {
    cons: null,
    pros: null
  }

  if ($reasons) {
    const $cons = await $reasons.$('.reasons-up')
    const $pros = await $reasons.$('.reasons-down')

    if ($cons) {
      result.cons = await $cons.$$eval('ul > li', (nodes) => nodes.map(node => node.innerHTML))
    }

    if ($pros) {
      result.pros = await $pros.$$eval('ul > li', (nodes) => nodes.map(node => node.textContent))
    }
  }

  if (result.pros?.length) {
    console.log('Плюсы:')
    result.pros.forEach((item) => console.log(`- ${item}`))
  }

  if (result.cons?.length) {
    console.log('Минусы:')
    result.cons.forEach((item) => console.log(`- ${item}`))
  }

  await browser.close()
}

void main()
