import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const screenshots = "artifacts";

async function waitForApp(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("My Tasks")).toBeVisible();
  await expect(page.getByTestId("daily-inspiration-card")).toBeVisible();
}

test.describe("TaskFlow rendered verification", () => {
  test("renders the core task list UI and real API card", async ({ page }, testInfo) => {
    await waitForApp(page);

    await expect(page.getByLabel("Search tasks")).toBeVisible();
    await expect(page.getByLabel("All tasks")).toBeVisible();
    await expect(page.getByLabel("Add task")).toBeVisible();

    const inspirationCard = page.getByTestId("daily-inspiration-card");
    await expect(inspirationCard.getByText(/Next quote in:/)).toBeVisible();
    await expect(page.getByLabel("Refresh daily inspiration")).toHaveCount(0);

    await page.screenshot({
      path: `${screenshots}/${testInfo.project.name}-task-list.png`,
      fullPage: true
    });
  });

  test("creates a task and opens its detail screen without layout breakage", async ({ page }, testInfo) => {
    await waitForApp(page);

    await page.getByLabel("Add task").click();
    await expect(page.getByLabel("Task title")).toBeVisible();
    await page.getByLabel("Task title").fill("Review PRITECH submission");
    await page.getByLabel("Task description").fill("Check layout, navigation, details, and deletion flow.");
    await page.getByLabel("Create task").click();

    await expect(page.getByText("Review PRITECH submission")).toBeVisible();
    await page.getByLabel("Open details for Review PRITECH submission").click();
    await expect(page.getByText("Check layout, navigation, details, and deletion flow.").last()).toBeVisible();
    await expect(page.getByRole("button", { name: "Mark task complete" }).last()).toBeVisible();
    await expect(page.getByRole("button", { name: "Delete task" }).last()).toBeVisible();

    await page.screenshot({
      path: `${screenshots}/${testInfo.project.name}-task-details.png`,
      fullPage: true
    });
  });

  test("renders cleanly in dark mode", async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await waitForApp(page);

    const background = await page.getByTestId("taskflow-home").evaluate((node) => {
      return window.getComputedStyle(node).backgroundColor;
    });

    expect(background).not.toBe("rgb(248, 250, 252)");
    await page.screenshot({
      path: `${screenshots}/${testInfo.project.name}-dark-mode.png`,
      fullPage: true
    });
  });

  test("has no serious automated accessibility violations", async ({ page }) => {
    await waitForApp(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const seriousViolations = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? "")
    );

    expect(seriousViolations).toEqual([]);
  });
});

