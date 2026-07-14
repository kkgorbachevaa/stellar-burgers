import { expect, test } from '@playwright/test';

const HAR_PATH = './tests/hars/constructor.har';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR_PATH, {
      url: '**/api/**',
      update: false
    });

    await page.goto('/');
  });

  test('добавляет булку и начинку в конструктор', async ({ page }) => {
    const burgerConstructor = page.getByTestId('burger-constructor');
    await page
      .getByTestId('ingredient-test-bun-1')
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .getByTestId('ingredient-test-main-1')
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(
      burgerConstructor.getByText('Тестовая булка (верх)', { exact: true })
    ).toBeVisible();

    await expect(
      burgerConstructor.getByText('Тестовая булка (низ)', { exact: true })
    ).toBeVisible();

    await expect(
      burgerConstructor.getByText('Тестовая начинка', { exact: true })
    ).toBeVisible();
  });

  test('открывает модальное окно ингредиента и закрывает его крестиком', async ({
    page
  }) => {
    await page
      .getByTestId('ingredient-test-main-1')
      .getByText('Тестовая начинка', { exact: true })
      .click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(
      modal.getByText('Детали ингредиента', { exact: true })
    ).toBeVisible();
    await expect(
      modal.getByText('Тестовая начинка', { exact: true })
    ).toBeVisible();
    await expect(modal.getByText('200', { exact: true })).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();
  });

  test('закрывает модальное окно ингредиента по клику на оверлей', async ({
    page
  }) => {
    await page
      .getByTestId('ingredient-test-sauce-1')
      .getByText('Тестовый соус', { exact: true })
      .click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 10, y: 10 }
    });

    await expect(modal).not.toBeVisible();
  });

  test('создаёт заказ и очищает конструктор', async ({ page }) => {
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'test-access-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.reload();

    await page
      .getByTestId('ingredient-test-bun-1')
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .getByTestId('ingredient-test-main-1')
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    const burgerConstructor = page.getByTestId('burger-constructor');

    await expect(modal).toBeVisible();
    await expect(modal.getByTestId('order-number')).toHaveText('12345');

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();
    await expect(
      burgerConstructor.getByText('Выберите начинку', { exact: true })
    ).toBeVisible();
    await expect(
      burgerConstructor.getByText('Выберите булки', { exact: true })
    ).toHaveCount(2);
    await expect(
      burgerConstructor.getByText('Тестовая начинка', { exact: true })
    ).toHaveCount(0);
  });
});
