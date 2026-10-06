/** Finance calculation helpers — keep money math out of UI components */

export function budgetRemaining(allocated: number, spent: number, committed = 0): number {
  return Math.max(0, allocated - spent - committed);
}

export function budgetUsedPct(allocated: number, spent: number): number {
  if (allocated <= 0) return 0;
  return Math.round((spent / allocated) * 1000) / 10;
}

export function variance(actual: number, planned: number): number {
  return actual - planned;
}

export function variancePct(actual: number, planned: number): number {
  if (planned === 0) return 0;
  return Math.round(((actual - planned) / planned) * 1000) / 10;
}

export function monthlyBurn(expensesThisMonth: number, payrollThisMonth: number): number {
  return expensesThisMonth + payrollThisMonth;
}

export function runwayMonths(remainingBudget: number, monthlyBurnAmount: number): number | null {
  if (monthlyBurnAmount <= 0) return null;
  return Math.round((remainingBudget / monthlyBurnAmount) * 10) / 10;
}

export function utilizationPct(assignedHours: number, capacityHours: number): number {
  if (capacityHours <= 0) return 0;
  return Math.round((assignedHours / capacityHours) * 1000) / 10;
}

export function forecastSpend(
  spentToDate: number,
  daysElapsed: number,
  totalDays: number,
): number {
  if (daysElapsed <= 0) return spentToDate;
  const daily = spentToDate / daysElapsed;
  return Math.round(daily * totalDays);
}
