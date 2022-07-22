import * as puppeteer from 'puppeteer'

type Result = {
  cons: string[] | null
  pros: string[] | null
}

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://smart-lab.ru/q/ROSN/f/y/')

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

  await browser.close()
}

void main()
