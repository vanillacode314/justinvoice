import { expect, test } from '@playwright/test'

test('index page has expected link', async ({ page }) => {
	await page.goto('/')
	expect(await page.textContent('a')).toBe('App')
})
